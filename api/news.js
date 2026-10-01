const SOURCES = [
  { name: "Wamda", domain: "wamda.com", market: "MENA", feeds: ["https://www.wamda.com/feed/all", "https://www.wamda.com/feed", "https://www.wamda.com/en/feed/all"] },
  { name: "The National", domain: "thenationalnews.com", market: "UAE / GCC", feeds: ["https://www.thenationalnews.com/rss", "https://www.thenationalnews.com/rss/"] },
  { name: "Arabian Business", domain: "arabianbusiness.com", market: "GCC", feeds: ["https://www.arabianbusiness.com/feed", "https://www.arabianbusiness.com/feed/"] },
  { name: "Gulf Business", domain: "gulfbusiness.com", market: "GCC", feeds: ["https://gulfbusiness.com/feed/", "https://gulfbusiness.com/feed"] },
  { name: "ZAWYA", domain: "zawya.com", market: "MENA / GCC", feeds: ["https://www.zawya.com/sitemaps/en/rss"] },
  { name: "Arab News", domain: "arabnews.com", market: "Saudi Arabia / GCC", feeds: ["https://www.arabnews.com/economy?service=rss", "https://www.arabnews.com/rss.xml", "https://www.arabnews.com/rss"] },
  { name: "Economy Middle East", domain: "economymiddleeast.com", market: "GCC", feeds: ["https://economymiddleeast.com/feed/", "https://economymiddleeast.com/feed"] },
  { name: "PR Newswire", domain: "prnewswire.com", market: "Global / GCC relevance", feeds: ["https://www.prnewswire.com/rss/news-releases-list.rss"] },
  { name: "TechCrunch", domain: "techcrunch.com", market: "Global technology", feeds: ["https://techcrunch.com/feed/"] },
  { name: "PYMNTS", domain: "pymnts.com", market: "Payments / commerce", feeds: ["https://www.pymnts.com/feed/", "https://www.pymnts.com/feed/rss/"] }
];

const TOPIC_GROUPS = {
  commerce: ["commerce","ecommerce","e-commerce","marketplace","retail","shopping","merchant","seller","checkout"],
  fintech: ["fintech","payment","payments","banking","bank","wallet","open finance","embedded finance","lending","credit","working capital"],
  ai: ["agentic","artificial intelligence"," ai ","ai agent","ai agents","automation","machine learning"],
  operations: ["logistics","warehouse","supply chain","delivery","last-mile","fulfilment","fulfillment","inventory"],
  enterprise: ["enterprise software","enterprise technology","cloud","saas","api","digital transformation","digital economy"]
};

const BUSINESS_CONTEXT = [
  "business","company","companies","startup","start-up","enterprise","platform","software","technology",
  "merchant","retail","bank","fintech","payment","commerce","logistics","funding","raises","round","investment",
  "partnership","launch","revenue","market","infrastructure","api","data","capital","customer","customers"
];

const EXCLUDE_TERMS = [
  "football","soccer","cricket","sport","sports","celebrity","movie","music","hijab","religion",
  "election","war","military","crime","court","weather","tourism","travel guide","united nations","guterres",
  "residences","residence","properties","real estate","villa","apartment","hearing glasses","smart glasses",
  "names to lead","appointed to lead","appoints","liquidated funds","interim payments"
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

const countHits = (text, terms) => terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);

const relevance = item => {
  const title = (" " + item.title + " ").toLowerCase();
  const body = (" " + item.title + " " + item.description + " ").toLowerCase();

  if (EXCLUDE_TERMS.some(term => body.includes(term))) return { score: 0, categoryHits: 0, businessHits: 0 };

  const titleGroups = Object.values(TOPIC_GROUPS).filter(terms => terms.some(term => title.includes(term))).length;
  const bodyGroups = Object.values(TOPIC_GROUPS).filter(terms => terms.some(term => body.includes(term))).length;
  const businessHits = countHits(body, BUSINESS_CONTEXT);

  // A story must be about one of Haris's expertise themes and have a real business / operating context.
  if (bodyGroups === 0 || businessHits === 0) return { score: 0, categoryHits: bodyGroups, businessHits };
  if (titleGroups === 0 && bodyGroups < 2) return { score: 0, categoryHits: bodyGroups, businessHits };

  return {
    score: (titleGroups * 5) + (bodyGroups * 3) + Math.min(businessHits, 5),
    categoryHits: bodyGroups,
    businessHits
  };
};

const rankedRelevant = items => [...items]
  .map(item => {
    const r = relevance(item);
    return { ...item, relevance: r.score };
  })
  .filter(item => item.relevance > 0)
  .sort((a, b) => (b.relevance - a.relevance) || (Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0)));

const classifyTopic = item => {
  const text = (" " + item.title + " " + item.summary + " ").toLowerCase();

  if (text.includes("agentic") || text.includes("ai agent") || text.includes("ai agents")) return "AI & Agentic";

  if (text.includes("artificial intelligence") || text.includes(" ai ")) {
    const aiContext = [
      "commerce","ecommerce","e-commerce","retail","merchant","payment","fintech","banking",
      "enterprise","software","platform","marketplace","cloud","data centre","data center","workflow",
      "operations","productivity","customer","logistics","supply chain","founder","funding"
    ];
    if (aiContext.some(term => text.includes(term))) return "AI & Agentic";
  }

  const financialTech = [
    "fintech","digital payment","digital payments","e-payments","payment platform","payments platform",
    "payment infrastructure","payments infrastructure","payment method","payment methods","merchant payment",
    "merchant payments","wallet","open finance","embedded finance","working capital","paymob","binance pay"
  ];
  if (financialTech.some(term => text.includes(term))) return "Payments & Fintech";

  if (text.includes("ecommerce") || text.includes("e-commerce") || text.includes("commerce") || text.includes("marketplace") || text.includes("retail")) return "Commerce & Retail";
  if (text.includes("logistics") || text.includes("warehouse") || text.includes("working capital") || text.includes("supply chain") || text.includes("fulfilment") || text.includes("fulfillment")) return "Logistics & Operations";
  if (text.includes("enterprise software") || text.includes("enterprise technology") || text.includes("digital transformation") || text.includes("saas") || text.includes("cloud platform")) return "Enterprise Technology";

  return null;
};

const isGccItem = item => {
  const text = (" " + item.title + " " + item.summary + " " + item.market + " ").toLowerCase();
  return ["gcc","mena","saudi","qatar","uae","emirates","oman","bahrain","kuwait","riyadh","dubai","doha","muscat"].some(term => text.includes(term));
};

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

async function directFeedItems(source) {
  if (!source.feeds?.length) return [];
  const attempts = await Promise.all(source.feeds.map(url => fetchText(url)));
  const pool = [];
  for (const attempt of attempts) {
    if (!attempt.ok) continue;
    const items = itemsFromFeed(attempt.text);
    if (items.length) pool.push(...items.slice(0, 30));
  }
  if (!pool.length) return [];
  return rankedRelevant(pool)
    .slice(0, 3)
    .map(item => ({ ...item, source: source.name, domain: source.domain, market: source.market, via: "publisher" }));
}

async function googleFallbackItems(source) {
  const topic = '(commerce OR ecommerce OR marketplace OR retail OR fintech OR payments OR "artificial intelligence" OR agentic OR logistics OR banking OR startup)';
  const url = "https://news.google.com/rss/search?q=" + encodeURIComponent(topic + " site:" + source.domain) + "&hl=en&gl=AE&ceid=AE:en";
  const feed = await fetchText(url);
  if (!feed.ok) return [];
  const items = itemsFromFeed(feed.text).filter(item => !item.sourceUrl || item.sourceUrl.includes(source.domain));
  return rankedRelevant(items.slice(0, 30)).slice(0, 3).map(item => ({ ...item, source: source.name, domain: source.domain, market: source.market, via: "google" }));
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
  const direct = await directFeedItems(source);
  const candidates = direct.length ? direct : await googleFallbackItems(source);
  return (await Promise.all(candidates.map(enrich))).filter(Boolean);
}

export async function GET() {
  const nested = await Promise.all(SOURCES.map(latestForSource));
  const seen = new Set();
  const news = nested.flat()
    .map(item => ({
      ...item,
      topic: classifyTopic(item),
      isGcc: isGccItem(item)
    }))
    .filter(item => item.topic)
    .filter(item => {
      const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0))
    .slice(0, 24);

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
