(() => {
  const grid = document.querySelector("[data-live-news-grid]");
  const meta = document.querySelector("[data-live-news-meta]");
  const filters = [...document.querySelectorAll("[data-news-filter]")];
  if (!grid) return;
  let stories = [];
  let activeFilter = "Latest";

  const sourcePalette = {
    "Wamda": "wm",
    "The National": "tn",
    "Arabian Business": "ab",
    "Gulf Business": "gb",
    "ZAWYA": "zw",
    "Arab News": "an",
    "Economy Middle East": "em",
    "PR Newswire": "pr",
    "TechCrunch": "tc",
    "PYMNTS": "py"
  };

  const initials = name => name.split(/\s+/).map(part => part[0]).join("").slice(0, 3).toUpperCase();
  const dateText = value => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const createFallback = item => {
    const box = document.createElement("div");
    box.className = "live-news-fallback " + (sourcePalette[item.source] || "");
    const mark = document.createElement("strong");
    mark.textContent = initials(item.source);
    const line = document.createElement("span");
    line.textContent = item.source;
    box.append(mark, line);
    return box;
  };

  const card = item => {
    const a = document.createElement("a");
    a.className = "live-news-card";
    a.href = item.url || item.googleUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    const media = document.createElement("div");
    media.className = "live-news-media";
    const fallback = createFallback(item);
    media.appendChild(fallback);

    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = "";
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.addEventListener("load", () => fallback.hidden = true);
      img.addEventListener("error", () => img.remove());
      media.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "live-news-copy";

    const source = document.createElement("div");
    source.className = "live-news-source";
    const sourceName = document.createElement("span");
    sourceName.textContent = item.source;
    const detail = document.createElement("small");
    detail.textContent = [item.market, item.topic, dateText(item.publishedAt)].filter(Boolean).join(" · ");
    source.append(sourceName, detail);

    const h3 = document.createElement("h3");
    h3.textContent = item.title;

    const p = document.createElement("p");
    p.textContent = item.summary || "";

    const cta = document.createElement("b");
    cta.textContent = "Read at source";

    body.append(source, h3, p, cta);
    a.append(media, body);
    return a;
  };

  const render = () => {
    const filtered = stories.filter(item => {
      if (activeFilter === "Latest") return true;
      if (activeFilter === "GCC") return item.isGcc;
      return item.topic === activeFilter;
    }).slice(0, 12);
    grid.replaceChildren(...filtered.map(card));
    if (!filtered.length) {
      grid.innerHTML = '<div class="live-news-unavailable"><strong>No matching stories yet.</strong><span>The feed will update automatically as publishers release new coverage.</span></div>';
    }
  };

  filters.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.newsFilter;
    filters.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    render();
  }));

  fetch("/api/news", { headers: { "Accept": "application/json" } })
    .then(response => response.ok ? response.json() : Promise.reject(new Error("news")))
    .then(data => {
      if (!Array.isArray(data.news) || !data.news.length) throw new Error("empty");
      stories = data.news;
      render();
      if (meta) {
        meta.textContent = data.news.length + " current stories · refreshed from " + data.sourceCount + " selected publishers";
      }
    })
    .catch(() => {
      grid.innerHTML = '<div class="live-news-unavailable"><strong>Live news is refreshing.</strong><span>The rest of the site remains available while the feed reconnects.</span></div>';
      if (meta) meta.textContent = "Live feed temporarily unavailable";
    });
})();