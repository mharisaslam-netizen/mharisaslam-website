export const site = {
  name: "Muhammad Haris Aslam",
  shortName: "Haris Aslam",
  origin: "https://www.mharisaslam.com",
  email: "haris@mharisaslam.com",
  linkedin: "https://www.linkedin.com/in/harisaslam/"
};

export const navigation = [
  ["Home", "/"], ["Track Record", "/track-record"], ["Use Cases", "/use-cases"],
  ["AI & Transformation", "/ai-transformation"], ["Insights", "/insights"],
  ["About", "/about"], ["Contact", "/contact"]
];

const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const link = (href, label, className = "text-link") => `<a class="${className}" href="${href}">${esc(label)} <span aria-hidden="true">→</span></a>`;
const section = (title, content, className = "") => `<section class="section ${className}"><div class="section-heading"><h2>${esc(title)}</h2></div>${content}</section>`;
const grid = items => `<div class="card-grid">${items.join("")}</div>`;
const card = (href, label, title, text, meta = "") => `<a class="work-card" href="${href}"><span class="card-label">${esc(label)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p>${meta ? `<span class="card-meta">${esc(meta)}</span>` : ""}<span class="card-link">View details <span aria-hidden="true">→</span></span></a>`;
const tagRow = items => `<div class="tag-row">${items.map(item => `<span>${esc(item)}</span>`).join("")}</div>`;
const field = (label, text) => `<section class="case-field"><h2>${esc(label)}</h2><p>${esc(text)}</p></section>`;
const diagram = (title, items, note = "") => `<figure class="concept-visual"><figcaption>${esc(title)}</figcaption><div class="visual-flow">${items.map((item, index) => `<div class="visual-node"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(item)}</strong></div>`).join("")}</div>${note ? `<p>${esc(note)}</p>` : ""}</figure>`;

const trackRecords = [
  {
    slug: "roumaan", name: "Roumaan", role: "Founder and operator", geography: "Oman", period: "2014 to 2018",
    summary: "Built and operated a multi-category online commerce business in Oman.",
    mandate: "Create a credible online retail proposition in a market where assortment, stock accuracy and fulfilment still had to be built together.",
    built: "The work covered the customer proposition, catalogue, trading, order operations and fulfilment. Later seller-marketplace planning remained separate from the proven first-party operation.",
    commercial: "The operating focus was completed-order contribution after product cost, delivery, payment, returns and acquisition cost.",
    technology: "Commerce CMS, product catalogue, customer and order reporting, with centrally managed merchandising and fulfilment.",
    relevance: "Roumaan established Haris's operating base in digital commerce: build the proposition, own the daily decisions and keep growth connected to order economics.",
    visual: ["Customer demand", "Curated catalogue", "Order operations", "Fulfilment"]
  },
  {
    slug: "salman-miraq-ksm", name: "Salman Corporation, Miraq and KSM", role: "Operating and investment leadership", geography: "Oman and GCC", period: "2023 to 2025",
    summary: "Worked across retail performance, working capital, portfolio choices and new venture direction.",
    mandate: "Bring commercial and operating discipline to a family-owned retail setting while evaluating where new growth could be funded responsibly.",
    built: "The work connected store and category economics with stock, procurement, cash and governance. It also shaped distribution and venture options around clear investment gates.",
    commercial: "The central test was whether margin improvement released cash and whether a new venture could earn its fixed cost without hiding weakness in the core business.",
    technology: "Management reporting, retail P&L analysis, inventory data, e-commerce and ERP assessment, supported by a regular operating review.",
    relevance: "This work combined turnaround thinking with family-business governance and investment discipline. No group-wide financial uplift is claimed.",
    visual: ["Margin", "Stock", "Cash", "Investment gates"]
  },
  {
    slug: "floward-oman", name: "Floward Oman", role: "Country launch and operating leadership", geography: "Oman", period: "Public role experience",
    summary: "Built the local commercial and fulfilment setup for a digital gifting operation in Oman.",
    mandate: "Turn a regional digital proposition into a locally relevant business with dependable assortment, service and fulfilment.",
    built: "The operating work brought together local trading, category choices, campaigns, supplier coordination and delivery execution.",
    commercial: "Order volume had to translate into contribution after product margin, cancellations, delivery cost and peak-capacity pressure.",
    technology: "Commerce catalogue, order and fulfilment systems, performance reporting and local operating workflows.",
    relevance: "The experience added country launch, fast-cycle trading and perishable fulfilment to Haris's commerce operating record. No market-share figure is published.",
    visual: ["Local demand", "Assortment", "Fulfilment capacity", "Completed order"]
  },
  {
    slug: "upapp-factory", name: "UpApp Factory", role: "Co-founder and operator", geography: "Oman and regional delivery", period: "2019 to 2021",
    summary: "Built a lean studio model for contracted web and mobile products.",
    mandate: "Deliver custom digital products with a small core team while keeping scope, partner capacity and handover under control.",
    built: "The studio qualified demand, translated requirements into delivery plans, managed testing and completed client handovers.",
    commercial: "Project contribution depended on scope control, delivery hours, partner cost, rework and the support commitment after launch.",
    technology: "Web and mobile development, project planning, requirements, testing and release workflows.",
    relevance: "UpApp Factory gave Haris direct experience of selling, building and handing over enterprise technology. Client performance gains and studio profitability are not published.",
    visual: ["Qualified brief", "Scoped build", "Test and release", "Handover"]
  },
  {
    slug: "vodafone-qatar-marqa", name: "Vodafone Qatar and MARQA", role: "Strategic digital commerce", geography: "Qatar", period: "Current public role context",
    summary: "Strategic digital-commerce work inside a large enterprise environment in Qatar.",
    mandate: "Work at the intersection of customer experience, commercial priorities, platform delivery and operating governance.",
    built: "The public record covers role context and enterprise perspective. Detailed roadmaps, internal programmes and operating data remain confidential.",
    commercial: "The business lens remains consistent: customer activity must connect to attributable revenue, service cost and accountable ownership.",
    technology: "Enterprise commerce, customer and operating platforms, described only at a public-safe level.",
    relevance: "The role adds large-enterprise scale and governance to an operating record built across ventures, retail and digital commerce.",
    visual: ["Customer", "Commerce platform", "Enterprise controls", "Accountable outcome"]
  }
];

const useCases = [
  {
    slug: "leading-saudi-bank-commerce-ecosystem", title: "Leading Saudi bank commerce ecosystem", sector: "Banking and commerce", geography: "Saudi Arabia", type: "Strategy blueprint",
    summary: "A card-led commerce model designed to influence customer choice before checkout.",
    overview: "An anonymized strategy case for connecting card value, merchant offers and purchase intent without turning a bank into a retailer.",
    problem: "The bank enters the journey at payment, after the customer has already selected a product, merchant and card.",
    solution: "A consented intent layer would rank eligible card value and merchant offers, then hand the customer to the merchant. The bank retains financial decision rights and the merchant remains responsible for retail service.",
    technology: "Bank app APIs, card and loyalty rails, merchant offer feeds, consent records and transaction attribution. AI can rank eligible value, but risk teams control card, finance and campaign rules.",
    commercial: "Value comes from incremental card spend and merchant-funded demand. Rewards, acquisition, platform and service cost must be deducted before calling the model profitable.",
    operating: "A bank product owner, risk and compliance teams govern eligibility. Merchant partners own price, checkout, delivery and returns.",
    impact: "The model would be tested with a small anchor-merchant cohort and control groups. No bank implementation or revenue result is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Purchase intent", "Eligible card value", "Merchant handoff", "Attributed spend"]
  },
  {
    slug: "oman-bank-value-wallet", title: "Oman bank value wallet", sector: "Banking, rewards and commerce", geography: "Oman", type: "Strategy blueprint",
    summary: "A portfolio-first model linking cards, rewards and instalments to shopping intent.",
    overview: "An anonymized commerce and rewards case that uses products the bank already has before adding a new loyalty currency or retail layer.",
    problem: "Cards, rewards and instalment products can be useful individually but disconnected when a customer is deciding what to buy.",
    solution: "A value wallet would show eligible card and reward options before merchant checkout. It would explain the value and preserve the merchant's role in the transaction.",
    technology: "Mobile banking, card, rewards and instalment APIs, an offer engine and event attribution. AI can classify intent and explain eligible choices under bank-approved rules.",
    commercial: "The test is recaptured wallet share and repeat card usage, net of benefits funding, merchant support and platform cost.",
    operating: "The bank governs customer consent, eligibility and financial recommendations. Merchants retain product, price and service responsibility.",
    impact: "The concept would compare card usage and offer conversion with matched customer cohorts. No implementation or customer-value result is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Customer intent", "Cards and rewards", "Best eligible value", "Merchant checkout"]
  },
  {
    slug: "partner-retail-gifting-network", title: "Partner-retail gifting network", sector: "Gifting and retail partnerships", geography: "GCC", type: "Strategy blueprint",
    summary: "A low-integration model for adding flowers, presentation and delivery to a retail purchase.",
    overview: "An anonymized expansion model for a regional gifting platform, designed around separate transactions and one controlled custody chain.",
    problem: "Customers often buy the main gift in a store, then arrange flowers, packaging and delivery through separate journeys.",
    solution: "A store code opens a gift-building flow. The purchased item enters a sealed custody process, moves to a gifting hub for assembly and reaches the recipient in one delivery.",
    technology: "QR or deep-link entry, mobile checkout, custody scans, order orchestration and route batching. AI can recommend gift combinations and pickup routes, while staff control custody and quality.",
    commercial: "The retailer keeps its sale. The gifting platform earns service and add-on contribution after partner share, pickup, packaging, delivery and customer-care cost.",
    operating: "Store teams accept the sealed item. The platform manages collection, assembly, quality and delivery without requiring deep POS integration for the first pilot.",
    impact: "A limited door-level pilot would test attachment rate, custody loss, service cost and contribution. No partner rollout or revenue is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Retail purchase", "Gift add-ons", "Custody and assembly", "One delivery"]
  },
  {
    slug: "multi-category-digital-commerce", title: "Multi-category digital commerce", sector: "Digital retail", geography: "Oman", type: "Operating case",
    summary: "A broad-category online retailer built around catalogue, order and fulfilment discipline.",
    overview: "An operating case from Haris's own venture record. The proven business was first-party online retail; later seller expansion remained a plan.",
    problem: "Customers faced fragmented online assortment and uncertain fulfilment. The business needed a dependable catalogue and clear stock availability.",
    solution: "The operation brought several retail categories into one proposition with central merchandising and order handling. A current setup would add catalogue-quality automation and demand signals without presenting a planned seller model as a historical result.",
    technology: "Commerce CMS, product catalogue and order reporting. A modern stack would connect stock, price, orders and care through APIs, with AI suggestions checked against source data.",
    commercial: "First-party order contribution equals selling margin after delivery, payment, returns and acquisition. A seller model needs separate take-rate and service economics.",
    operating: "Category, inventory, fulfilment and care owners make the commercial decisions. Automation surfaces exceptions and improves catalogue work.",
    impact: "The retailer traded online with recorded orders and customer registrations. No third-party marketplace result or unpublished revenue figure is presented.", impactLabel: "Business Impact",
    visual: ["Demand", "Catalogue", "Order", "Fulfilment"]
  },
  {
    slug: "agent-led-social-commerce", title: "Agent-led social commerce", sector: "Marketplace", geography: "Oman", type: "Operating case",
    summary: "A live merchant-and-agent platform designed around attributable sales and transparent payouts.",
    overview: "An operating marketplace case with live applications, onboarding, campaigns and an operational handover.",
    problem: "Small merchants needed digital distribution. Independent sales agents needed reliable offers, attribution and commissions.",
    solution: "Merchant and agent apps supported onboarding, catalogue sharing and campaigns. A current model would add assisted catalogue preparation and matching while keeping attribution visible.",
    technology: "Mobile apps, CMS and funnel reporting, extended today with verified identity, event attribution, order APIs and a payout ledger.",
    commercial: "Order contribution must cover platform service, agent commission, payment, disputes and fulfilment. Downloads and registrations are not substitutes for completed trade.",
    operating: "Platform operators govern merchant admission, commissions, disputes and payouts. AI can flag anomalies and prepare content, but it does not move money.",
    impact: "Merchant and agent applications went live and reached an operational handover. No unreconciled transaction, profit or expansion figure is published.", impactLabel: "Business Impact",
    visual: ["Merchant", "Agent", "Buyer order", "Settlement"]
  },
  {
    slug: "retail-group-transformation", title: "Retail group transformation", sector: "Family retail", geography: "Oman", type: "Operating case",
    summary: "A management reset connecting store economics, stock, procurement and cash.",
    overview: "An anonymized operating case from a family-owned retail group. It covers management and transformation work, not a claimed group-wide turnaround result.",
    problem: "Ageing stock, cost pressure and overlapping channels weakened cash conversion and made expansion difficult to evaluate.",
    solution: "Store, category and channel decisions were brought back to margin and cash. A current control layer would combine POS, inventory and finance feeds, then flag stock and performance exceptions for review.",
    technology: "Management reporting, P&L and inventory analysis, e-commerce and ERP assessment. A modern system would add a contribution data mart and supervised exception workflow.",
    commercial: "Sales matter only when gross profit covers occupancy, labour, markdown, returns and working capital. New ventures need separate investment gates.",
    operating: "Finance, category, procurement and store owners share one weekly view of margin, stock and cash. People retain price, supplier and capital authority.",
    impact: "A commercial and operating reset was undertaken across store economics, stock and procurement. A whole-group financial turnaround is not claimed.", impactLabel: "Business Impact",
    visual: ["Store margin", "Stock age", "Cash release", "Management action"]
  },
  {
    slug: "retail-clearance-stock-profitability", title: "Retail clearance and stock profitability", sector: "Retail", geography: "Oman", type: "Operating pilot",
    summary: "A clearance pilot judged against cash release and the full store P&L.",
    overview: "An anonymized operating pilot. The evidence supports a real test and uneven P&L movement, not a lasting turnaround claim.",
    problem: "Slow stock tied up cash, but deeper discounts could also destroy gross profit and leave store overhead uncovered.",
    solution: "A temporary format tested markdown and assortment decisions against store results. Current stock-age and demand models could recommend markdown bands within approved price and cash floors.",
    technology: "Store sales and P&L tracking, extended today with SKU age, landed cost, POS events and replenishment in one governed view.",
    commercial: "The relevant measures are cash recovered and contribution after markdown, rent, labour and handling. Margin percentage alone is incomplete.",
    operating: "Merchandising owns price tests, stores execute them and finance reviews the complete P&L. Automated recommendations remain inside approved policy.",
    impact: "Pilot trading showed changing gross margins alongside uneven EBITDA, including a loss-making period. The pilot did not establish a lasting turnaround.", impactLabel: "Business Impact",
    visual: ["Ageing stock", "Markdown test", "Cash recovered", "Full P&L"]
  },
  {
    slug: "payments-embedded-finance-growth", title: "Payments and embedded-finance growth", sector: "Payments", geography: "GCC and MENAP", type: "Strategy blueprint",
    summary: "A segment-led growth model for payment APIs, ledgers and enterprise financial operations.",
    overview: "An anonymized strategy case for growing payments through treasury, bank and platform use cases with different economics and controls.",
    problem: "Payment volume can rise while net revenue remains weak after partner share, losses, support and compliance cost.",
    solution: "The model separates enterprise treasury, bank and multi-party platform needs. Each segment starts with a narrow integration and transaction-level economics.",
    technology: "Permissioned payment APIs, virtual accounts, auditable ledgers, webhooks and settlement reporting. AI can triage reconciliation exceptions but cannot move funds or change risk rules on its own.",
    commercial: "Net revenue is fee income after partner share, incentives, losses and service cost. Transaction volume is an activity measure, not the result.",
    operating: "Commercial, product, finance, compliance and partners share a segment scorecard. Regulated actions remain with authorized people.",
    impact: "A staged pilot would validate net revenue per transaction and client contribution before wider market expansion. No signed-client or revenue result is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Client workflow", "Payment rails", "Operational ledger", "Net revenue"]
  },
  {
    slug: "warehouse-working-capital-3pl", title: "Warehouse, working capital and 3PL", sector: "Retail and logistics", geography: "Oman", type: "Strategy blueprint",
    summary: "A capacity and cash case linking old stock, warehouse space and an external fulfilment service.",
    overview: "An anonymized business case. It treats spare space as a cost until anchor demand and full service contribution are proven.",
    problem: "Ageing stock consumed cash and warehouse capacity. Empty space suggested a 3PL service, but demand and contribution had not been proven.",
    solution: "Release old stock, establish capacity that is genuinely spare and test one anchor-client fulfilment offer before adding fixed cost.",
    technology: "Inventory and warehouse feeds, scan events, SKU-age analytics, route APIs and a service-cost dashboard. AI can forecast capacity and flag service exceptions.",
    commercial: "A client fee must cover storage, pick, pack, delivery, failed attempts, claims and receivables. Rent already paid does not make the next order free.",
    operating: "Retail stock and logistics owners share capacity planning. Finance checks client contribution and cash. Service promises remain human approved.",
    impact: "The pilot case would compare stock cash release and external fulfilment contribution with a reconciled warehouse baseline. No profitable 3PL launch is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Stock release", "Verified capacity", "Anchor client", "3PL contribution"]
  },
  {
    slug: "saudi-market-entry-distribution", title: "Saudi market entry and distribution", sector: "Consumer distribution", geography: "Oman to Saudi Arabia", type: "Strategy blueprint",
    summary: "A market-entry model built around rights, landed cost, channels and local operating capacity.",
    overview: "An anonymized regional growth case. Planning and partner work are evidenced; Saudi sales and profitability are not.",
    problem: "Regional demand did not justify a local setup without product rights, landed cost and a credible route to customers.",
    solution: "Secure representation and supplier rights, validate one channel and delay inventory or fixed commitments until the contribution case holds.",
    technology: "Partner and product master data, CRM, landed-cost models, commerce APIs and supply-chain events. AI can compare demand scenarios but cannot certify rights or compliance.",
    commercial: "Market contribution equals sales after product cost, import, channel, logistics, acquisition and local overhead. The case must survive slower sell-through.",
    operating: "A local commercial owner manages partner terms. Procurement and finance control inventory and investment gates.",
    impact: "A limited pilot would test channel contribution, cash needs and sell-through before a full operating setup. No Saudi rollout result is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Rights", "Landed cost", "Channel pilot", "Local scale"]
  },
  {
    slug: "enterprise-software-marketplace", title: "Enterprise software marketplace", sector: "B2B software", geography: "GCC", type: "Strategy blueprint",
    summary: "A verified-entitlement model for software licences, renewals, services and reseller distribution.",
    overview: "An anonymized B2B marketplace case derived from software distribution and digital-transformation planning.",
    problem: "Licence buying, renewals and implementation services are fragmented, while vendor rights and working capital constrain supply.",
    solution: "A marketplace would combine approved Microsoft, Adobe and other software offers with service matching, renewal management and verified reseller storefronts.",
    technology: "Multi-tenant commerce, licence and provisioning APIs, billing, identity, reseller CRM and entitlement records. AI can map requirements to approved products and draft quotes for human approval.",
    commercial: "Licence margin, platform fees and service attachment must cover reseller support, provisioning errors, renewal work and working capital.",
    operating: "Vendors and distributors control product rights. Resellers own customer relationships. The platform governs catalogue, commercial rules, fulfilment and audit.",
    impact: "A reseller cohort and renewal pilot would test independent sales, provisioning accuracy and contribution. No live network, GMV or financing book is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Vendor rights", "Reseller storefront", "Customer order", "Entitlement and renewal"]
  },
  {
    slug: "heritage-lifestyle-commerce", title: "Heritage lifestyle commerce", sector: "Retail property and local brands", geography: "Oman", type: "Strategy blueprint",
    summary: "A commerce model for local design, heritage retail and experience-led tenant growth.",
    overview: "A heritage retail concept for turning a landmark asset into a more relevant place to shop, discover local design and spend time.",
    problem: "An established retail asset can lose relevance when leasing is managed around occupancy alone rather than customer demand and tenant sales.",
    solution: "Curate heritage lifestyle, local brands, pop-ups and digital storefronts around a clear customer reason to visit. Start with small commercial pilots before major refurbishment.",
    technology: "Tenant commerce feeds, footfall analytics, CRM, event tools and a local-product catalogue. AI can compare tenant mix and event scenarios, with landlord and tenant approval.",
    commercial: "Tenant sales, repeat visits, rent yield and event or media income must cover programming and any physical investment.",
    operating: "Asset management, leasing and tenants share a trading calendar and review customer and sales evidence together.",
    impact: "A pilot would measure tenant sales and repeat visits before capital is committed. No implemented retail revival is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Local makers", "Curated place", "Digital storefront", "Tenant economics"]
  },
  {
    slug: "digital-wedding-platform", title: "Digital wedding and event platform", sector: "Event technology", geography: "Qatar and GCC", type: "Strategy blueprint",
    summary: "A premium invitation, RSVP and guest-operations model for complex events.",
    overview: "An event-tech concept that treats service reliability and privacy as part of the product, not back-office details.",
    problem: "Multi-day events create fragmented invitation, guest list, RSVP, reminder and check-in work.",
    solution: "A host dashboard and concierge workflow would manage bilingual invitations, household-level guests, attendance changes and event-day check-in.",
    technology: "Secure guest database, WhatsApp and SMS delivery, QR check-in, permissions and audit. AI can draft bilingual copy and reminder timing, while hosts approve every message.",
    commercial: "Package contribution must cover messaging, design, concierge hours, service recovery and payment cost.",
    operating: "A service lead owns each event. Hosts control guest data and approvals. Event staff work from one current attendance record.",
    impact: "A paid pilot would test guest response, concierge effort, message cost and margin per event. No bookings or completed weddings are claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Host setup", "Guest message", "RSVP changes", "Event check-in"]
  },
  {
    slug: "enterprise-ai-transformation-practice", title: "Enterprise AI transformation practice", sector: "Enterprise technology", geography: "Oman and Bahrain", type: "Strategy blueprint",
    summary: "An asset-light model that links board-level business problems to specialist AI delivery.",
    overview: "An anonymized practice design. It is a business case, not a launched advisory unit or client-result claim.",
    problem: "Enterprise AI activity can remain a collection of pilots without clear economics, accountable process owners or delivery capacity.",
    solution: "A small commercial core would define the business case, operating change and benefit measures, then bring in approved specialists after a mandate is signed.",
    technology: "Microsoft cloud and AI services, approved client platforms, process maps and a value tracker. Agents can prepare diagnostics and evidence, with partner and client approval.",
    commercial: "Fixed leadership cost must be covered by signed work and blended contribution. Specialist capacity stays variable until demand is proven.",
    operating: "The practice lead owns origination, scope and value tracking. Specialists deliver under client security, data and independence controls.",
    impact: "A small mandate pipeline and packaged diagnostic would test demand and contribution before a permanent bench is built. No launched practice or billing is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Board problem", "Value case", "Specialist delivery", "Measured result"]
  },
  {
    slug: "aeofind", title: "AEOFind", sector: "AI search visibility", geography: "Global", type: "Product concept",
    summary: "A diagnostic product for finding commercial gaps in AI answers and search visibility.",
    overview: "A named product concept from Haris's work. It is presented as a designed diagnostic, without ranking or client-performance claims.",
    problem: "Brands can generate content and traffic without knowing whether AI answers cite them correctly or send qualified demand.",
    solution: "A monitored diagnostic would map commercial questions, sample answers, verify sources and prioritize technical, entity and content fixes.",
    technology: "Crawl and index data, structured data, answer sampling, citation registry, analytics and CRM attribution. AI can classify gaps and draft grounded updates for editorial review.",
    commercial: "A recurring monitoring model must improve qualified demand or assisted pipeline enough to cover research, content and platform cost.",
    operating: "Researchers validate sources, editors approve claims and commercial owners measure downstream conversion by intent.",
    impact: "The product concept would establish a fixed intent baseline and measure changes in qualified visibility. No deployed customer result is claimed.", impactLabel: "Modeled Business Impact",
    visual: ["Commercial question", "AI answer and sources", "Content action", "Qualified demand"]
  }
];

const aiProjects = [
  {
    slug: "ai-commerce-command-center", path: "/ai-commerce", title: "AI Commerce Command Center", sector: "Applied AI", geography: "Commerce operations", type: "In development",
    summary: "A coordinated operating layer for catalogue, orders, care, sellers, inventory, pricing and finance.",
    overview: "An in-development Haris project designed for lean commerce teams that need better coordination without handing material decisions to autonomous software.",
    problem: "Commerce signals sit across different systems and teams. Decisions arrive late or without the full operating context.",
    solution: "One operator view would bring those signals together. Agents prepare catalogue fixes, customer-care responses and exception summaries. People approve consequential actions.",
    technology: "Live commerce APIs, event feeds, a governed data layer, policy retrieval and permissioned AI tools. Price, stock and orders come from authoritative systems.",
    commercial: "The business case compares contribution, service cost and operator time with an agreed baseline.",
    operating: "Commercial, fulfilment, care and finance owners retain decision rights. Every recommendation and approved action has an audit trail.",
    impact: "The project is in development. Its effect on contribution, service cost and operator time remains to be tested.", impactLabel: "Modeled Business Impact",
    visual: ["Operating signal", "Evidence and policy", "Human approval", "Audited action"]
  },
  {
    slug: "career-runway-ai", path: "/career-runway", title: "Career Runway AI", sector: "Decision support", geography: "Global", type: "Live",
    summary: "A personal decision tool that connects career choices to real financial runway.",
    overview: "A live Haris project that combines structured career assessment with deterministic runway calculations and guarded AI explanation.",
    problem: "Major career decisions are often made without a clear view of debt, dependents, cash runway and practical trade-offs.",
    solution: "The product combines Career DNA with the user's own financial inputs. AI explains scenarios but does not alter the underlying calculations or make the decision.",
    technology: "Consented personal inputs, a calculation engine, scenario rules and an LLM narrative layer with strict access and deletion controls.",
    commercial: "The product is designed around trusted decision support. No revenue, placement or employment-outcome model is claimed.",
    operating: "The user owns the decision. The product shows assumptions, uncertainty and trade-offs instead of recommending an employer or role.",
    impact: "The product is live. No user-growth, revenue or career-outcome figure is published.", impactLabel: "Business Impact",
    visual: ["Career DNA", "Financial facts", "Scenario engine", "User decision"]
  }
];

const allUseCases = [...useCases, ...aiProjects];
const usePath = item => item.path || `/use-cases/${item.slug}`;
const useCard = item => card(usePath(item), item.type, item.title, item.summary, `${item.sector} · ${item.geography}`);
const trackPath = item => `/track-record/${item.slug}`;
const trackCard = item => card(trackPath(item), item.role, item.name, item.summary, `${item.geography} · ${item.period}`);

const trackPage = item => ({
  path: trackPath(item), type: "WebPage", kind: "track", title: `${item.name} | Track Record | Haris Aslam`,
  description: `${item.summary} An operating record of mandate, economics, technology and relevance.`,
  eyebrow: "Track record", h1: item.name, intro: item.summary,
  body: `${tagRow([item.role, item.geography, item.period])}<div class="detail-layout"><div class="detail-main">${field("Role and mandate", item.mandate)}${field("What was built or fixed", item.built)}${field("Commercial contribution", item.commercial)}${field("Technology and operations", item.technology)}${field("Business relevance", item.relevance)}</div>${diagram("Operating view", item.visual, "Commercial and operating work viewed as one system.")}</div>${section("Related use cases", grid(allUseCases.filter(useCase => item.slug === "roumaan" ? useCase.slug.includes("commerce") : item.slug === "floward-oman" ? useCase.slug.includes("gifting") : item.slug === "upapp-factory" ? useCase.slug.includes("software") || useCase.slug.includes("enterprise-ai") : useCase.slug.includes("retail")).slice(0, 3).map(useCard)))}`
});

const useCasePage = item => ({
  path: usePath(item), type: "WebPage", kind: "case", title: `${item.title} | Use Case | Haris Aslam`,
  description: item.summary.length >= 80 ? item.summary : `${item.summary} A business use case covering solution, technology, commercial model, operations and impact.`,
  eyebrow: `${item.type} · ${item.geography}`, h1: item.title, intro: item.summary,
  project: item.slug === "ai-commerce-command-center" || item.slug === "career-runway-ai" ? { name: item.title, status: item.type, description: item.summary } : undefined,
  body: `${tagRow([item.sector, item.geography, item.type])}<div class="detail-layout"><div class="detail-main">${field("Overview", item.overview)}${field("Business Problem", item.problem)}${field("Solution", item.solution)}${field("Technology", item.technology)}${field("Commercial Model", item.commercial)}${field("Operating Model", item.operating)}${field(item.impactLabel, item.impact)}</div>${diagram("Business system", item.visual, item.impactLabel === "Modeled Business Impact" ? "Designed model. Outcome remains to be validated." : "Operating evidence is stated without unverified figures.")}</div>${section("Continue exploring", grid([card("/use-cases", "Use cases", "More business problems", "Browse commerce, retail, fintech, enterprise technology and growth cases."), card("/ai-transformation", "Applied AI", "AI & Transformation", "See how AI fits inside commercial and operating workflows.")]))}`
});

const insights = [
  { slug: "marketplace-gmv-revenue-contribution", title: "Marketplace GMV, revenue and contribution", lead: "GMV is demand. Revenue is the platform's share. Contribution is what remains after serving the transaction.", visual: ["GMV", "Platform revenue", "Service costs", "Contribution"], paragraphs: ["A marketplace can report rising GMV and still lose money on each order. GMV is the value of goods sold by merchants. It is not the platform's sales.", "Revenue starts with commission and charged services. Then subtract seller onboarding, payments, support, returns, incentives and fulfilment. If the remainder is negative, growth scales the loss.", "Review seller and category cohorts by completed orders and contribution. Build liquidity where both hold before widening the catalogue."] },
  { slug: "seller-onboarding-economics", title: "Seller onboarding economics", lead: "A registered seller becomes useful only when its offers are accurate, available and fulfilable.", visual: ["Verified seller", "Trade-ready offers", "First completed order", "Repeat supply"], paragraphs: ["The expensive part of onboarding comes after registration. Product data must be complete, stock must be accurate and the seller must meet the service promise shown to the customer.", "Track the path from verification to live offers, first completed order and repeat trading. Include catalogue support, failures and returns in seller contribution.", "AI can clean attributes and flag missing information. It cannot verify a merchant or product by guessing."] },
  { slug: "margin-to-cash-retail-turnaround", title: "Margin-to-cash retail turnaround", lead: "A margin improvement matters when it releases stock cash and improves the full store P&L.", visual: ["Gross margin", "Stock age", "Cash release", "Store contribution"], paragraphs: ["Retail turnarounds often start with a gross-margin report. The report is useful, but it misses how long cash remains trapped in stock.", "A practical bridge connects selling price and product cost to markdown, inventory age, occupancy, labour and supplier terms. The team can then see which actions improved both profit and cash.", "The weekly review should follow actual cash release and full store contribution, not one percentage in isolation."] },
  { slug: "agent-led-social-commerce-economics", title: "Agent-led social-commerce economics", lead: "Merchant supply, agent trust and buyer fulfilment have to work in the same transaction.", visual: ["Merchant", "Sales agent", "Buyer", "Audited payout"], paragraphs: ["Agent-led commerce adds a human distribution layer to a marketplace. That layer can expand reach, but it also adds commission, attribution and trust obligations.", "Measure active merchant-agent pairs, completed attributable orders, repeat purchase and payout accuracy. Registrations and downloads are only early funnel signals.", "Every party should be able to see why an order was attributed and how a payout was calculated."] },
  { slug: "commerce-tasks-for-ai-agents", title: "Which commerce tasks AI agents should automate", lead: "Start with reversible work over reliable data before giving software broader authority.", visual: ["Read evidence", "Draft action", "Human approval", "Audit outcome"], paragraphs: ["Catalogue cleanup, order-status summaries and exception routing are good early agent tasks because the source facts can be checked and mistakes can be reversed.", "Price changes, refunds, seller sanctions and payouts carry more consequence. They require explicit policy, permissions and human approval.", "Automation should earn wider scope through task accuracy, service quality, contribution and clean rollback evidence."] },
  { slug: "rag-versus-live-operational-apis", title: "RAG versus live operational APIs", lead: "Use retrieval for approved knowledge and APIs for facts that change with the operation.", visual: ["Policy knowledge", "Live API fact", "Decision rule", "Approved action"], paragraphs: ["RAG is useful for policies, procedures and product guidance. It is a poor substitute for live stock, current price or the status of a specific order.", "An operating agent often needs both. It retrieves the relevant rule, then queries the source system for the current fact.", "Keeping those sources distinct makes errors easier to diagnose and gives operators a clearer evidence trail."] },
  { slug: "payment-volume-versus-net-revenue", title: "Payment volume versus net revenue", lead: "Payment volume shows activity. It does not show what the provider keeps.", visual: ["Payment volume", "Gross fees", "Partner and loss cost", "Net revenue"], paragraphs: ["A payment plan can look large when it begins with transaction value. The provider receives only a small fee pool from that value.", "Partner share, incentives, fraud, compliance, support and settlement cost reduce the pool again. Recognized net revenue and gross profit are better operating measures.", "Model each segment separately. A bank workflow, merchant service and multi-party platform rarely have the same integration or risk cost."] },
  { slug: "warehouse-capacity-as-a-3pl-business", title: "When warehouse capacity can become a 3PL business", lead: "Spare space becomes a business only after anchor demand covers the full service cost.", visual: ["Spare capacity", "Anchor demand", "Service cost", "Client contribution"], paragraphs: ["A retailer may see unused racks and assume it can sell fulfilment cheaply. The existing rent is only one part of the cost.", "Picking, packing, delivery, failed attempts, claims, receivables and service management must be included in the client P&L.", "Start with one anchor client and a limited service scope. Expand only when contracted volume, service quality and contribution hold together."] }
];

const articleCard = item => card(`/insights/${item.slug}`, "Insight", item.title, item.lead);
const articlePage = item => ({ path: `/insights/${item.slug}`, type: "Article", kind: "article", datePublished: "2026-09-16", title: `${item.title} | Haris Aslam`, description: `${item.lead} A practical note on GCC business economics and operating decisions.`, eyebrow: "Insight", h1: item.title, intro: item.lead, body: `<div class="article-layout"><article class="article-copy">${item.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}</article>${diagram("Operating lens", item.visual)}</div>${section("Related work", grid([card("/use-cases", "Use cases", "See the models in practice", "Explore business problems, solutions, operating models and economics."), card("/ai-transformation", "Applied AI", "AI & Transformation", "See bounded automation inside real workflows.")]))}` });

const home = {
  path: "/", type: "WebPage", kind: "home", title: "Muhammad Haris Aslam | GCC Operator and Business Builder", description: "Muhammad Haris Aslam is a GCC operator, business builder and transformation leader across commerce, retail, marketplaces, enterprise technology and AI.", eyebrow: "Muhammad Haris Aslam", h1: "Build businesses. Fix economics. Scale what works.", intro: "GCC operator, business builder and transformation leader across commerce, retail, marketplaces, enterprise technology and AI.", heroAside: `<figure class="hero-portrait"><img src="/assets/haris-aslam.webp" alt="Portrait of Muhammad Haris Aslam" width="717" height="960"><figcaption>Operator · Builder · Transformation leader</figcaption></figure>`,
  body: `<div class="hero-actions">${link("/track-record", "View track record", "button")}${link("/use-cases", "Explore use cases", "button button-secondary")}</div>${section("Selected operating record", grid(trackRecords.slice(0, 4).map(trackCard)) + link("/track-record", "View full track record"))}${section("Areas of work", `<div class="area-grid"><span>Business building</span><span>Commerce and marketplaces</span><span>Retail economics</span><span>Enterprise technology</span><span>GCC growth</span><span>Applied AI</span></div>`)}${section("Selected use cases", grid([useCases[0], useCases[2], useCases[5], useCases[7], aiProjects[0], useCases[10]].map(useCard)) + link("/use-cases", "Browse all use cases"))}${section("AI & Transformation", `<div class="feature-split"><div><p>AI works when it is attached to an operating decision, reliable data and a person who owns the result.</p>${link("/ai-transformation", "Explore AI & Transformation")}</div>${diagram("Controlled automation", ["Signal", "Evidence", "Approval", "Action"])}</div>`)}${section("Insights", grid(insights.slice(0, 4).map(articleCard)) + link("/insights", "Read all insights"))}${section("About", `<div class="narrow-copy"><p>Haris works across the decisions that turn an idea into an operating business: proposition, economics, technology and execution.</p>${link("/about", "More about Haris")}</div>`)}${section("Contact", `<div class="narrow-copy"><p>For a discussion about business building, commerce, transformation or applied AI.</p>${link("/contact", "Get in touch", "button")}</div>`, "contact-section")}`
};

const trackIndex = { path: "/track-record", type: "CollectionPage", kind: "track-index", title: "Track Record | Muhammad Haris Aslam", description: "A selective operating track record across Roumaan, Floward Oman, Salman Corporation, Miraq, KSM, UpApp Factory and Vodafone Qatar.", eyebrow: "Track record", h1: "Operating experience, selectively told", intro: "Named ventures and roles where Haris held direct operating, building or transformation responsibility.", body: `${section("Selected record", grid(trackRecords.map(trackCard)))}${section("How to read this section", `<div class="feature-split"><p>Each page follows the mandate through the operating work, commercial logic, technology and business relevance.</p>${diagram("From mandate to value", ["Mandate", "Operating work", "Commercial effect", "Business relevance"])}</div>`)}` };

const useIndex = { path: "/use-cases", type: "CollectionPage", kind: "use-index", title: "Business Use Cases | Muhammad Haris Aslam", description: "Anonymized business use cases across banking, commerce, retail, payments, logistics, enterprise technology, AI and GCC market entry.", eyebrow: "Use cases", h1: "Business problems turned into operating models", intro: "Each case connects the problem to a solution, technology, commercial model, operating model and impact.", body: `${section("Implemented work and operating pilots", grid(allUseCases.filter(item => ["Operating case", "Operating pilot", "Live"].includes(item.type)).map(useCard)))}${section("Business cases and product concepts", `<p class="section-intro">These cases describe designed models. Their impact is explicitly modeled rather than presented as achieved.</p>${grid(allUseCases.filter(item => !["Operating case", "Operating pilot", "Live"].includes(item.type)).map(useCard))}`)}` };

const aiPage = { path: "/ai-transformation", type: "CollectionPage", kind: "ai", title: "AI & Transformation | Muhammad Haris Aslam", description: "Applied AI projects and transformation cases focused on commerce operations, reliable data, bounded automation and measurable business economics.", eyebrow: "AI & Transformation", h1: "AI inside the operating model", intro: "Useful AI improves a real workflow, works from reliable facts and keeps consequential decisions accountable.", body: `${section("Projects", grid(aiProjects.map(useCard).concat([useCard(useCases.find(item => item.slug === "aeofind"))])))}${section("Transformation cases", grid([useCases[0], useCases[1], useCases[7], useCases[13]].map(useCard)))}${section("Operating principle", `<div class="feature-split"><div><p>Use retrieval for approved knowledge. Use live APIs for prices, stock, orders and money. Give agents narrow permissions and widen them only after accuracy, service and economics hold.</p>${link("/insights/commerce-tasks-for-ai-agents", "Read the automation note")}</div>${diagram("Agent control loop", ["Reliable signal", "Policy and evidence", "Human decision", "Audited action"])}</div>`)}` };

const insightsPage = { path: "/insights", type: "CollectionPage", kind: "insights", title: "Insights on Commerce and Transformation | Haris Aslam", description: "Eight practical articles on marketplace economics, retail cash, social commerce, AI operations, payments and warehouse contribution.", eyebrow: "Insights", h1: "Notes from operating work", intro: "Short reads on the economics and decisions that determine whether a model works.", body: `${section("Latest", grid(insights.map(articleCard)))}${section("Editorial focus", `<div class="feature-split"><p>The writing stays close to operating questions: how revenue is earned, where cost enters, who owns the decision and what evidence is needed before scale.</p>${diagram("Business lens", ["Problem", "Economics", "Operating choice", "Evidence"])}</div>`)}` };

const about = { path: "/about", type: "ProfilePage", kind: "about", title: "About Muhammad Haris Aslam | GCC Operator", description: "Muhammad Haris Aslam is a GCC operator and business builder with experience across digital commerce, retail, marketplaces, enterprise technology and applied AI.", eyebrow: "About", h1: "Muhammad Haris Aslam", intro: "Operator, business builder and transformation leader.", heroAside: `<figure class="hero-portrait compact"><img src="/assets/haris-aslam.webp" alt="Portrait of Muhammad Haris Aslam" width="717" height="960"></figure>`, body: `${section("Operating background", `<div class="about-layout"><div class="article-copy"><p>Haris has built and operated digital-commerce ventures, launched a country operation, worked through retail margin and cash problems, and delivered enterprise technology.</p><p>His work starts with the business model. Where will value come from? What has to change in the operation? Which technology belongs in the solution, and which decisions still need an accountable person?</p><p>He is based in Doha and works across GCC commerce, retail, enterprise technology and applied AI.</p></div>${diagram("Working pattern", ["Find the problem", "Design the economics", "Build the operation", "Measure the result"])}</div>`)}${section("Selected track record", grid(trackRecords.slice(0, 3).map(trackCard)))}` };

const contact = { path: "/contact", type: "ContactPage", kind: "contact", title: "Contact Muhammad Haris Aslam", description: "Contact Muhammad Haris Aslam about business building, digital commerce, retail transformation, enterprise technology, GCC growth and applied AI.", eyebrow: "Contact", h1: "Start with the business problem", intro: "A useful conversation begins with the market, the economics and the decision that needs to be made.", body: `${section("Contact", `<div class="contact-grid"><div><span>Email</span><a href="mailto:${site.email}">${site.email}</a></div><div><span>LinkedIn</span><a href="${site.linkedin}" rel="me noopener">Connect with Haris <span aria-hidden="true">↗</span></a></div></div><p class="contact-note">A short note on the problem and its operating context is enough.</p>`)}` };

export const pages = [home, trackIndex, ...trackRecords.map(trackPage), useIndex, ...useCases.map(useCasePage), ...aiProjects.map(useCasePage), aiPage, insightsPage, ...insights.map(articlePage), about, contact];
