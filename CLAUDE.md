# mharisaslam-website

## What this is

The professional portfolio / personal site for **Muhammad Haris Aslam** — a GCC digital-commerce operator, marketplace founder, retail-turnaround leader, venture builder and angel investor. It's deployed at `https://www.mharisaslam.com`.

The site presents his executive profile, areas of expertise (retail turnaround, marketplace strategy, e-commerce transformation), venture record, an "AI Lab" of applied-AI projects, market-specific pages for Qatar/Oman/Saudi Arabia/UAE, and contact/insights sections. Content principles (from `README.md`, worth respecting when editing copy):

- Only use verified experience already documented for Haris.
- Never claim physical offices or legal entities in a market — market pages describe operating experience/perspective, not local presence.
- Don't publish placeholder insight articles — add one only when its full body and evidence are ready.
- Keep a single, consistent `Person` JSON-LD entity at `https://www.mharisaslam.com/#person`.

## Stack

Deliberately dependency-free: **no framework**. `package.json` declares zero runtime dependencies — everything is plain Node ESM using only `node:fs/promises`, `node:path`, `node:url`. Package manager is pnpm (`pnpm-lock.yaml`). Two scripts:

```
npm run build   # node scripts/build.mjs  → writes dist/
npm run check   # node scripts/check.mjs  → validates dist/
```

There is no dev server — the documented local loop (per `README.md`) is build, then check.

## Content model: `src/content.mjs`

This is the single source of truth for every page's content. It exports:

- **`site`** — global constants: `name`, `shortName`, `origin` (`https://www.mharisaslam.com`), `email`, `phone`, `linkedin`.
- **`pages`** — an array of page objects, each shaped like:
  ```js
  {
    path: "/advisory",           // route, becomes dist/advisory/index.html
    type: "ProfilePage",         // schema.org type used in JSON-LD (ProfilePage, CollectionPage, WebPage, ContactPage)
    title: "...",                // <title> and og:title/twitter:title — keep ≤65 chars (enforced by check.mjs)
    description: "...",          // meta description — keep 110–165 chars (enforced by check.mjs)
    eyebrow: "...", h1: "...", intro: "...",  // hero copy
    heroAside: "...",            // optional custom hero-right HTML; falls back to a default aside if omitted
    project: { name, status, description },   // optional — triggers a SoftwareApplication JSON-LD node (see below)
    body: `...`                  // page body HTML, built from the helper functions below
  }
  ```
- **Helper functions** used to compose `body` HTML consistently: `section()`, `splitSection()`, `cards()`, `caseStudy()`, `aiProject()`, `numbered()`, `pillLinks()`, `cta()`.
- **Page-factory helpers** for repeated page shapes:
  - `projectPage(path, projectName, title, description, status, category, projectDescription, problem)` — used for the two AI Lab project pages (`/ai-commerce`, `/career-runway`). Sets `project: {...}` automatically, which `schemaGraph()` in `build.mjs` turns into a `SoftwareApplication` JSON-LD node.
  - `marketPage(path, market, city, title, description, h1, points, experience)` — used for the four GCC market pages (`/markets/qatar`, `/markets/oman`, `/markets/saudi-arabia`, `/markets/uae`).

Current route list (17 pages + `/404`): `/`, `/about`, `/advisory`, `/retail-turnaround`, `/marketplace-strategy`, `/ecommerce-transformation`, `/ventures-eir`, `/ai-lab`, `/ai-commerce`, `/career-runway`, `/markets`, `/markets/qatar`, `/markets/oman`, `/markets/saudi-arabia`, `/markets/uae`, `/insights`, `/contact`.

**To add a new page:** add an entry to `pages` (or call `projectPage()`/`marketPage()` if it fits one of those shapes). Then:
1. Add its path segment to the `names` map in `breadcrumbItems()` in `scripts/build.mjs` (line ~83), or the breadcrumb will fall back to the raw slug.
2. If the new nav item needs its own top-level nav link, update `header()` in `scripts/build.mjs`.
3. If an old `.dc.html` or slug URL should redirect to it, add a rule to `vercel.json`.
4. Run `npm run build && npm run check` — `check.mjs` will catch broken internal links, missing meta, and sitemap gaps automatically. Note `check.mjs` also has a couple of **hardcoded content assertions** specific to the AI Lab and its two project pages (lines ~74–88) — a genuinely new project or section that should be similarly protected will need its own assertions added there.

## Build pipeline: `scripts/build.mjs`

Reads `pages` and `site` from `content.mjs` and, for each page, renders a full HTML document to `dist/<path>/index.html` (root path → `dist/index.html`). The **page chrome lives in `build.mjs`, not `content.mjs`** — this is the important split:

- `render(page)` — assembles `<head>` (title, description, robots meta, canonical, Open Graph, Twitter card, theme-color, stylesheet/favicon links, JSON-LD `<script>`) and `<body>` (skip link, `header()`, breadcrumbs, `<main>` with hero + `page.body`, `footer()`).
- `header(path)` / `footer()` — site-wide nav and footer, defined once here.
- `schemaGraph(page, url, crumbs)` — builds the JSON-LD `@graph` per page: a `Person`, `WebSite`, the page's own type (`WebPage`/`ProfilePage`/`CollectionPage`/`ContactPage`), and a `BreadcrumbList`. If `page.project` is set, it also adds a `SoftwareApplication` node and points `webpage.mainEntity` at it.
- `breadcrumbItems(path)` — maps path segments to display names for breadcrumb rendering.
- `sitemap()` — generates `sitemap.xml` from every entry in `pages` automatically (no manual step needed when adding a page).
- Also writes `404.html` (via `render404()`) and a static `robots.txt` (`Allow: /` + sitemap pointer).
- Copies `src/styles.css` → `dist/assets/site.css`, and `public/assets/*` (favicon, portrait, OG card image) → `dist/assets/`.

`src/styles.css` is the single global stylesheet — no CSS modules/scoping, one file for the whole site.

## The `.dc.html` naming convention (legacy)

Earlier versions of the site existed as individual static `*.dc.html` files (e.g. `advisory.dc.html`, `ai-lab.dc.html`, `markets-qatar.dc.html`). The site has since been migrated to this generated, clean-URL system (`content.mjs` + `build.mjs`) — those `.dc.html` files no longer exist in the repo. What remains is a set of **permanent redirects in `vercel.json`** mapping every old `.dc.html` URL (and a couple of retired slugs like `/ventures` and `/markets/ksa`) to its new canonical path, so existing inbound links and search-engine indexing aren't broken. New pages should never be created as `.dc.html` files — that convention is retired; it only survives as redirect sources.

## Routing & deployment: `vercel.json`

- `buildCommand: "npm run build"`, `outputDirectory: "dist"` — Vercel just runs the Node build script and serves the static output.
- `trailingSlash: false` — clean URLs, no trailing slash.
- `redirects` — the legacy `.dc.html` → clean-URL mappings described above, all `permanent: true` (301s). `check.mjs` verifies every redirect here is permanent and points at a route that actually exists in the built output.
- `headers` — long-lived caching (`max-age=86400`, SWR `604800`) on `/assets/*`, plus baseline security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`) on every route.
- **Vercel auto-deploys on every push to `main`** (production deployment) and generates preview deployments for other branches/PRs. There is no separate manual deploy step — merging to `main` is the deploy trigger.

## Validation: `scripts/check.mjs`

Runs after `npm run build` (not part of the build itself) and walks the whole `dist/` tree. For every indexable page it enforces, among other things:
- Exactly one each of: `lang="en"`, viewport meta, `<main id="main">`, skip link, `<h1>`, `<title>`, canonical link, description meta, JSON-LD `<script>`.
- Title ≤ 65 chars; description 110–165 chars; canonical URL matches the route.
- No duplicate titles or descriptions across pages.
- Every internal `href` resolves to a real route or an existing asset file (broken-link detection).
- Every JSON-LD block parses as valid JSON.
- Every `<img>` has `alt` and explicit `width`/`height`.
- Both desktop and mobile nav include links to `/ai-lab` and `/ventures-eir`.
- No leftover legacy-bundler markup, no job-seeking language (a content-tone guard specific to this site).
- `robots.txt` references the sitemap; `sitemap.xml` includes every route; every `vercel.json` redirect is permanent and points at a real route.
- A few **hardcoded assertions** specific to the AI Lab page and its two project sub-pages (content presence, correct linking) — see note above under "adding a new page."

Exits non-zero with the full list of failures if anything is wrong; prints a one-line summary on success.

## `scripts/capture.mjs` (manual QA tool, not part of the pipeline)

A standalone script for visual/perf QA — connects to a already-running Chrome instance over the DevTools Protocol (default debug port `9222`), navigates to a given URL, and captures a screenshot plus basic viewport/navigation-timing data. Invoked manually (`node scripts/capture.mjs <url> <output.png> [width] [height] [port]`); not run by `build` or `check`.

## Ongoing priorities

1. **Adding new pages** — follow the page-object shape / `projectPage()` / `marketPage()` helpers in `content.mjs`, then wire up breadcrumbs (and nav, if needed) in `build.mjs`, any legacy redirect in `vercel.json`, and extend `check.mjs`'s content assertions if the new page deserves the same protection the AI Lab pages get. Always finish with `npm run build && npm run check`.

2. **SEO / AEO / GEO optimization** — this is a live, ongoing focus area:
   - **Meta tags** — `render()` in `build.mjs` generates title/description/robots/canonical/OG/Twitter tags per page from `content.mjs` fields; respect the length bounds `check.mjs` enforces (title ≤65, description 110–165).
   - **Structured data (JSON-LD)** — lives entirely in `schemaGraph()` in `build.mjs` (not `content.mjs`). Currently emits `Person`, `WebSite`, the page's own schema.org type, `BreadcrumbList`, and `SoftwareApplication` for project pages. Extending or adding new structured-data types (e.g. `Article`, `FAQPage`, `Organization`) means editing this function.
   - **`sitemap.xml`** — auto-generated from the `pages` array; adding a page automatically adds it to the sitemap, no manual step required.
   - **`robots.txt`** — currently a static two-line template written inline in `build.mjs` (`Allow: /` + sitemap pointer); any change to crawl directives means editing that write in `build.mjs`.
   - **`llms.txt`** — **does not exist yet** in this repo. Adding it is outstanding work: it would need a new write step in `build.mjs` (writing to `dist/llms.txt`, alongside the existing `robots.txt`/`sitemap.xml` writes) or a static file placed in `public/` to be copied through, plus likely a presence/content check added to `check.mjs` once it exists.
