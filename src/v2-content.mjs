export const site = {
  name: "Muhammad Haris Aslam",
  shortName: "Haris Aslam",
  origin: "https://www.mharisaslam.com",
  email: "haris@mharisaslam.com",
  linkedin: "https://www.linkedin.com/in/harisaslam/"
};

export const navigation = [
  ["Home", "/"], ["Work", "/work"], ["AI & Transformation", "/ai-transformation"],
  ["Insights", "/insights"], ["About", "/about"], ["Contact", "/contact"]
];

const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const link = (href, label, className = "text-link") => `<a class="${className}" href="${href}">${esc(label)} <span aria-hidden="true">→</span></a>`;
const section = (title, content, className = "") => `<section class="section ${className}"><div class="section-heading"><h2>${title}</h2></div>${content}</section>`;
const card = (href, label, title, text, status = "") => `<a class="work-card" href="${href}"><span class="card-label">${esc(label)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p>${status ? `<span class="card-status">${esc(status)}</span>` : ""}<span class="card-link">View details <span aria-hidden="true">→</span></span></a>`;
const grid = items => `<div class="card-grid">${items.join("")}</div>`;
const para = text => `<p>${esc(text)}</p>`;

const cases = [
  {
    slug: "multi-category-digital-commerce", title: "Multi-category digital commerce", sector: "Commerce", geography: "Oman", period: "2014-2018", type: "Operating case",
    summary: "Built and operated a broad-category online retailer, with a separate seller-marketplace expansion examined in planning materials.",
    problem: "A fragmented online market needed a dependable catalogue, clear stock availability and fulfilment customers could trust.",
    solution: "The operating business brought multiple retail categories into one online proposition, with central merchandising and order handling. A later seller model was evaluated but is not presented as a launched marketplace. Today, catalogue-quality agents and demand signals could support the same trading discipline.",
    technology: "The original operation used a commerce CMS, product catalogue and order analytics. A current implementation would connect stock, orders, pricing and care through APIs, with AI suggestions checked against live source data.",
    commercial: "First-party order contribution depends on product margin after delivery, payment, returns and acquisition costs. Seller take rate would need a separate model for onboarding, service and disputes.",
    operating: "Category, inventory, fulfilment and customer care decisions belonged to accountable operators. Automation should surface exceptions; people should retain price, supplier and refund authority.",
    impact: "The retailer traded online with recorded orders and customer registrations. Seller-marketplace expansion remained a separate plan, not a launched result.",
    impactLabel: "Business Impact"
  },
  {
    slug: "agent-led-social-commerce", title: "Agent-led social commerce", sector: "Marketplace", geography: "Oman", period: "2020-2021", type: "Operating case",
    summary: "A merchant-and-agent commerce platform with live apps, onboarding records, campaigns and a dated operational handover.",
    problem: "Small merchants needed digital distribution while independent sales agents needed a reliable way to discover offers and earn commissions.",
    solution: "Merchant and agent apps supported onboarding, catalogue sharing and campaign activity. A modern layer could help merchants prepare product data and match agents to offers, but it should not obscure who made a sale.",
    technology: "The original operation used mobile apps, a CMS and funnel reporting. Current APIs, identity checks, event attribution and a payout ledger would make each transaction easier to trace.",
    commercial: "Order contribution must cover platform service, agent payout, payment fees, disputes and fulfilment. Registrations and downloads are not substitutes for active trading pairs.",
    operating: "Merchant admission, commissions, claims and payouts require human ownership. Agents can help with onboarding and care, while the platform audits attribution.",
    impact: "Merchant and agent apps went live, supported onboarding and campaigns, and reached an operational handover. No verified profitability result is attributed to the platform.",
    impactLabel: "Business Impact"
  },
  {
    slug: "retail-group-transformation", title: "Retail group transformation", sector: "Retail", geography: "Oman", period: "2023-2025", type: "Operating case",
    summary: "A family-retail operating reset focused on store economics, stock, procurement and management cadence.",
    problem: "Weak cash conversion, ageing stock and overlapping channels made growth plans hard to fund and hard to measure.",
    solution: "The work set category, store and channel decisions against margin and cash. A present-day control layer could consolidate POS and inventory feeds, flag stock ageing and draft variance explanations for finance review.",
    technology: "Historical sources include management reporting, e-commerce and ERP assessment. A modern stack would use POS/ERP integration, a contribution data mart and a supervised exception workflow.",
    commercial: "Sales only help when gross profit covers occupancy, labour, returns, stock holding and working-capital needs. Expansion scenarios should be evaluated separately from the core reset.",
    operating: "Store, category, procurement and finance owners need one weekly review of margin, stock and cash. AI can find anomalies, not approve capital or reclassify forecasts as results.",
    impact: "A management and operating reset was undertaken across store economics, stock and procurement. A whole-group financial turnaround has not been established.",
    impactLabel: "Business Impact"
  },
  {
    slug: "retail-clearance-stock-profitability", title: "Retail clearance and stock profitability", sector: "Retail", geography: "Oman", period: "2023-2024", type: "Operating pilot",
    summary: "A clearance pilot tested price, assortment and cost decisions against full store profitability.",
    problem: "Slow-moving stock tied up cash; deeper discounts could release it but also destroy gross profit.",
    solution: "A temporary clearance format tested markdown and assortment changes using store P&L records. Current stock-age models could recommend markdown bands, with merchants approving price floors and finance checking cash release.",
    technology: "The original pilot used store-level sales and P&L tracking. A current system would connect SKU age, landed cost, POS sales and replenishment into a governed dashboard.",
    commercial: "Measure cash recovered and contribution after markdown, rent, labour and handling, not gross margin alone.",
    operating: "Merchandising owns price tests; stores execute; finance reviews the entire P&L. Any automated markdown remains inside approved policy limits.",
    impact: "Pilot trading showed changing gross margins alongside uneven EBITDA, including a loss-making month. The pilot did not establish a lasting turnaround.",
    impactLabel: "Business Impact"
  },
  {
    slug: "app-studio-operating-model", title: "App-studio operating model", sector: "Enterprise technology", geography: "Oman", period: "2018-2021", type: "Operating case",
    summary: "A lean studio model for contracted web and mobile products, with scoped delivery, testing and handover.",
    problem: "Custom digital projects needed repeatable delivery quality without carrying a large fixed team for every new brief.",
    solution: "The studio used qualification, requirements, project plans and handover discipline. Today, AI can help trace requirements to tests and support tickets while a delivery lead remains responsible for scope and acceptance.",
    technology: "Historical work used web and mobile development tools, requirements documents and testing workflows. A current setup would add API contracts, CI, issue tracking and an approved knowledge assistant.",
    commercial: "Project contribution depends on scope control, delivery hours, partner cost, rework and post-launch support.",
    operating: "A commercial lead qualifies work; product and technical owners control delivery; clients approve milestones. Automation helps document and test the work, not claim client outcomes.",
    impact: "The studio launched and delivered client project work with scoped plans, testing and handovers. Studio profitability and client-performance gains are not attributed to this model.",
    impactLabel: "Business Impact"
  },
  {
    slug: "90-day-retail-performance-reset", title: "90-day retail performance reset", sector: "Retail operations", geography: "Oman", period: "2023-2024", type: "Strategy blueprint",
    summary: "A short-cycle plan for identifying margin, inventory and store-execution problems before expansion.",
    problem: "Management needed a fast way to distinguish weak demand from pricing, stock, procurement and service leakage.",
    solution: "Begin with store and category baselines, run a small number of controlled markdown and replenishment tests, then shift resources to the fixes that release cash. AI can prepare exceptions and forecast demand, subject to owner approval.",
    technology: "POS, inventory and finance feeds would support a daily view of sell-through, stock age and order contribution; workflow agents could route exceptions to store and category owners.",
    commercial: "The reset should measure gross-profit bridge, cash released from stock and store contribution after occupancy and labour.",
    operating: "One accountable commercial owner runs a weekly review with finance, procurement and store managers. Human approval is required for pricing, supplier and staffing decisions.",
    impact: "A store and category baseline would identify where margin and cash leak. Controlled tests would then select only fixes that improve contribution and cash before wider rollout.",
    impactLabel: "Modeled Business Impact"
  },
  {
    slug: "embedded-finance-growth-model", title: "Payments and embedded-finance growth model", sector: "Payments", geography: "GCC and MENAP", period: "2026 strategy", type: "Strategy blueprint",
    summary: "An outside-in growth model for payment APIs, platform settlement and partner-led financial operations.",
    problem: "Payment volume can rise while net revenue remains weak after partners, losses, support and regulatory cost.",
    solution: "Separate treasury, bank and platform use cases; prove one segment at a time through partner integrations and measurable transaction economics. AI can flag reconciliation exceptions but should not move funds or change risk rules autonomously.",
    technology: "Permissioned payment APIs, auditable transaction ledger, webhook/event feeds, risk controls and settlement reporting. AI uses grounded policy and live transaction APIs under tool approval.",
    commercial: "Net revenue is fee income less partner share, incentives, fraud and service cost. Transaction volume is an activity measure, not an outcome.",
    operating: "Commercial, product, finance, compliance and partner teams share a segment-level scorecard. Regulated decisions remain with authorized people.",
    impact: "The model tests net revenue per transaction and contribution in one segment at a time. Growth would proceed only where partner costs, losses and service expense leave a positive result.",
    impactLabel: "Modeled Business Impact"
  },
  {
    slug: "warehouse-working-capital-transformation", title: "Warehouse and working-capital transformation", sector: "Retail and logistics", geography: "Oman", period: "2023-2024", type: "Strategy blueprint",
    summary: "A capacity and cash case linking slow stock, warehouse space and a potential third-party fulfilment service.",
    problem: "Stock and spare storage capacity carried cost before they created service revenue.",
    solution: "Release aged inventory, define capacity that is genuinely available, and test an anchor-client fulfilment offer before treating the warehouse as a 3PL business. Forecasting and route automation can support service promises.",
    technology: "Inventory and warehouse-management feeds, SKU-age analytics, order/route APIs and a service-cost dashboard; supervised agents can flag exceptions and draft client updates.",
    commercial: "A 3PL fee must cover pick, pack, storage, delivery, claims and working capital. Rent already paid does not make each additional order free.",
    operating: "Retail stock owner and logistics lead share capacity planning; finance checks cash and client contribution; humans approve service-level commitments.",
    impact: "The case compares cash released from old stock with the incremental contribution from an anchor-client fulfilment pilot, after its full service costs.",
    impactLabel: "Modeled Business Impact"
  },
  {
    slug: "saudi-market-entry-distribution", title: "Saudi market entry and distribution", sector: "Consumer distribution", geography: "Oman to Saudi Arabia", period: "2023-2025", type: "Strategy blueprint",
    summary: "A market-entry case built around distribution rights, landed cost, channel choices and local operating capacity.",
    problem: "Regional demand alone could not justify a Saudi setup without local rights, cost-to-serve and a credible route to customers.",
    solution: "Sequence representation and supplier rights before committing to inventory or fixed cost. A current commercial stack could compare channel demand, landed cost and forecast contribution with live partner data.",
    technology: "Partner and product master data, commerce APIs, landed-cost model, CRM and supply-chain events; AI can draft demand scenarios but cannot certify rights or compliance.",
    commercial: "Market contribution is sales less product, import, channel, logistics, acquisition and local fixed costs. The business case must survive slower sell-through.",
    operating: "Local commercial owner manages partner terms and launch decisions; procurement and finance approve inventory and investment gates.",
    impact: "A limited pilot would test channel contribution, sell-through and cash needs before committing to a full local operating setup.",
    impactLabel: "Modeled Business Impact"
  }
];

const casePath = item => `/work/${item.slug}`;
const caseCard = item => card(casePath(item), `${item.type} · ${item.sector}`, item.title, item.summary);
const impact = item => `<div class="impact-note"><h2>${item.impactLabel}</h2>${para(item.impact)}</div>`;
const casePage = item => ({
  path: casePath(item), type: "WebPage", kind: "case", h1: item.title,
  title: `${item.title} | Haris Aslam`,
  description: item.summary,
  eyebrow: `${item.type} · ${item.geography}`,
  intro: item.summary,
  body: `<div class="case-meta"><span>${esc(item.sector)}</span><span>${esc(item.geography)}</span><span>${esc(item.period)}</span></div>
    <div class="case-layout"><div class="case-fields">
      ${[["Business Problem", item.problem], ["Solution", item.solution], ["Technology", item.technology], ["Commercial Model", item.commercial], ["Operating Model", item.operating]].map(([label, value]) => `<section class="case-field"><h2>${label}</h2>${para(value)}</section>`).join("")}
      ${impact(item)}
    </div></div>
    ${section("Related work", grid(cases.filter(other => other.slug !== item.slug && other.sector === item.sector).slice(0,2).map(caseCard).concat([card("/ai-transformation", "Applied AI", "AI & Transformation", "Operational AI projects and practical ways to improve commercial workflows.")])))}`
});

const insights = [
  { slug:"marketplace-gmv-revenue-contribution", title:"Marketplace GMV, revenue and contribution", lead:"GMV is demand. Revenue is the platform's share. Contribution is what remains after serving the transaction.",
    paragraphs:[
      "A marketplace can report rising GMV and still lose money on each order. GMV is the value of goods sold by merchants. It is not the platform's sales. Revenue starts with commission and any charged services.",
      "Then subtract the costs the platform actually carries: seller onboarding, payment fees, support, returns, incentives and fulfilment. If that remainder is negative, growth scales the loss. First-party retail needs its own margin bridge; combining it with seller GMV makes both look better than they are.",
      "The weekly question is simple: which seller and category cohorts generate completed orders with positive contribution? Build liquidity there before widening the catalogue."
    ], related:"multi-category-digital-commerce"},
  { slug:"seller-onboarding-economics", title:"Seller onboarding economics", lead:"A signed-up seller is not yet a useful source of supply.",
    paragraphs:[
      "The costly part of seller onboarding comes after registration. Product data has to be complete, stock has to be accurate and the seller needs to fulfil within the promise shown to the customer.",
      "Track the funnel from verified seller to live offers, first completed order and repeat trading. Include catalogue support, service failures and returns in seller contribution. AI can clean attributes and flag missing information, but it cannot verify a merchant by guessing.",
      "A small group of dependable sellers usually produces a better marketplace than a long list of inactive accounts."
    ], related:"agent-led-social-commerce"},
  { slug:"margin-to-cash-retail-turnaround", title:"Margin-to-cash retail turnaround", lead:"A margin improvement matters only if it releases stock cash and improves the full store P&L.",
    paragraphs:[
      "Retail turnarounds often begin with a gross-margin report. The report is useful, but it misses how much stock is ageing and how long cash remains trapped in it.",
      "Set markdown decisions against SKU age, replenishment, rent, labour and handling. A clearance pilot can improve margin in one period while EBITDA remains unstable in another. That is why a pilot should be reported as a pilot.",
      "The operator's review should connect margin to sell-through, cash recovered and store contribution. Automated alerts help find exceptions; price and procurement decisions still need an owner."
    ], related:"retail-clearance-stock-profitability"},
  { slug:"agent-led-social-commerce-economics", title:"Agent-led social-commerce economics", lead:"Merchant activity, agent trust and auditable payouts decide whether the network works.",
    paragraphs:[
      "Agent-led commerce has two supply problems. Merchants need active demand; agents need products they can credibly recommend and a commission they can trust.",
      "Downloads and registrations can move quickly without creating completed orders. Measure active merchant-agent pairs, attributable sales, disputes, payout timing and order contribution. The attribution ledger is as important as the storefront.",
      "AI can help prepare listings and suggest suitable agents. It should not quietly change commissions or settle contested claims."
    ], related:"agent-led-social-commerce"},
  { slug:"commerce-tasks-for-ai-agents", title:"Which commerce tasks AI agents should automate", lead:"Start with repetitive decisions that have reliable data and clear approval limits.",
    paragraphs:[
      "Catalogue gaps, order-status questions and inventory exceptions are good early agent tasks. They are frequent, measurable and can be checked against source systems.",
      "Pricing, refunds, merchant admission and payouts carry more commercial or regulatory risk. Agents can assemble evidence and recommend an action, but the business needs explicit decision rights before those tools can act.",
      "A useful pilot counts errors, override rates, response time and contribution, not just prompts handled."
    ], related:"multi-category-digital-commerce"},
  { slug:"rag-versus-live-operational-apis", title:"RAG versus live operational APIs", lead:"Policy answers and live transactions need different sources of truth.",
    paragraphs:[
      "Retrieval-augmented generation can help an assistant answer questions from approved policies, product documents and operating procedures. Those sources change less often and can be cited.",
      "Stock, price, order status and payment settlement are different. The assistant should read them from authenticated operational APIs at the moment of the request. A document index is not a safe substitute for a live balance or delivery promise.",
      "The strongest design combines grounded knowledge with permissioned tools, approval gates and an action log. The commercial owner still decides what the agent is allowed to do."
    ], related:"app-studio-operating-model"},
  { slug:"payment-volume-versus-net-revenue", title:"Payment volume versus net revenue", lead:"Transaction value is not the money a payment platform keeps.",
    paragraphs:[
      "Payment volume shows use of the rail. Net revenue depends on the fee actually earned after partner shares, incentives, losses and service cost.",
      "A growth plan should separate bank, merchant and platform segments. Each has different implementation work, risk and settlement responsibilities. A blended volume forecast hides those differences.",
      "Run a segment-level fee waterfall before adding new countries or partners. Automated reconciliation can shorten the review, but regulated fund movement needs approved controls."
    ], related:"embedded-finance-growth-model"},
  { slug:"warehouse-capacity-as-a-3pl-business", title:"When warehouse capacity can become a 3PL business", lead:"Spare space is only a business when external orders cover their full service cost.",
    paragraphs:[
      "A retailer may have spare space because inventory turns are poor. Selling that space as fulfilment capacity can help, but only after the underlying stock problem is understood.",
      "Price pick, pack, storage, delivery, claims and client support. Test demand from an anchor customer and service levels before treating already-paid rent as free capacity.",
      "The decision is a contribution and cash decision, not a property-utilisation slogan. Forecasting and route tools help once the service promise is real."
    ], related:"warehouse-working-capital-transformation"}
];

const articlePath = item => `/insights/${item.slug}`;
const articleCard = item => card(articlePath(item), "Insight", item.title, item.lead);
const articlePage = item => ({
  path: articlePath(item), type: "Article", kind: "article", h1: item.title,
  title: `${item.title} | Haris Aslam`,
  description: `${item.lead} A practical note on GCC business economics.`,
  eyebrow: "Insight", intro: item.lead, datePublished: "2026-09-15",
  body: `<article class="article-copy">${item.paragraphs.map(para).join("")}</article>
    ${section("Related work", grid([caseCard(cases.find(c => c.slug === item.related))]))}
    ${section("More insights", grid(insights.filter(other => other.slug !== item.slug).slice(0,3).map(articleCard)))}`
});

const home = {
  path: "/", type: "ProfilePage", kind: "home", title: "Muhammad Haris Aslam | GCC Operator and Builder",
  description: "Muhammad Haris Aslam is a GCC operator, business builder and transformation leader across digital commerce, retail, marketplaces, enterprise technology and AI.",
  eyebrow: "Muhammad Haris Aslam", h1: "Build businesses. Fix economics. Scale what works.",
  intro: "GCC operator, business builder and transformation leader across commerce, retail, marketplaces, enterprise technology and AI.",
  heroAside: `<figure class="hero-portrait"><img src="/assets/haris-aslam.webp" alt="Portrait of Muhammad Haris Aslam" width="717" height="960"><figcaption>Muhammad Haris Aslam</figcaption></figure>`,
  body: `${section("Selected operating record", `<div class="record-grid"><p>Built and operated multi-category digital commerce in Oman.</p><p>Developed an agent-led merchant commerce platform with live apps and operational handover.</p><p>Worked on retail cash, margin, stock and store operating decisions.</p></div>`)}
    ${section("Areas of work", `<div class="area-grid"><span>Commerce & marketplaces</span><span>Retail transformation</span><span>Enterprise technology</span><span>Payments & finance</span><span>GCC growth</span><span>AI in operations</span></div>`)}
    ${section("Selected business problems", grid([cases[0],cases[1],cases[2],cases[6]].map(caseCard)) + link("/work", "View selected work"))}
    ${section("AI & Transformation", `<div class="feature-row"><div><p>Applied AI belongs inside an operating workflow: accurate data, defined decisions and human accountability.</p>${link("/ai-transformation", "Explore AI & Transformation")}</div><div class="mini-flow"><span>Signal</span><span>Approved action</span><span>Business result</span></div></div>`)}
    ${section("Insights", grid(insights.slice(0,3).map(articleCard)) + link("/insights", "Read all insights"))}
    ${section("About", `<p class="section-intro">Haris works across the commercial and operating decisions that turn a business idea into a dependable business.</p>${link("/about", "More about Haris")}`)}
    ${section("Contact", `<p class="section-intro">For a discussion about a business problem, partnership or operating model.</p>${link("/contact", "Get in touch", "button")}`, "contact-section")}`
};

const work = {
  path: "/work", type: "CollectionPage", kind: "work", title: "Selected Work | Commerce and Retail | Haris Aslam",
  description: "Selected anonymized business use cases across digital commerce, retail transformation, marketplaces, enterprise technology, payments, logistics and Saudi market entry.",
  eyebrow: "Work", h1: "Selected work", intro: "Operating cases and strategy blueprints from commerce, retail, enterprise technology and GCC growth.",
  body: `${section("Operating cases", grid(cases.filter(c => c.type !== "Strategy blueprint").map(caseCard)))}
    ${section("Strategy blueprints", `<p class="section-intro">These are designed models or proposals. Their business impact is modeled, not claimed as achieved.</p>${grid(cases.filter(c => c.type === "Strategy blueprint").map(caseCard))}`)}
    ${section("Applied AI projects", grid([card("/ai-commerce","In development","AI Commerce Command Center","Coordinated AI for commerce operations under human approval."),card("/career-runway","Live","Career Runway AI","Career decisions grounded in personal financial runway.")]))}`
};

const ai = {
  path: "/ai-transformation", type: "CollectionPage", kind: "ai", title: "AI & Transformation | Haris Aslam",
  description: "Applied AI projects and transformation work by Muhammad Haris Aslam, focused on commerce operations, trustworthy data, approved automation and measurable economics.",
  eyebrow: "AI & Transformation", h1: "AI that fits the business", intro: "Useful automation starts with a real operating problem and a clear owner for the decision.",
  body: `${section("AI Lab", grid([card("/ai-commerce","In development","AI Commerce Command Center","Coordinates catalogue, orders, care and other commerce signals under human approval."),card("/career-runway","Live","Career Runway AI","Grounds career decisions in personal financial runway and practical trade-offs.")]) + link("/ai-lab","View AI Lab"))}
    ${section("Transformation work", grid([cases[2],cases[4],cases[6]].map(caseCard)))}
    ${section("Decision rights", `<p class="section-intro">Agents can prepare evidence, clean product data and route exceptions. People remain responsible for pricing, payments, customer remedies and capital decisions.</p>`)}`
};

const aiLab = {
  path: "/ai-lab", type: "CollectionPage", kind: "ai-lab", title: "AI Lab | Applied AI Projects | Haris Aslam",
  description: "AI Lab presents AI Commerce Command Center and Career Runway AI, two applied projects built around commerce operations and grounded personal financial decisions.",
  eyebrow: "AI Lab", h1: "AI Lab", intro: "Applied AI projects built around real operating problems.",
  body: `${section("Projects", grid([card("/ai-commerce","In development","AI Commerce Command Center","A commerce control layer for catalogue, orders, care, sellers, inventory, pricing and finance."),card("/career-runway","Live","Career Runway AI","A decision tool that combines career assessment with a person's real financial runway.")]))}`
};

const project = (path, name, status, description, problem, solution, technology, commercial, operating, impactText) => ({
  path, type:"WebPage", kind:"project", title:`${name} | AI Lab | Haris Aslam`, h1:name,
  description,
  eyebrow:`AI Lab · ${status}`, intro:description,
  project:{name, status, description},
  body:`<div class="case-meta"><span>Applied AI project</span><span>${status}</span></div><div class="case-layout"><div class="case-fields">
    ${[["Business Problem",problem],["Solution",solution],["Technology",technology],["Commercial Model",commercial],["Operating Model",operating]].map(([label,value])=>`<section class="case-field"><h2>${label}</h2>${para(value)}</section>`).join("")}
    <div class="impact-note"><h2>${status === "In development" ? "Modeled Business Impact" : "Business Impact"}</h2>${para(impactText)}</div>
    ${link("/ai-lab","Back to AI Lab")}</div></div>`
});

const aiCommerce = project("/ai-commerce","AI Commerce Command Center","In development",
  "A full commerce operation, from catalogue and orders to care, sellers, inventory, pricing and finance, coordinated by AI agents with human approval.",
  "Commerce teams work across disconnected systems and queues; decisions arrive late or without the full operating context.",
  "Coordinate those signals in one operator view. Agents can prepare catalogue fixes, care responses and exception summaries, while people approve material actions.",
  "Live commerce APIs, event feeds, a governed data layer and permissioned AI tools. Policy can be retrieved from approved knowledge; stock, price and orders come from source systems.",
  "The business case measures contribution, service cost and operator time against an agreed baseline.",
  "Commercial, fulfilment, care and finance owners retain their decision rights. Each AI recommendation has an audit trail.",
  "The project is in development. Its impact on contribution, service cost and operator time remains to be tested.");

const careerRunway = project("/career-runway","Career Runway AI","Live",
  "Helps professionals read their Career DNA and real financial runway, grounded in their own numbers, before making a major career move.",
  "Major career decisions are often made without a clear picture of personal financial safety and practical trade-offs.",
  "Combine a structured career assessment with deterministic financial-runway rules. AI can explain scenarios but does not change the underlying calculation.",
  "A consented personal-data model, financial inputs, rule engine and LLM narrative layer. Sensitive inputs need strict access and deletion controls.",
  "A personal decision-support product, measured by clarity of its scenarios rather than an assumed employment outcome.",
  "The user owns the decision. The product presents assumptions and trade-offs rather than recommending an employer or role.",
  "The product is live. No user-growth, revenue or decision-outcome figure is presented.");

const insightsPage = {
  path:"/insights", type:"CollectionPage", kind:"insights", title:"Insights on Commerce and Economics | Haris Aslam",
  description:"Eight practical insights from Muhammad Haris Aslam on marketplaces, retail cash, agent-led commerce, AI workflows, payments and warehouse operating economics.",
  eyebrow:"Insights", h1:"Operating notes", intro:"Short reads on the decisions that determine whether a model works.",
  body:section("Latest insights",grid(insights.map(articleCard)))
};
const about = {
  path:"/about", type:"ProfilePage", kind:"about", title:"About Muhammad Haris Aslam | GCC Operator",
  description:"Muhammad Haris Aslam is a GCC operator and business builder with work across digital commerce, retail transformation, marketplaces, enterprise technology and applied AI.",
  eyebrow:"About", h1:"Muhammad Haris Aslam", intro:"Operator, business builder and transformation leader.",
  heroAside:`<figure class="hero-portrait"><img src="/assets/haris-aslam.webp" alt="Portrait of Muhammad Haris Aslam" width="717" height="960"></figure>`,
  body:`${section("Operating background",`<div class="about-copy"><p>Haris has worked on the commercial and operating sides of digital commerce, retail, marketplaces and technology in the GCC. The record includes building online commerce propositions, running merchant and agent operations, and working through retail margin and cash decisions.</p><p>His work connects the customer proposition to the economics underneath it: where revenue comes from, what the business must deliver, and how technology can help people make better decisions.</p></div>`)}
    ${section("What I work on",`<div class="area-grid"><span>Business building</span><span>Retail economics</span><span>Marketplace operations</span><span>Enterprise delivery</span><span>GCC growth</span><span>Applied AI</span></div>`)}
    ${section("Selected work",grid([cases[0],cases[1],cases[2]].map(caseCard)))}`
};
const contact = {
  path:"/contact", type:"ContactPage", kind:"contact", title:"Contact Muhammad Haris Aslam | GCC Business",
  description:"Contact Muhammad Haris Aslam to discuss business building, retail economics, marketplace operations, technology implementation, GCC growth or applied AI.",
  eyebrow:"Contact", h1:"Get in touch", intro:"A good conversation starts with the business problem.",
  body:`${section("Contact",`<div class="contact-grid"><div><span>Email</span><a href="mailto:${site.email}">${site.email}</a></div><div><span>LinkedIn</span><a href="${site.linkedin}" rel="me noopener">Connect with Haris <span aria-hidden="true">↗</span></a></div></div><p class="contact-note">A short note on the problem, market and decision is enough to begin.</p>`)}`
};

export const pages = [home,work,...cases.map(casePage),ai,aiLab,aiCommerce,careerRunway,insightsPage,...insights.map(articlePage),about,contact];
