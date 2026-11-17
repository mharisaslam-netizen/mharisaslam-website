// Reviewed editorial titles and reader paths. No search-performance data belongs here.
export const editorialTitles = {
  "/contact": "Contact Haris Aslam | GCC Commerce & Retail",
  "/insights": "GCC Commerce, Growth & Transformation Insights | Haris Aslam",
  "/insights/etisalat-eand-strategy-reset-2026": "Etisalat e& Strategy Reset 2026 | Haris Aslam",
  "/track-record/salman-miraq": "Salman & Miraq: Retail Operating Experience | Haris Aslam",
  "/use-cases/retail-clearance-stock-profitability": "Retail Clearance, Stock & Profitability | Haris Aslam",
  "/use-cases/leading-saudi-bank-commerce-ecosystem": "Saudi Bank Commerce Ecosystem | Haris Aslam",
  "/use-cases/enterprise-ai-transformation-practice": "Enterprise AI Transformation Practice | Haris Aslam",
  "/insights/payments-financial-infrastructure-gcc-localization": "GCC Payments & Financial Infrastructure | Haris Aslam",
  "/insights/openai-agents-api-ecommerce-pilot": "OpenAI Agents API: Ecommerce Pilot | Haris Aslam",
  "/use-cases/payments-embedded-finance-growth": "Payments & Embedded Finance Growth | Haris Aslam",
  "/insights/warehouse-capacity-as-a-3pl-business": "Warehouse Capacity & 3PL Economics | Haris Aslam"
};

export const operatingTopics = [
  {
    id: "marketplace-commerce",
    heading: "Marketplace and telco commerce",
    intro: "Start with the launch model, test completed-order economics, then review seller readiness and operating experience.",
    links: [
      ["/use-cases/telco-led-national-marketplace", "Telco marketplace launch playbook"],
      ["/insights/marketplace-economics-gmv-revenue-contribution-gcc", "Marketplace economics and contribution calculator"],
      ["/track-record/roumaan", "Roumaan founder and operating record"],
      ["/insights/seller-onboarding-economics", "Seller onboarding economics"],
      ["/use-cases/ai-marketplace-trust-quality-layer", "Seller trust and quality controls"]
    ]
  },
  {
    id: "retail-working-capital",
    heading: "Retail turnaround and working capital",
    intro: "Connect store and category performance to inventory decisions, supplier commitments and realized cash.",
    links: [
      ["/business-performance", "Retail performance and working capital"],
      ["/use-cases/retail-group-transformation", "Retail recovery operating framework"],
      ["/insights/margin-to-cash-retail-turnaround", "The margin-to-cash bridge"],
      ["/use-cases/ai-working-capital-inventory-agent", "AI inventory and working-capital workflow"],
      ["/use-cases/warehouse-working-capital-3pl", "Warehouse and 3PL operating choices"]
    ]
  },
  {
    id: "gcc-growth-entry",
    heading: "GCC growth and market entry",
    intro: "Assess the market, route to customer, landed economics and operating capacity before committing to expansion.",
    links: [
      ["/gcc-growth-transformation", "GCC growth and transformation perspective"],
      ["/markets/saudi-arabia", "Saudi Arabia market-entry perspective"],
      ["/markets/uae", "UAE growth and operating models"],
      ["/use-cases/saudi-market-entry-distribution", "Saudi distribution and ecommerce entry"],
      ["/use-cases/ai-market-entry-intelligence-engine", "Market-entry intelligence workflow"]
    ]
  }
];

const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
export const topicCollectionsHtml = () => `<section class="section operating-topics" aria-labelledby="operating-topics-heading"><div class="v3-shell"><div class="section-heading"><h2 id="operating-topics-heading">Explore by business problem</h2></div><div class="operating-topic-grid">${operatingTopics.map(topic => `<article><h3>${escape(topic.heading)}</h3><p>${escape(topic.intro)}</p><ul>${topic.links.map(([href, label]) => `<li><a href="${href}">${escape(label)}</a></li>`).join("")}</ul></article>`).join("")}</div></div></section>`;

export function applySearchPublishing(page) {
  let updated = editorialTitles[page.path] ? { ...page, title: editorialTitles[page.path], dateModified: "2026-11-17" } : page;
  if (["/use-cases", "/insights"].includes(page.path)) {
    const end = page.v3Body.indexOf("</section>");
    if (end < 0 || !page.v3Body.slice(0, end).includes("<h1")) throw new Error(`Collection hero missing: ${page.path}`);
    updated = { ...updated, dateModified: "2026-11-17", v3Body: page.v3Body.slice(0, end + 10) + topicCollectionsHtml() + page.v3Body.slice(end + 10) };
  }
  return updated;
}
