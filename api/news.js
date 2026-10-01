const SOURCES = [
  { name: "Wamda", domain: "wamda.com", market: "MENA" },
  { name: "The National", domain: "thenationalnews.com", market: "UAE / GCC" },
  { name: "Arabian Business", domain: "arabianbusiness.com", market: "GCC" },
  { name: "Gulf Business", domain: "gulfbusiness.com", market: "GCC" },
  { name: "ZAWYA", domain: "zawya.com", market: "MENA / GCC" },
  { name: "Arab News", domain: "arabnews.com", market: "Saudi Arabia / GCC" },
  { name: "Economy Middle East", domain: "economymiddleeast.com", market: "GCC" },
  { name: "PR Newswire", domain: "prnewswire.com", market: "Global / GCC relevance" },
  { name: "TechCrunch", domain: "techcrunch.com", market: "Global technology" },
  { name: "PYMNTS", domain: "pymnts.com", market: "Payments / commerce" }
];

const TOPICS = [
  '"digital commerce"', "ecommerce", "marketplace", "retail", "fintech", "payments",
  '"artificial intelligence"', '"agentic AI"', '"agentic commerce"', "logistics",
  '"working capital"', '"enterprise technology"', '"market entry"'
];

const decode = value => String(value || "")
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .trim();

const stripHtml = value => decode(String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));

const field = (xml, tag) => {
  const match = xml.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">", "i"));
  return match ? decode(match[1]) : "";
};

const itemsFromRss = xml => [...String(xml || "").matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(match => {
  const block = match[0];
  return {
    title: stripHtml(field(block, "title")).replace(/\s+-\s+[^-]+$/, "").trim(),
    link: stripHtml(field(block, "link")),
    publishedAt: stripHtml(field(block, "pubDate")),
    description: stripHtml(field(block, "description"))
  };
}).filter(item => item.title && item.link);

const timeoutSignal = ms => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
};

async function fetchText(url, ms = 5000) {
  const t = timeoutSignal(ms);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: t.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HarisAslamNews/1.0; +https://www.mharisaslam.com/)"
      }
    });
    return { ok: response.ok, url: response.url, text: await response.text() };
  } catch {
    return { ok: false, url, text: "" };
  } finally {
    t.clear();
  }
}

const escapeRegExp = value => value.replace(/[.*+?^()|[\]{}\\-]/g, "\\$&");

function directUrlFromGoogle(html, domain) {
  const clean = String(html || "").replace(/\\u003d/g, "=").replace(/\\u0026/g, "&").replace(/\\\//g, "/");
  const pattern = new RegExp('https?:\\/\\/(?:www\\.)?' + escapeRegExp(domain) + '[^"\\s<>&]+', "i");
  const match = clean.match(pattern);
  return match ? decodeURIComponent(match[0].replace(/\\u0026/g, "&")) : "";
}

function ogValue(html, property) {
  const patterns = [
    new RegExp('<meta[^>]+property=["\\\']' + property + '["\\\'][^>]+content=["\\\']([^"\\\']+)["\\\']', "i"),
    new RegExp('<meta[^>]+content=["\\\']([^"\\\']+)["\\\'][^>]+property=["\\\']' + property + '["\\\']', "i"),
    new RegExp('<meta[^>]+name=["\\\']' + property + '["\\\'][^>]+content=["\\\']([^"\\\']+)["\\\']', "i")
  ];
  for (const pattern of patterns) {
    const match = String(html || "").match(pattern);
    if (match) return decode(match[1]);
  }
  return "";
}

async function enrich(candidate) {
  let articleUrl = candidate.link;
  let image = "";
  let summary = candidate.description;

  const google = await fetchText(candidate.link, 4500);
  if (google.ok) {
    if (!google.url.includes("news.google.com")) articleUrl = google.url;
    else articleUrl = directUrlFromGoogle(google.text, candidate.domain) || candidate.link;
  }

  if (articleUrl && !articleUrl.includes("news.google.com")) {
    const article = await fetchText(articleUrl, 4500);
    if (article.ok) {
      image = ogValue(article.text, "og:image") || ogValue(article.text, "twitter:image");
      summary = ogValue(article.text, "og:description") || ogValue(article.text, "description") || summary;
    }
  }

  return {
    source: candidate.source,
    market: candidate.market,
    domain: candidate.domain,
    title: candidate.title,
    url: articleUrl,
    googleUrl: candidate.link,
    image,
    summary: stripHtml(summary).slice(0, 220),
    publishedAt: candidate.publishedAt
  };
}

async function latestForSource(source) {
  const query = "(" + TOPICS.join(" OR ") + ") site:" + source.domain;
  const url = "https://news.google.com/rss/search?q=" + encodeURIComponent(query) +
    "&hl=en&gl=AE&ceid=AE:en";
  const feed = await fetchText(url, 5000);
  if (!feed.ok) return null;
  const item = itemsFromRss(feed.text)[0];
  return item ? { ...item, source: source.name, domain: source.domain, market: source.market } : null;
}

export async function GET() {
  const candidates = (await Promise.all(SOURCES.map(latestForSource))).filter(Boolean);

  const enriched = [];
  for (let i = 0; i < candidates.length; i += 5) {
    const batch = await Promise.all(candidates.slice(i, i + 5).map(enrich));
    enriched.push(...batch);
  }

  const news = enriched
    .filter(item => item.title)
    .sort((a, b) => Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0));

  return Response.json(
    {
      updatedAt: new Date().toISOString(),
      sourceCount: SOURCES.length,
      sources: SOURCES.map(({ name, market, domain }) => ({ name, market, domain })),
      news
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=10800, stale-while-revalidate=43200",
        "X-Robots-Tag": "noindex, nofollow"
      }
    }
  );
}
