(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const body = document.body;
  const header = document.querySelector(".site-header");

  if (header) {
    const onScroll = () => body.classList.toggle("has-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (reduced) return;

  const targets = [
    ...document.querySelectorAll(
      ".v3-page main > section, body:not(.v3-page) main > section, body:not(.v3-page) .hero, .report-section, .article-photo, .article-visual-stage"
    )
  ];

  targets.forEach((el, index) => {
    el.classList.add("ui-reveal");
    el.style.setProperty("--reveal-delay", Math.min(index % 4, 3) * 45 + "ms");
  });

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("ui-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

  targets.forEach(el => observer.observe(el));

  const hero = document.querySelector(".v3-hero-media");
  if (hero && window.matchMedia("(pointer:fine)").matches) {
    hero.addEventListener("pointermove", event => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      hero.style.setProperty("--hero-x", x.toFixed(2) + "px");
      hero.style.setProperty("--hero-y", y.toFixed(2) + "px");
    });
    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--hero-x", "0px");
      hero.style.setProperty("--hero-y", "0px");
    });
  }
})();