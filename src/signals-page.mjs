export const gccSignals = [
  {
    date: "30 Sep 2026",
    market: "Qatar",
    topic: "Agentic AI",
    source: "Wamda",
    title: "Qatar agentic-AI startup Aligator raises seed capital",
    summary: "Aligator raised a $1.2 million seed round led by Qatar Development Bank and Next Ventures to develop autonomous AI agents for public-relations workflows and expand across the GCC.",
    lens: "The useful signal is not the funding round itself. It is that agentic AI is moving into narrow, accountable workflows with a defined user, task and operating outcome - the same pattern enterprises should follow before granting agents broader authority.",
    url: "https://www.wamda.com/en/2026/09/qatar-aligator-raises-1-2-million-seed-round"
  },
  {
    date: "29 Sep 2026",
    market: "Global / GCC relevance",
    topic: "Agentic commerce",
    source: "PR Newswire",
    title: "Payment infrastructure vendors prepare for AI-agent checkout",
    summary: "IDEMIA Secure Transactions introduced an agentic-commerce solution aimed at helping payment schemes authenticate and tokenize transactions initiated by AI agents.",
    lens: "Agentic commerce will not be won by the shopping interface alone. Identity, delegated authority, payment choice, authentication and auditability are becoming part of the commerce operating stack.",
    url: "https://www.prnewswire.com/news-releases/idemia-secure-transactions-opens-agentic-commerce-to-all-payment-schemes-302892772.html"
  },
  {
    date: "28 Sep 2026",
    market: "MENA",
    topic: "Open finance + AI",
    source: "Wamda",
    title: "Open finance is becoming the action layer for financial agents",
    summary: "A regional perspective from Ziina argues that connected financial infrastructure can allow AI systems to move beyond explaining financial information toward permitted actions across payments, balances and cash-flow decisions.",
    lens: "For financial agents, reasoning is only half the architecture. The harder layer is reliable account data, permissions, transaction APIs, policy and human control. That is where financial infrastructure becomes an operating model rather than an AI feature.",
    url: "https://www.wamda.com/2026/09/mena-open-finance-opportunity-age-ai"
  },
  {
    date: "28 Sep 2026",
    market: "Saudi Arabia / GCC",
    topic: "Working capital",
    source: "Wamda",
    title: "Saudi fintech erad raises $22 million to scale working-capital finance",
    summary: "erad raised a $22 million Series A to expand Shariah-compliant SME working-capital products, using data and AI to support underwriting and faster approvals.",
    lens: "This is a useful example of AI tied to a hard commercial constraint: access to working capital. The value case is clearer when technology changes approval speed, risk selection, service cost and the capital available to productive businesses.",
    url: "https://www.wamda.com/en/2026/09/saudi-fintech-erad-raises-22-million-series-led-mevp"
  },
  {
    date: "15 Sep 2026",
    market: "UAE / Saudi Arabia",
    topic: "Fintech investment",
    source: "The National",
    title: "UAE and Saudi Arabia dominate regional fintech funding",
    summary: "The National reported that UAE and Saudi companies captured most MENA fintech funding in the first half of 2026, while payments remained the leading fintech sub-sector by deal count.",
    lens: "The commercial implication is concentration. Payments, financial infrastructure and AI-native financial products are attracting capital where regulation, enterprise demand and digital transaction growth already support scale.",
    url: "https://www.thenationalnews.com/business/2026/09/15/ai-start-up-mal-carries-middle-east-fintech-in-h1-with-mega-funding-round/"
  },
  {
    date: "10 Sep 2026",
    market: "Saudi Arabia",
    topic: "Social commerce",
    source: "Arab News",
    title: "Saudi live-shopping model combines discovery, escrow and logistics",
    summary: "Saudi platform Rwaj is building a live-shopping and auction marketplace around verified sellers, escrow payments and fulfilment controls.",
    lens: "Live commerce is not only a content format. The operating model has to solve trust, seller verification, attribution, payment protection and fulfilment. Without those controls, entertainment does not become durable commerce.",
    url: "https://www.arabnews.com/saudi-arabia/saudi-entrepreneur-brings-live-shopping-auctions-to-saudi-arabia-3000773"
  }
];

const esc = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const signalRows = items => items.map((item, index) => `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(item.title)}</strong><small>${esc(item.market)} · ${esc(item.topic)} · ${esc(item.source)} · ${esc(item.date)}<br><br>${esc(item.summary)}<br><br><b>Why it matters:</b> ${esc(item.lens)}</small><i aria-hidden="true">↗</i></a>`).join("");

export const signalsPage = {
  path: "/signals",
  type: "CollectionPage",
  kind: "signals",
  title: "GCC Commerce, AI & Fintech Signals | Haris Aslam",
  description: "A curated GCC signal feed on digital commerce, agentic AI, fintech, payments, retail, logistics and business building, with an operator perspective.",
  eyebrow: "GCC Commerce & AI Signals",
  h1: "The developments worth paying attention to.",
  intro: "A small, curated feed of external developments connected to the operating questions explored across this site.",
  v3: true,
  v3Body: `<section class="v3-library-hero"><div class="v3-shell"><div><span class="v3-label">GCC Commerce & AI Signals</span><h1>The developments worth paying attention to.</h1><p>Selected news and market developments across commerce, fintech, payments, AI, logistics and GCC growth. Each item links to the original source and adds a short operator lens rather than republishing the article.</p></div><aside><strong>${gccSignals.length}</strong><span>current signals</span><p>Curated, not exhaustive. Source facts remain with the original publishers.</p></aside></div></section>
  <section class="v3-insight-ledger"><div class="v3-shell"><header class="v3-section-intro split"><span class="v3-label">Current signals</span><h2>What changed, and why it matters operationally.</h2><p>Updated selectively when there is a meaningful development - not to manufacture daily content volume.</p></header><div>${signalRows(gccSignals)}</div></div></section>`
};

export function homeSignals(limit = 3) {
  return `<section class="v3-insight-ledger"><div class="v3-shell"><header class="v3-section-intro split"><span class="v3-label">GCC Commerce & AI Signals</span><h2>What is changing now.</h2><a class="v3-link" href="/signals">View all signals<span aria-hidden="true">↗</span></a></header><div>${signalRows(gccSignals.slice(0, limit))}</div></div></section>`;
}
