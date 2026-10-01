const SOURCES = [
  { name: "Wamda", domain: "wamda.com", market: "MENA", feeds: ["https://www.wamda.com/feed/all", "https://www.wamda.com/feed", "https://www.wamda.com/en/feed/all"] },
  { name: "The National", domain: "thenationalnews.com", market: "UAE / GCC", feeds: ["https://www.thenationalnews.com/rss", "https://www.thenationalnews.com/rss/"] },
  { name: "Arabian Business", domain: "arabianbusiness.com", market: "GCC", feeds: ["https://www.arabianbusiness.com/feed", "https://www.arabianbusiness.com/feed/"] },
  { name: "Gulf Business", domain: "gulfbusiness.com", market: "GCC", feeds: ["https://gulfbusiness.com/feed/", "https://gulfbusiness.com/feed"] },
  { name: "ZAWYA", domain: "zawya.com", market: "MENA / GCC", feeds: ["https://www.zawya.com/sitemaps/en/rss"] },
  { name: "Arab News", domain: "arabnews.com", market: "Saudi Arabia / GCC", feeds: ["https://www.arabnews.com/rss.xml", "https://www.arabnews.com/rss", "https://www.arabnews.com/economy?service=rss"] },
  { name: "Economy Middle East", domain: "economymiddleeast.com", market: "GCC", feeds: ["https://economymiddleeast.com/feed/", "https://economymiddleeast.com/feed"] },
  { name: "PR Newswire", domain: "prnewswire.com", market: "Global / GCC relevance", feeds: ["https://www.prnewswire.com/rss/news-releases-list.rss"] },
  { name: "TechCrunch", domain: "techcrunch.com", market: "Global technology", feeds: ["https://techcrunch.com/feed/"] },
  { name: "PYMNTS", domain: "pymnts.com", market: "Payments / commerce", feeds: ["https://www.pymnts.com/feed/", "https://www.pymnts.com/feed/rss/"] }
];

const KEYWORDS = [
  "commerce","ecommerce","e-commerce","marketplace","retail","fintech","payment","payments",
  "artificial intelligence","agentic"," ai ","logistics","working capital","digital economy",
  "digital transformation","enterprise technology","market entry","startup","funding","banking"
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
  const match = xml.match(new RegExp("<" + tag.replace(":", "\\:") + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag.replace(":", "\\:") + ">", "i"));
  return match ? decode(match[1]) : "";
};

const attr = (xml, tag, name) => {
  const match = xml.match(new RegExp("<" + tag.replace(":", "\\:") + "\\b[^>]*\\s" + name + "=[\"']([^\"']+)[\"'][^>]*>", "i"));
  return match ? decode(match[1]) : "";
};

const imageFromBlock = block => {
  const media = attr(block, "media:content", "url") || attr(block, "media:thumbnail", "url");
  if (media) return media;
  const enclosure = block.match(/<enclosure\b[^>]*url=["']([^"']+)["'][^>]*type=["']image\//i);
  if (enclosure) return decode(enclosure[1]);
  const html = field(block, "content:encoded") || field(block, "description") || field(block, "content") || field(block, "summary");
  const img = html.match(/<img\b[^>]*src=["']([^"']+)["']/i);
  return img ? decode(img[1]) : "";
};

const sourceUrlFromBlock = block => attr(block, "source", "url");

const itemFromBlock = block => {
  let link = field(block, "link");
  if (!link) link = attr(block, "link", "href");
  const title = stripHtml(field(block, "title"));
  const description = field(block, "description") || field(block, "summary") || field(block, "content:encoded") || field(block, "content");
  const publishedAt = stripHtml(field(block, "pubDate") || field(block, "published") || field(block, "updated") || field(block, "dc:date"));
  return {
    title,
    link: stripHtml(link),
    description: stripHtml(description),
    image: imageFromBlock(block),
    publishedAt,
    sourceUrl: sourceUrlFromBlock(block)
  };
};

const itemsFromFeed = xml => {
  const source = String(xml || "");
  const rss = [...source.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(match => itemFromBlock(match[0]));
  if (rss.length) return rss.filter(item => item.title && item.link);
  return [...source.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(match => itemFromBlock(match[0])).filter(item => item.title && item.link);
};

const timeoutSignal = ms => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
};

async function fetchText(url, ms = 4500) {
  const t = timeoutSignal(ms);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: t.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; HarisAslamNews/1.0; +https://www.mharisaslam.com/)" }
    });
    return { ok: response.ok, url: response.url, contentType: response.headers.get("content-type") || "", text: await response.text() };
  } catch {
    return { ok: false, url, contentType: "", text: "" };
  } finally {
    t.clear();
  }
}

const score = item => {
  const haystack = (" " + item.title + " " + item.description + " ").toLowerCase();
  return KEYWORDS.reduce((total, keyword) => total + (haystack.includes(keyword) ? 1 : 0), 0);
};

const pickRelevant = items => [...items]
  .map(item => ({ ...item, relevance: score(item) }))
  .sort((a, b) => (b.relevance - a.relevance) || (Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0)))[0] || null;

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

async function directFeedItem(source) {
  if (!source.feeds?.length) return null;
  const attempts = await Promise.all(source.feeds.map(url => fetchText(url)));
  for (const attempt of attempts) {
    if (!attempt.ok) continue;
    const items = itemsFromFeed(attempt.text);
    if (!items.length) continue;
    const item = pickRelevant(items.slice(0, 20));
    if (item) return { ...item, source: source.name, domain: source.domain, market: source.market, via: "publisher" };
  }
  return null;
}

async function googleFallback(source) {
  const topic = '(commerce OR ecommerce OR marketplace OR retail OR fintech OR payments OR "artificial intelligence" OR agentic OR logistics OR banking OR startup)';
  const url = "https://news.google.com/rss/search?q=" + encodeURIComponent(topic + " site:" + source.domain) + "&hl=en&gl=AE&ceid=AE:en";
  const feed = await fetchText(url);
  if (!feed.ok) return null;
  const items = itemsFromFeed(feed.text).filter(item => !item.sourceUrl || item.sourceUrl.includes(source.domain));
  const item = pickRelevant(items.slice(0, 20));
  return item ? { ...item, source: source.name, domain: source.domain, market: source.market, via: "google" } : null;
}

async function enrich(item) {
  if (!item) return null;
  let image = item.image || "";
  let summary = item.description || "";
  let url = item.link;

  if (item.via === "publisher" && url && !image) {
    const article = await fetchText(url, 4000);
    if (article.ok) {
      image = ogValue(article.text, "og:image") || ogValue(article.text, "twitter:image");
      summary = ogValue(article.text, "og:description") || ogValue(article.text, "description") || summary;
    }
  }

  return {
    source: item.source,
    market: item.market,
    domain: item.domain,
    title: item.title,
    url,
    image,
    summary: stripHtml(summary).slice(0, 220),
    publishedAt: item.publishedAt,
    via: item.via
  };
}

async function latestForSource(source) {
  const direct = await directFeedItem(source);
  return enrich(direct || await googleFallback(source));
}

export async function GET() {
  const results = (await Promise.all(SOURCES.map(latestForSource))).filter(Boolean);
  const news = results.sort((a, b) => Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0));

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
