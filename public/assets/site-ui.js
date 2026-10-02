(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const body = document.body;
  const header = document.querySelector(".site-header");

  // Navigation and contact measurement must also work with reduced motion.
  const mobileNav = document.querySelector(".mobile-nav");
  if (mobileNav) {
    const trigger = mobileNav.querySelector("summary");
    const panel = mobileNav.querySelector(".mobile-panel");
    const syncNavigation = () => {
      trigger.setAttribute("aria-expanded", String(mobileNav.open));
      trigger.setAttribute("aria-label", mobileNav.open ? "Close navigation" : "Open navigation");
    };
    const closeNavigation = (returnFocus = false) => {
      mobileNav.open = false;
      syncNavigation();
      if (returnFocus) trigger.focus();
    };
    syncNavigation();
    mobileNav.addEventListener("toggle", syncNavigation);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && mobileNav.open) {
        event.preventDefault();
        closeNavigation(true);
      }
    });
    document.addEventListener("click", event => {
      if (!mobileNav.open) return;
      if (panel.contains(event.target)) {
        if (event.target.closest?.("a[href]")) closeNavigation();
      } else if (!trigger.contains(event.target)) {
        closeNavigation();
      }
    });
  }

  // These are interest signals, never proof of a sent or qualified enquiry.
  document.addEventListener("click", event => {
    const link = event.target.closest?.("a[href]");
    if (!link || typeof window.gtag !== "function") return;
    const href = link.getAttribute("href");
    let contactMethod;
    if (/^mailto:/i.test(href)) contactMethod = "email";
    else if (/^tel:/i.test(href)) contactMethod = "phone";
    else {
      try {
        const url = new URL(href, window.location.origin);
        if (url.hostname === "www.linkedin.com" && url.pathname.replace(/\/$/, "") === "/in/harisaslam") {
          contactMethod = "linkedin";
        } else if (url.hostname === "wa.me") {
          contactMethod = "whatsapp";
        }
      } catch { return; }
    }
    if (!contactMethod) return;
    window.gtag("event", `contact_${contactMethod}_click`, {
      contact_method: contactMethod,
      page_path: window.location.pathname,
      link_context: link.closest("footer") ? "footer" : link.closest("main") ? "main" : "other"
    });
  });

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
