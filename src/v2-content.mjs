export const site = {
  name: "Muhammad Haris Aslam",
  shortName: "Haris Aslam",
  origin: "https://www.mharisaslam.com",
  email: "haris@mharisaslam.com",
  linkedin: "https://www.linkedin.com/in/harisaslam/"
};

export const navigation = [
  ["Home", "/"], ["Work", "/work"], ["AI & Transformation", "/ai-transformation"],
  ["Ventures", "/ventures"], ["Insights", "/insights"], ["About", "/about"], ["Contact", "/contact"]
];

export const hubs = [
  { name: "Commerce & Marketplaces", path: "/work/commerce-marketplaces", lead: "The proposition, supply engine and order economics have to work as one system.", question: "When does online retail become a functioning marketplace?", model: "Demand → assortment → fulfilment → contribution", cases: ["oman-commerce", "agent-social"] },
  { name: "Retail Transformation & Turnaround", path: "/work/retail-transformation-turnaround", lead: "Repair cash, margin, stock and decision cadence before treating expansion as a cure.", question: "Where does growth stop becoming cash?", model: "Store/SKU margin → stock age → cash release", cases: ["family-retail", "clearance", "retail-sprint"] },
  { name: "AI & Automation", path: "/work/ai-automation", lead: "Move from disconnected use cases to bounded workflow decisions over authoritative data.", question: "Which actions can an agent take safely?", model: "Signal → evidence → policy → approval → action → audit", cases: ["ai-command"] },
  { name: "Fintech, Payments & Loyalty", path: "/work/fintech-payments-loyalty", lead: "Payment volume is useful only when net revenue, loss and regulated capacity hold together.", question: "What survives the fee and risk waterfall?", model: "Volume → fees → partners → losses → net revenue", cases: ["payments"] },
  { name: "Enterprise Digital Transformation", path: "/work/enterprise-digital-transformation", lead: "Turn enterprise requirements into a governed delivery and support system.", question: "How does a studio repeat quality without repeating work?", model: "Scope → build → test → release → support", cases: ["app-studio"] },
  { name: "Growth & Market Entry", path: "/work/growth-market-entry", lead: "A regional ambition earns its place when local channel economics survive landed cost.", question: "What must be true before entering the next market?", model: "Rights → landed cost → channel → contribution", cases: ["saudi-entry"] },
  { name: "Logistics & Operations", path: "/work/logistics-operations", lead: "Treat capacity, service and working capital as one commercial equation.", question: "When is spare warehouse space a viable service business?", model: "Capacity → anchor demand → service cost → cash", cases: ["warehouse"] },
  { name: "Venture Building", path: "/work/venture-building", lead: "Separate a venture thesis from evidence that customers, partners and economics already work.", question: "Which hypothesis needs to be proven first?", model: "Problem → proposition → pilot → contribution → scale", cases: ["agent-social", "app-studio", "saudi-entry"] }
];

const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const link = (href, label, cls = "text-link") => `<a class="${cls}" href="${href}">${esc(label)} <span aria-hidden="true">↗</span></a>`;
const section = (eyebrow, title, content, cls = "") => `<section class="section ${cls}"><div class="section-head"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div>${content}</section>`;
const prose = text => `<div class="prose">${text.split("\n").filter(Boolean).map(p => `<p>${p}</p>`).join("")}</div>`;
const card = (href, overline, title, text, extra = "") => `<a class="editorial-card" href="${href}"><span class="card-overline">${overline}</span><h3>${title}</h3><p>${text}</p>${extra}<span class="card-arrow" aria-hidden="true">↗</span></a>`;
const cards = items => `<div class="editorial-grid">${items.join("")}</div>`;
const equation = (label, parts) => `<figure class="equation" role="group" aria-label="${esc(label)}"><figcaption>${esc(label)}</figcaption><div>${parts.map(([title, note]) => `<span><strong>${title}</strong><small>${note}</small></span>`).join('<b aria-hidden="true">→</b>')}</div></figure>`;
const cta = (question, text = "Start with the business problem, the market and the decision you need to make.") => `<section class="section problem-cta"><div><p class="eyebrow">A practical conversation</p><h2>${question}</h2><p>${text}</p></div>${link("/contact", "Share the operating question", "button")}</section>`;

const casePath = {
  "oman-commerce": "/work/cases/oman-multi-category-commerce-platform",
  "agent-social": "/work/cases/agent-led-social-commerce-platform",
  "family-retail": "/work/cases/family-retail-group-transformation",
  "clearance": "/work/cases/retail-clearance-pilot",
  "ai-command": "/ai-commerce",
  "app-studio": "/work/cases/app-studio-operating-model",
  "retail-sprint": "/work/cases/90-day-retail-performance-sprint",
  "payments": "/work/blueprints/multi-party-payments-growth-blueprint",
  "saudi-entry": "/work/cases/saudi-distribution-and-e-commerce-entry",
  "warehouse": "/work/cases/warehouse-and-working-capital-reset"
};

const cases = [
  {
    id: "oman-commerce", name: "Oman multi-category commerce platform", period: "2014–2018", geography: "Oman", sector: "Digital retail and marketplace strategy", tier: "Flagship", type: "Case Study",
    summary: "A broad-category online retailer was built and operated in Oman. The historical evidence supports first-party commerce; a later third-party seller model appears in planning materials, not as a verified live marketplace launch.",
    problem: "Customers faced fragmented online assortment and fulfilment. A multi-category proposition had to win trust across browsing, ordering and delivery while managing the inventory risk of first-party retail.",
    diagnosis: "Assortment breadth was an acquisition advantage only if stock accuracy, cancellation control and order contribution kept pace. The proposed seller expansion would have changed the economics: merchant liquidity and take rate are not the same as retail gross margin.",
    work: "Founded and operated a broad-category online commerce business. Built the proposition, catalogue, trading and fulfilment practices; reviewed order, registration and cancellation signals. A later third-party marketplace expansion was modeled, but its launch timing is not validated.",
    then: "Online retail CMS, product catalogue and order/customer analytics; centrally managed merchandising, inventory and fulfilment. Supplier and seller development in later plans should not be confused with proved third-party trading.",
    economics: "For first-party orders, evaluate selling price less product cost, delivery, returns, payment fees and acquisition. For proposed third-party orders, test take rate less seller onboarding, service, fulfilment and dispute cost. Mixing the two obscures contribution.",
    result: "Actual Result: the operating records show a functioning online retailer with orders, registrations and cancellations. Restricted revenue figures are not publication-cleared, so no growth or share number appears here.",
    forecast: "Business Case: subsequent financial models projected growth and third-party seller expansion. These are plans, not achieved marketplace volume.",
    rebuild: "I would rebuild the commerce loop around authoritative first-party stock and only verified seller offers, then connect conversational discovery to fulfilment and margin-aware trading. The first release would improve catalogue quality and exception handling before making any autonomous price decision.",
    ai: "Catalogue agents normalize attributes and flag missing evidence; demand models identify stock risk; care copilots retrieve live order status; seller matching and recommendations are constrained by product availability and contribution floors.",
    architecture: "API-first product, inventory, order and payment services; event stream for changes; an agent orchestration layer with tool permissions; human review queue and immutable action log. Policy knowledge can be retrieved, but live prices and stock must come from source APIs.",
    data: "SKU master, stock by location, cost and price, order events, cancellations, returns, fulfilment cost, seller identity and consented customer signals. Each metric needs an owner and freshness rule.",
    decisions: "Agents may enrich descriptions and prepare exception summaries. Merchandising approves prices and seller admission; operations resolves fulfilment exceptions; finance approves refunds, margin floors and payout rules.",
    operating: "Category owners run weekly contribution and availability reviews. Seller operations, care and fulfilment share one exception queue rather than maintaining separate reports. Automation frees operator time only when false positives and service quality are measured.",
    kpis: "Net completed orders, first-party contribution per order, proposed third-party contribution per order, cancellation rate, stock accuracy, seller activation and cash conversion cycle.",
    roadmap: ["Audit order and stock data; reconcile cancellations; define first-party baseline and price floors.", "Pilot catalogue and care copilots in a narrow category, with human approval and control orders.", "Add verified seller workflows only if onboarding quality, order contribution and service levels hold."],
    risks: "Do not represent a planned seller model as a historical live marketplace. Guard against stale stock, hallucinated product attributes, margin-destroying recommendations and uncontrolled seller admission.",
    lessons: ["First-party retail is not proof of third-party marketplace liquidity.", "Cancellation belongs in every net-order measure.", "Assortment is valuable only when delivery can keep the promise.", "Price automation needs contribution floors.", "A forecast should remain a forecast."],
    related: ["agent-social", "saudi-entry"], articleKeys: ["marketplace-moment", "gmv-contribution", "seller-onboarding"], visual: "1P retail to proposed 3P expansion, with a distinct 2026 signal-to-action loop"
  },
  {
    id: "agent-social", name: "Agent-led social-commerce platform", period: "2020–2021", geography: "Oman", sector: "Social commerce and marketplace", tier: "Flagship", type: "Case Study",
    summary: "Merchant and agent apps, onboarding operations and campaigns were brought into live operation. The commercial question was whether active merchant–agent pairs could produce attributable, repeatable transactions—not how many people downloaded the apps.",
    problem: "Small merchants lacked an efficient digital distribution route; independent sales agents lacked a structured way to discover offers, represent merchants and be paid reliably.",
    diagnosis: "A three-sided platform needs merchant quality, agent trust and buyer fulfilment at the same time. Registrations and downloads are useful funnel signals but not evidence of marketplace liquidity.",
    work: "Worked on live merchant and agent applications, onboarding, campaign management, CMS, analytics trackers and handover. Dated records document sign-ups and operational activity; the commercial metrics require reconciliation before publication.",
    then: "Mobile applications and CMS backed merchant listings and agent activity. Teams managed verification, campaigns, attribution and exceptions manually using funnel trackers.",
    economics: "The platform must earn a take rate that covers merchant support, agent commission, buyer acquisition, payment, delivery and dispute handling. Agent payout timing is part of the product proposition, not only an accounting task.",
    result: "Actual Result: live applications and merchant/agent onboarding are documented. No reconciled public claim of active transacting pairs, GMV, profit or expansion is made.",
    forecast: "Target Outcome: investor materials modeled expansion into Saudi Arabia and other GCC markets. That scale was proposed, not evidenced as achieved.",
    rebuild: "I would verify merchants and agents before opening the selling loop, use conversational catalogues to make offers easier to explain, and make every attributed order and payout auditable to all parties.",
    ai: "Merchant catalogue preparation, agent–merchant matching and campaign drafting can be assisted. Fraud signals and care summaries can be generated, but they cannot independently sanction users or move money.",
    architecture: "Identity and merchant-verification services, product/order APIs, event-based attribution ledger, payment and payout orchestration, governed AI workflow layer and human dispute console.",
    data: "Merchant identity, approved products, agent entitlement, campaign/attribution events, buyer order and delivery status, refunds, commission schedules and payout ledger. Consent and retention rules are required for agent and buyer data.",
    decisions: "Platform operators approve merchant admission, agent commission changes, sanctions, disputes and payouts. AI can recommend catalog improvements and flag anomalies; money and trust decisions remain human-controlled.",
    operating: "Merchant success and agent success are paired around trade-ready offers. Finance reconciles each sale before payout; care resolves delivery and attribution disputes through a shared case record.",
    kpis: "Active merchant–agent pairs, attributable completed orders, contribution after commission, payout accuracy, repeat purchase, dispute rate and time to first trade-ready listing.",
    roadmap: ["Reconcile historical funnels and define active-pair and completed-order measures.", "Pilot verified catalog creation and transparent attribution on a limited merchant cohort.", "Expand categories or markets only after local liquidity, payout accuracy and order contribution pass gates."],
    risks: "Fake listings, weak identity checks, commission disputes, unattributed sales and premature geographic expansion can destroy trust faster than acquisition can rebuild it.",
    lessons: ["Downloads do not equal demand.", "Registered merchants do not equal active supply.", "Attribution is a trust mechanism.", "Payouts need an auditable ledger.", "Local liquidity should precede regional scale."],
    related: ["oman-commerce", "payments"], articleKeys: ["agent-economics", "seller-onboarding", "gmv-contribution"], visual: "Merchant → agent → buyer → settlement swimlane"
  },
  {
    id: "family-retail", name: "Family retail-group transformation", period: "2023–2025; mandate dates subject to validation", geography: "Oman", sector: "Household and lifestyle retail", tier: "Flagship", type: "Case Study",
    summary: "Board-mandated commercial and operating work addressed category economics, procurement, inventory, cost and a future regional venture model. The mandate is evidenced; a quantified group-level turnaround result is not.",
    problem: "Cost and inventory pressure weakened the relationship between growth, cash and profit. Store, digital and distribution opportunities were being considered within one group.",
    diagnosis: "A credible turnaround requires channel P&Ls and a stock-to-cash bridge before a new venture is allowed to dominate the narrative. Board sponsorship must translate into weekly ownership of categories and actions.",
    work: "Led board-mandated work across commercial and operating diagnostics, store/category analyses, procurement and regional venture design. The records show management artefacts, not an audited before-and-after group uplift.",
    then: "MIS, P&L and inventory worksheets, e-commerce and ERP evaluation, plus a management review cadence. Key data and decisions were assembled manually.",
    economics: "Separate retail, wholesale, online and proposed venture P&Ls. Trace price and supplier terms through gross profit, stock age, working capital, overhead and EBITDA rather than relying on top-line growth.",
    result: "Actual Result: the mandate, analyses and operating work are evidenced. A total group profit recovery or cash-release figure has not been reconciled for public use.",
    forecast: "Business Case: regional distribution and GCC expansion scenarios were modeled. They are distinct from what the core retail operation achieved.",
    rebuild: "I would create a margin-to-cash cockpit across store, online, warehouse and distribution activity, with an intervention log that shows whether each approved action released cash or improved contribution.",
    ai: "Leakage detection, SKU demand forecasts, supplier negotiation drafts and inventory-age alerts. AI proposes patterns and scenarios; it does not approve restructuring, supplier terms or capital.",
    architecture: "ERP/POS/WMS feeds into a governed metric layer; event-driven intervention workflow; category dashboard, finance approval queue and audit trail. AI uses governed policy documents and live financial APIs separately.",
    data: "SKU/store/channel P&L, stock age, supplier rebates and terms, sales/promotions, labour, warehouse cost and cash. Baselines must be reconciled with finance before value claims.",
    decisions: "Board and accountable management own strategy and capital; finance controls the baseline and cash bridge; category managers approve trading actions; agents rank anomalies and prepare evidence.",
    operating: "One weekly trading review connects finance, category, procurement and operations. The venture thesis has its own gated plan and does not mask core-store performance.",
    kpis: "Gross profit after markdown, EBITDA bridge, stock turns, working-capital days, store/category contribution, approved-action completion and realized value versus plan.",
    roadmap: ["Reconcile finance and stock baselines; separate channel P&Ls and decision rights.", "Run controlled category/store interventions; introduce anomaly alerts and owner tracking.", "Scale only interventions with measured cash and contribution results; gate venture investment independently."],
    risks: "Attribution of results across stores and periods, incomplete stock data, supplier sensitivities and family governance require careful controls.",
    lessons: ["A board mandate is not a turnaround result.", "Cash and stock tie the P&L together.", "Each channel needs its own margin.", "Supplier changes need governance.", "Venture upside should not hide core repair."],
    related: ["retail-sprint", "clearance", "warehouse"], articleKeys: ["margin-cash", "clearance-margin", "warehouse-3pl"], visual: "Board operating cockpit connecting margin, stock and cash"
  },
  {
    id: "clearance", name: "Retail clearance pilot", period: "Late 2023–early 2024", geography: "Oman", sector: "Retail", tier: "Flagship", type: "Case Study",
    summary: "A temporary clearance format was tested against monthly store P&Ls. Margin rate improved in the recorded pilot, but EBITDA fluctuated and ended negative in the last observed month; the pilot cannot be described as a proven turnaround.",
    problem: "Excess stock trapped cash while store profitability was weak. Markdown decisions had to release inventory without making the full P&L worse.",
    diagnosis: "Gross-margin percentage can rise even when revenue and gross-profit currency fall. A clearance format should be judged by net cash released, contribution and full store overhead—not a single percentage.",
    work: "Tested a temporary clearance format and reviewed monthly store sales, margin and EBITDA worksheets. Later months in planning files are not actual results.",
    then: "Manual SKU selection, markdown and assortment decisions; store P&L worksheets were used to review the pilot monthly.",
    economics: "Compare realized gross profit and cash released against inventory carrying cost, selling expense and store overhead. Analyze markdown at SKU and basket level before treating a better margin percentage as success.",
    result: "Actual Result: the recorded gross-margin rate improved during the pilot, while EBITDA moved unevenly and was negative in the final recorded month. The underlying numerical series is withheld pending publication clearance.",
    forecast: "Target Outcome: later P&L periods were projections. They are not incorporated into the actual pilot trajectory.",
    rebuild: "I would rank aged stock by expected cash recovery and contribution, simulate markdown bands, run approved offers through POS and compare observed sell-through to control items.",
    ai: "SKU sell-through forecasts and markdown scenario generation; computer-vision shelf checks only where store evidence justifies the cost. Recommendations are constrained by price and cash floors.",
    architecture: "POS, inventory-age and cost APIs feed a scenario service; approval workflow publishes offers; an outcome ledger records sales, margin, returns and cash release.",
    data: "SKU cost and ageing, current price, markdown history, store availability, overhead allocation, sell-through and return events. Finance signs off the pilot baseline.",
    decisions: "Category and finance approve markdowns and write-offs. AI may prioritize candidates and explain trade-offs, but cannot change live prices without approval.",
    operating: "Weekly category/finance review selects the limited test set. Store teams execute approved prices and capture customer and operational exceptions before the next intervention.",
    kpis: "Cash released per SKU, net gross-profit currency, contribution after selling cost, EBITDA by observed month, stock turns and return rate.",
    roadmap: ["Reconcile the observed pilot P&L and stock-age data; exclude projected periods.", "Run guarded SKU-level markdown trials with control items and explicit cash/margin thresholds.", "Expand only the price rules that improve realized cash and contribution, not merely margin percentage."],
    risks: "Small pilot windows, changing category mix and overhead allocation make causal claims difficult. Dynamic pricing must not create confusing or unfair customer treatment.",
    lessons: ["Margin rate can improve while sales fall.", "EBITDA must be shown for every observed period.", "A pilot is not a group result.", "Markdown needs SKU contribution.", "AI recommendations require finance guardrails."],
    related: ["family-retail", "retail-sprint"], articleKeys: ["clearance-margin", "margin-cash"], visual: "Observed pilot timeline: sales, margin rate and EBITDA direction"
  },
  {
    id: "ai-command", name: "AI Commerce Command Center", period: "2026; in development", geography: "GCC and wider commerce markets", sector: "Applied AI in commerce", tier: "Flagship", type: "Project / 2026 AI Rebuild",
    summary: "An in-development AI Lab project exploring how a lean commerce team could coordinate catalog, orders, care, sellers, inventory, pricing and finance through bounded agents under human approval.",
    problem: "Commerce operating signals sit across disconnected tools and teams. Manual reporting delays decisions; unbounded AI action would introduce a different kind of risk.",
    diagnosis: "The product must make exceptions visible and actions auditable. A dashboard alone does not change the operating model; an autonomous agent without permission boundaries can damage margin, trust or finances.",
    work: "The verified historical record is a public in-development project description and UI storyboard. There are no published users, commercial outcomes or production deployments to claim.",
    then: "Concept screens and a proposition for coordinated agents with human approval. The project was not a historically implemented 2026 operating system.",
    economics: "Potential value is measured against operator hours, error rates, cost-to-serve and contribution. Any platform or usage fee would be a commercial hypothesis until willingness to pay is validated.",
    result: "Actual Result: the project exists and is described as in development. No measured saving, sales effect or user adoption is asserted.",
    forecast: "Concept Case: the coordinated-agent capabilities are product design intentions, not delivered results.",
    rebuild: "The 2026 build would connect authoritative commerce APIs to an event-driven agent layer. Agents would propose or execute only policy-scoped low-risk tasks, while consequential commercial and money decisions receive human approval.",
    ai: "Catalog hygiene, care resolution drafts, stock exceptions, seller checks, pricing scenarios and finance reconciliation summaries. RAG retrieves governed SOPs; tools query live operational facts.",
    architecture: "Operational source APIs → event bus and metric layer → policy/retrieval service → tool-scoped workflow agents → approval queue → API action → immutable audit and evaluation.",
    data: "Live catalog, stock, order, payment and finance events with identity, timestamps and source ownership; versioned SOPs and policies; evaluation sets for errors and unsafe actions.",
    decisions: "Agents can close low-risk tickets within policy. People approve prices, seller admission, refunds, payouts and finance actions; security owns permissions and rollback.",
    operating: "One exception queue joins merchandising, care, operations and finance. Every agent action has an evidence trail, owner, escalation condition and measurable outcome.",
    kpis: "Safe task completion, exception rate, operator time per resolved issue, contribution effect, inference/tool cost, approval latency and rollback rate.",
    roadmap: ["Map decision rights and source-system truth; prototype read-only evidence retrieval.", "Pilot bounded catalog and care workflows with human approvals and adversarial evaluations.", "Connect selected APIs for reversible low-risk actions; expand only after error and value gates pass."],
    risks: "Stale data, prompt injection, over-broad tool scopes and hidden agent errors. No autonomous price, refund or payout action without explicit governance.",
    lessons: ["A cockpit cannot run a business by itself.", "Live facts belong in source APIs.", "RAG is for governed knowledge.", "Every consequential action needs a boundary.", "Evaluate errors before scaling permissions."],
    related: ["oman-commerce", "agent-social"], articleKeys: ["safe-agents", "rag-apis", "fundable-ai"], visual: "Signal → evidence → policy → human decision → action → audit"
  },
  {
    id: "app-studio", name: "App-studio operating model", period: "2019–2021", geography: "Oman", sector: "Enterprise technology", tier: "Flagship", type: "Case Study",
    summary: "A lean app studio qualified demand, delivered contracted builds and managed requirements, testing and handover. The records support an operating model and customers; public project profitability and client impact are not validated.",
    problem: "Custom mobile and web work needed a repeatable delivery system that could control scope, partner capacity, quality and post-release support.",
    diagnosis: "A studio wins or loses economics in scoping, rework, utilization and handover. A pitch is not a contracted build; reuse is valuable only when modules are governed and maintained.",
    work: "Worked on launch, sales qualification, signed scopes, requirements, tests, contracted builds and handovers. Operating reports and customer artefacts exist, while client-specific outcomes remain confidential.",
    then: "Mobile/web development with manual CRM and project plans, partner and white-label delivery, requirements documents and testing/handover procedures.",
    economics: "Price fixed-scope work against delivery hours, partner cost, rework and acceptance risk. Managed support and reusable modules can create recurring margin, but only if support burden and product maintenance are included.",
    result: "Actual Result: contracted builds, delivery artefacts and customer work are evidenced. No public studio profit, utilization or client ROI number is claimed.",
    forecast: "Business Case: studio-scale and financial scenarios were projected; they do not constitute achieved expansion or profit.",
    rebuild: "I would turn the evidence chain from lead to support into an AI-assisted delivery factory, using governed agents for requirements, test generation and defect triage without allowing them to bypass architecture, security or acceptance gates.",
    ai: "Proposal copilot grounded in prior approved scopes; requirement extraction; SOW-to-test traceability; defect triage and support knowledge retrieval. Code agents work within approved repositories and review gates.",
    architecture: "CRM and document repository → approved scope/backlog → version control/CI → test and security gates → release telemetry → support knowledge base, with role-scoped AI assistants at each stage.",
    data: "Versioned SOWs, requirements, estimates, commits, test results, defects, acceptance records, support tickets and actual delivery hours. Client data needs isolation and contractual controls.",
    decisions: "Product leads approve scope and architecture; engineers review code; security approves release; clients accept delivery. AI drafts and checks, not signs contracts or releases.",
    operating: "A delivery lead owns the evidence chain; reusable modules have maintainers; post-release support is priced and measured rather than treated as free residual work.",
    kpis: "Gross margin per project, utilization, estimate variance, cycle time, defect escape rate, support cost and module reuse after maintenance cost.",
    roadmap: ["Inventory approved project artefacts and reconcile estimate versus actual time.", "Pilot requirement extraction and test traceability on a low-risk scope.", "Add guarded code/support agents and reusable modules with security, acceptance and margin gates."],
    risks: "Client confidentiality, unlicensed reuse, hallucinated requirements and insecure generated code. Human sign-off and evidence provenance must survive automation.",
    lessons: ["Signed scope is stronger evidence than a pitch.", "Reuse needs governance.", "AI tests do not replace client acceptance.", "Actual versus budget must be separated.", "Handover is part of the product."],
    related: ["ai-command", "agent-social"], articleKeys: ["fundable-ai", "rag-apis"], visual: "Requirements-to-release evidence chain"
  },
  {
    id: "retail-sprint", name: "90-day retail-performance sprint", period: "Operating artefacts from 2023–2024; sprint framing in 2026", geography: "Oman", sector: "Retail performance and turnaround", tier: "Flagship", type: "Case Study + 2026 AI Rebuild",
    summary: "Store/category actions, weekly reports and pilots show real operating work. The formal 90-day sprint is a modern packaging of that method, not a historically sold product or a proven group-level uplift.",
    problem: "Revenue, margin, stock and cash leakage require fast intervention, but disconnected reports make it difficult to assign ownership or see whether an action realized value.",
    diagnosis: "A sprint begins with an audited baseline and a margin-to-cash bridge. Each action needs a decision owner, a control comparison and a realized-value check.",
    work: "Historical artefacts document store/category actions, weekly management reporting and pilots. The full-group result remains unreconciled; the 90-day format describes how I would organize similar work now.",
    then: "MIS, inventory and P&L worksheets plus management cadence; analyses and action follow-up were assembled manually.",
    economics: "Prioritize changes by cash release and contribution after markdown, labour, supplier and fulfilment cost. An intervention should have an expected value, spend, owner and measurement method.",
    result: "Actual Result: operating analyses and pilots are evidenced. No overall 90-day EBITDA or group cash improvement is asserted.",
    forecast: "Modeled Impact: sprint and value scenarios require a fresh audited baseline and controlled trials before any improvement is claimed.",
    rebuild: "I would use an AI diagnostic cockpit to cluster leakage, then put approved interventions into an owner workflow. Finance would validate realized cash and EBITDA against comparable stores or periods.",
    ai: "Store/SKU anomaly detection, stock-age forecasts, action prioritization and policy retrieval. Agents prepare evidence and proposed actions; commercial teams decide and execute.",
    architecture: "ERP/POS/WMS and finance APIs → reconciled metrics → anomaly models → action register → approval workflow → outcomes ledger and dashboard.",
    data: "Baseline P&L, stock age, price/promo, supplier terms, labour, cash and comparable stores. Every source needs reconciliation and a definition of intervention exposure.",
    decisions: "Executive and finance owners approve material cash, pricing, supplier and staffing moves. Store and category leads own execution; AI ranks signals and monitors drift.",
    operating: "Daily exception triage, weekly trading decisions and monthly realized-value reviews. An intervention without an owner or measure does not enter the sprint.",
    kpis: "Cash released, EBITDA bridge, stock turns, category/store contribution, intervention completion and realized ROI after implementation cost.",
    roadmap: ["Reconcile baseline and assign owners; select cash/margin interventions.", "Pilot action workflow and AI-supported leakage analysis with control comparisons.", "Scale validated actions; close or redesign interventions that do not produce realized value."],
    risks: "A sprint label can overstate historical delivery. Attribution, seasonal demand, supplier effects and unclean data can make modeled impact look achieved when it is not.",
    lessons: ["A sprint is not a turnaround claim.", "Cash is the governor.", "Actions need owners.", "Control comparisons reveal impact.", "AI insight without execution is noise."],
    related: ["family-retail", "clearance", "warehouse"], articleKeys: ["margin-cash", "clearance-margin", "warehouse-3pl"], visual: "0–30 / 30–90 / 90–180 intervention and value-confirmation path"
  },
  {
    id: "payments", name: "Multi-party payments growth blueprint", period: "2026 discussion blueprint; 2027–2029 planning horizon", geography: "Qatar-to-MENAP scenario", sector: "Payments and embedded finance", tier: "Supporting", type: "Strategy Blueprint",
    summary: "An outside-in commercial blueprint examined how a payment platform might scale merchant, bank and cross-border flows. It is a planning case, not evidence of achieved company growth.",
    problem: "Multi-party payment operations require merchant demand, partner rails, settlement, risk and country permissions to scale together.",
    diagnosis: "Total payment volume is not net revenue. Fees, partner sharing, loss, operations and the regulated delivery perimeter decide viability before a growth chart becomes meaningful.",
    work: "Prepared an outside-in discussion blueprint around product segments, treasury, payment orchestration and regional growth. No completed implementation or company growth is evidenced.",
    then: "Commercial planning used API/payment-orchestration and treasury segment assumptions. The scope did not verify live licences, signed clients or partner capacity.",
    economics: "Model net fee income separately by rail, merchant segment and country. Deduct bank/processor share, fraud and dispute loss, settlement cost and compliance overhead. Payment volume remains a demand measure, not earnings.",
    result: "Concept Case: no achieved revenue, payment volume or client expansion is claimed.",
    forecast: "Business Case: a confidential multi-year net-revenue scenario exists, but the values are withheld; it must be revalidated against signed demand, licences and partner economics.",
    rebuild: "I would stage expansion by permitted country and payment rail, create an auditable settlement ledger and use AI to assist routing, onboarding and reconciliation while regulated decisions remain controlled.",
    ai: "Merchant onboarding triage, anomaly alerts, routing performance analysis and reconciliation assistance. Models may rank cases but cannot independently approve KYC/AML, treasury exposure or reversals.",
    architecture: "API gateway and identity → payment orchestration → partner rails → transaction/settlement ledger → reconciliation and risk services → governed analytics and AI assistance.",
    data: "Merchant and partner entitlements, transaction lifecycle, fee schedules, settlement ledger, losses, disputes, treasury exposure, licence perimeter and country approvals.",
    decisions: "Regulated operations decide KYC/AML, sanctions, routing policy, fund safeguarding and reversals. AI supports evidence gathering and anomaly prioritization.",
    operating: "Product and country P&Ls are reviewed with compliance and treasury. Stage gates include signed client demand, partner SLA and permitted activity, not only modeled payment volume.",
    kpis: "Net revenue per active client, payment success, fee yield, loss per transaction, settlement time, dispute rate and compliance cost by country.",
    roadmap: ["Validate licence perimeter and signed demand; rebuild the rail-by-rail net-revenue model.", "Pilot orchestration and reconciliation on one approved rail with human risk review.", "Expand products/countries only as permitted, with measured economics and safeguarding controls."],
    risks: "Regulatory perimeter, sanctions, fund safeguarding, irreversible money movements and assumed partner capacity. This blueprint should not be read as a client delivery claim.",
    lessons: ["Payment volume is not earnings.", "Country permissions gate entry.", "Settlement is an operating model.", "Fraud loss belongs in unit economics.", "A blueprint is not achieved growth."],
    related: ["agent-social", "saudi-entry"], articleKeys: ["payment-volume", "fundable-ai"], visual: "Payment rail to net-revenue waterfall"
  },
  {
    id: "saudi-entry", name: "Saudi distribution and e-commerce entry", period: "2023–2025 planning and mandate", geography: "Oman-to-Saudi Arabia", sector: "Consumer distribution and commerce", tier: "Supporting", type: "Case Study + Strategy Blueprint",
    summary: "A regional distribution mandate and planning work explored Saudi channel entry. Meetings and the mandate are documented; Saudi sales, local profit and operating scale are not verified.",
    problem: "An Oman-origin consumer assortment needed a route to Saudi market access without allowing import, compliance and fixed setup costs to overwhelm contribution.",
    diagnosis: "Distributor rights, landed product cost, partner margin and channel conversion must be tested before opening fixed local capacity. Localized assortment is more than language translation.",
    work: "Worked on a distribution mandate, partner meetings and Saudi office, export and e-commerce scenarios. The evidence does not prove realized sales or profit in Saudi Arabia.",
    then: "Partner agreements, trade portals and manual import/export planning; a proposed office and channel structure were modeled.",
    economics: "Calculate contribution after supplier price, freight, customs/tax, local handling, channel fees, returns and fixed setup. Separate distribution margin from direct-to-consumer economics.",
    result: "Actual Result: mandate and partner/planning activity are evidenced. No Saudi sales, profit or market-share number is published.",
    forecast: "Business Case: setup, staffing and channel scenarios were modeled. Confidential fixed-cost values are withheld pending validation.",
    rebuild: "I would use a gated API-enabled distribution model: clear rights first, test landed SKU contribution, localize catalog and partner availability, then scale e-commerce only as demand and cash collection are proven.",
    ai: "Assortment-fit analysis, catalog localization drafts, demand forecasting and partner-service support. Trade/legal review all product claims and market-access decisions.",
    architecture: "Supplier-rights registry → landed-cost engine → product/content APIs → partner portal and commerce channels → order/import events → settlement and performance dashboard.",
    data: "Contractual rights, SKU cost, tariff/tax/FX, freight, partner price, stock, sell-through, returns, receivables and regulatory approvals.",
    decisions: "Trade and legal approve market access and product claims; finance approves investment and price floors; AI prepares scenarios and exceptions.",
    operating: "A cross-border category owner tracks landed contribution and partner sell-through. Fixed local investment is stage-gated rather than committed against an unproven forecast.",
    kpis: "Landed contribution per SKU/channel, fixed-cost cover, partner sell-through, returns, receivables days and cash conversion.",
    roadmap: ["Verify rights, compliance and landed-cost assumptions; narrow the initial assortment.", "Test approved partner and digital listings; reconcile order and settlement economics.", "Invest in local fixed capacity only if contribution, repeat demand and collection gates hold."],
    risks: "Mandate is not profit. Regulatory and brand rights, exchange exposure, logistics variation and fixed commitments could turn apparent revenue growth into cash loss.",
    lessons: ["A mandate is not a sales result.", "Trade compliance is a real cost.", "Distributor rights need clarity.", "Localization includes assortment and service.", "Fixed costs require stage gates."],
    related: ["oman-commerce", "warehouse"], articleKeys: ["saudi-landed", "margin-cash"], visual: "Oman-to-Saudi landed-cost and channel flow"
  },
  {
    id: "warehouse", name: "Warehouse and working-capital reset", period: "2023–2024 business case", geography: "Oman", sector: "Logistics and retail operations", tier: "Supporting", type: "Strategy Blueprint",
    summary: "Warehouse outsourcing and spare-capacity monetization were examined through cost, capacity and service scenarios. No external third-party logistics revenue is confirmed.",
    problem: "Under-used warehouse capacity and stock carrying cost created a double challenge: repair the retail cost base while considering whether surplus capacity could serve external demand.",
    diagnosis: "Spare space is a supply statistic, not a business. Anchor customers, pick/pack cost, service levels and collections determine whether a third-party logistics offer produces contribution.",
    work: "Developed warehouse outsourcing and monetization scenarios, agreements and cost sheets. The records show a business case, not verified live external service revenue.",
    then: "Manual utilization and cost worksheets with proposed third-party logistics and last-mile delivery models.",
    economics: "Separate retail stock cash release from external service contribution. Price storage, pick/pack and delivery against variable labour, space, technology, loss, SLA and receivable cost.",
    result: "Concept Case: no confirmed external warehouse-service revenue or profit is asserted.",
    forecast: "Business Case: capacity, cost and third-party logistics revenue were forecast in planning files. The values need anchor contracts and actual cost validation.",
    rebuild: "I would connect warehouse and transport events, forecast slot capacity and stock cash release, then quote external services only against measured utilization and service-cost floors.",
    ai: "Capacity forecast, putaway/pick optimization, route planning and receivable alerts. Pricing suggestions are constrained by contract and contribution limits.",
    architecture: "WMS/TMS and inventory APIs → event stream → capacity/cost model → contract and quote workflow → service dashboard and finance ledger.",
    data: "Usable space, stock age, labour and handling cost, pick/pack events, parcel/stop cost, external quotes, SLA breaches, claims and collections.",
    decisions: "Operations validates capacity and SLAs; finance approves service pricing and capital allocation; AI ranks demand and efficiency options.",
    operating: "Retail inventory and external customer stock are managed with distinct service rules and cost centres. Anchor contracts validate demand before a new logistics unit is announced.",
    kpis: "Utilization, cost per order, third-party logistics contribution, service-level performance, receivables days and retail stock cash release.",
    roadmap: ["Audit usable capacity, stock age and true handling cost.", "Test anchor-customer demand and guarded service pricing; instrument warehouse events.", "Scale external services only when contribution, SLAs and collections are proven."],
    risks: "Cross-subsidizing external customers with retail overhead, inaccurate capacity data and receivable delays. A modeled logistics venture should not be presented as an achieved one.",
    lessons: ["Utilization is supply, not demand.", "Anchor contracts prove appetite.", "Working capital belongs in the case.", "SLAs create real service cost.", "Warehouse data must be reliable."],
    related: ["family-retail", "saudi-entry"], articleKeys: ["warehouse-3pl", "margin-cash"], visual: "Capacity → service contribution → cash bridge"
  }
];

const articles = [
  {
    key: "marketplace-moment", title: "The Moment an Online Retailer Becomes a Marketplace", slug: "the-moment-an-online-retailer-becomes-a-marketplace", related: ["oman-commerce", "agent-social"],
    deck: "A third-party catalogue is not enough. The operating and economic shift begins when independent sellers repeatedly complete trustworthy orders.",
    argument: [
      "An online retailer can add a seller registration form and still be an online retailer. The defining change happens when a separate merchant supplies an offer, accepts a clear service standard and receives a reconciled settlement for a completed buyer order. Until that loop works, ‘marketplace’ is an ambition rather than a commercial fact.",
      "The Oman commerce record is a useful discipline check. First-party trading was real; later third-party expansion appeared in a model. Combining those two periods would exaggerate the operating evidence and contaminate the economics. Inventory-led retail margin and seller take rate have different cost structures.",
      "Before asking how many sellers have signed up, I would ask how many have a trade-ready listing, how many orders survive cancellation and returns, and whether the platform can settle the transaction without an exception. Only then do seller acquisition and assortment scale become meaningful."
    ],
    model: [["Merchant offer", "verified and in stock"], ["Completed order", "not registration"], ["Settlement", "after service and dispute cost"]],
    decision: "Call it a live marketplace only when repeated seller-owned orders, fulfilment standards and settlement are evidenced together."
  },
  {
    key: "agent-economics", title: "The Three-Sided Economics of Agent-Led Social Commerce", slug: "the-three-sided-economics-of-agent-led-social-commerce", related: ["agent-social", "payments"],
    deck: "A merchant, an agent and a buyer each need a reason to stay. The platform must fund that trust from completed-order contribution.",
    argument: [
      "The merchant needs sales that justify product preparation and platform fees. The agent needs reliable attribution and a payout that rewards real demand rather than clicks. The buyer needs an offer, fulfilment and remedy that make the channel credible. A platform that optimizes only one side can grow sign-ups while losing transactions.",
      "In the Oman agent-led platform, merchant and agent apps were live. The harder measure was active-pair liquidity: an approved merchant offer represented by an active agent and converted into a completed buyer order. Downloads and registrations were acquisition funnel data, not commercial outcomes.",
      "Commission design should start with the whole order waterfall. If the platform pays agents before returns and disputes settle, the apparent take rate can become a liability. If it delays payout without visibility, agents lose trust. A transaction ledger and a clear dispute path are therefore product features."
    ],
    model: [["Order value", "completed buyer sale"], ["Less costs", "merchant share, agent payout, delivery, payment, care"], ["Contribution", "what can fund growth"]],
    decision: "Scale an agent network only after attributable completed orders and payout accuracy are measured per active merchant–agent pair."
  },
  {
    key: "seller-onboarding", title: "Why Seller Onboarding Is an Operating Cost", slug: "why-seller-onboarding-is-an-operating-cost", related: ["oman-commerce", "agent-social"],
    deck: "Recruiting a seller is not the same as creating a reliable source of supply. Verification, catalogue quality and support consume real capacity.",
    argument: [
      "Marketplace decks often treat seller acquisition as a count. The useful unit is a seller who can trade: identity checked, product rights clear, listings accurate, stock available, fulfilment terms understood and settlement details verified. Each step takes work, and skipping any of them pushes cost into cancellations, care or disputes.",
      "AI can lower the time spent cleaning product attributes and drafting listings, but it cannot manufacture source evidence. A merchant whose product image, specification or stock cannot be verified should stay in a review queue. Human admission and money-movement decisions protect buyers and the seller network.",
      "The operating question is not whether onboarding can be automated. It is which steps can be made repeatable without removing accountability. Measure time to a first trade-ready offer, then watch the first completed orders and exception rate. That exposes whether onboarding quality actually paid back."
    ],
    model: [["Recruit", "lead"], ["Verify", "identity, rights, payout"], ["Trade-ready", "accurate offer and service"], ["Active", "completed order"]],
    decision: "Budget onboarding against activated sellers and subsequent order contribution, not registered seller count."
  },
  {
    key: "gmv-contribution", title: "Marketplace GMV, Net Revenue and Contribution Are Different Numbers", slug: "marketplace-gmv-net-revenue-and-contribution-are-different-numbers", related: ["oman-commerce", "agent-social", "payments"],
    deck: "A high transaction value can coexist with weak platform earnings. Each layer of the waterfall answers a different decision.",
    argument: [
      "GMV describes the value of completed merchandise transactions. It does not tell the platform what it earned. Net revenue is the fees and retained economics after refunds, discounts and partner shares. Contribution then deducts variable costs such as delivery, payment, care, commissions and returns.",
      "The distinction becomes sharper when first-party and third-party commerce are mixed. In first-party retail, the business owns inventory and earns product margin while carrying stock and markdown risk. In third-party trading, it earns a take rate but pays for seller operations and customer trust. One combined top-line number hides both systems.",
      "A management dashboard should show all three measures by order type and category. If GMV rises but completed-order contribution falls, buying demand may be destroying value. If net revenue grows but cash collection lags, the profit story is incomplete."
    ],
    model: [["GMV", "completed order value"], ["Net revenue", "retained fees/margin"], ["Contribution", "after variable service cost"]],
    decision: "Approve growth spend against contribution and cash, while retaining GMV as a liquidity measure."
  },
  {
    key: "clearance-margin", title: "Why Gross-Margin Percentage Can Mislead a Clearance Pilot", slug: "why-gross-margin-percentage-can-mislead-a-clearance-pilot", related: ["clearance", "family-retail"],
    deck: "A better margin rate is not a better store P&L if revenue, gross-profit currency or cash deteriorate.",
    argument: [
      "A clearance format can change the mix of products sold, the speed of sell-through and the amount of stock released. Gross-margin percentage captures only one ratio. If fewer orders are sold, the same or even a higher percentage can translate into less gross-profit currency.",
      "The observed Oman pilot is intentionally described with that tension intact: its margin rate improved, but EBITDA fluctuated and was negative in the last recorded month. Later projections cannot be inserted into the actual time series to smooth the story. The pilot establishes a useful diagnostic, not a completed turnaround.",
      "At SKU level, I would compare recovered cash against inventory carrying cost and the gross-profit loss from markdown. At store level, I would add selling expense and overhead. The correct pilot decision is which stock to clear, at what price, under which cash and contribution floor."
    ],
    model: [["Margin rate", "ratio"], ["Gross-profit currency", "sales × rate"], ["EBITDA and cash", "after overhead and stock release"]],
    decision: "Judge clearance by cash released and full P&L across observed periods, not the most attractive percentage."
  },
  {
    key: "margin-cash", title: "The Margin-to-Cash Bridge in Retail Turnaround", slug: "the-margin-to-cash-bridge-in-retail-turnaround", related: ["family-retail", "retail-sprint", "warehouse"],
    deck: "Profit recovery and working-capital recovery must be read together, category by category and action by action.",
    argument: [
      "A retailer may report improving gross margin while cash remains trapped in aged stock. It may release stock quickly through markdown but weaken contribution. It may raise sales through a new channel while increasing returns and delivery cost. Turnaround diagnosis has to reconcile these movements, not celebrate one line.",
      "The bridge starts with SKU and channel economics. Price and supplier cost drive gross profit; fulfilment, labour and promotion drive contribution; stock age and payment terms drive cash. Weekly operating meetings then connect each proposed action to an owner and a measurable outcome.",
      "In family retail, a board mandate gives permission to change but does not prove a result. A margin-to-cash cockpit makes the boundary honest: this is what was diagnosed, this is what was implemented, this is what improved in observed data and this remains modeled. That discipline also prevents venture upside from hiding the core repair."
    ],
    model: [["Gross profit", "price − product cost"], ["Contribution", "after service and promotion"], ["Cash", "stock age and collection"], ["EBITDA", "after overhead"]],
    decision: "Approve interventions against an audited cash and contribution baseline, then check realized value rather than intent."
  },
  {
    key: "safe-agents", title: "Which Commerce Actions Can AI Agents Safely Take?", slug: "which-commerce-actions-can-ai-agents-safely-take", related: ["ai-command", "oman-commerce"],
    deck: "The safe boundary is not ‘AI or human’. It is a permission model based on reversibility, value at risk and source confidence.",
    argument: [
      "A catalogue agent can identify missing attributes and prepare a description. A care agent can summarize a routine order-status request. Both tasks can be reviewed and reversed. Changing a price, admitting a seller, issuing a refund or releasing a payout crosses a different boundary: it can create economic, legal and trust consequences.",
      "The AI Commerce Command Center is designed around coordinated agents under human approval. I would begin with read-only evidence and drafting, then allow low-risk actions only where a policy, a live source-system fact and a rollback path agree. RAG can tell an agent what the policy says; it cannot tell the agent whether current stock exists.",
      "Measure unsafe proposals, false confidence and escalation latency before widening tool permissions. If the team cannot explain an action after it executes, the action should not have been automated."
    ],
    model: [["Evidence", "live API + governed policy"], ["Risk class", "reversibility and value"], ["Permission", "draft, approve or bounded execute"], ["Audit", "owner and rollback"]],
    decision: "Reserve price, seller, refund, payout and finance decisions for named human owners until specific bounded controls are proven."
  },
  {
    key: "rag-apis", title: "RAG Policies Versus Live Operational APIs", slug: "rag-policies-versus-live-operational-apis", related: ["ai-command", "app-studio"],
    deck: "Policy retrieval answers ‘what should we do?’ Source APIs answer ‘what is true right now?’ Commerce agents need both.",
    argument: [
      "A retrieval system can ground a response in an approved refund policy, seller standard or delivery SOP. It should not be treated as the source of live prices, stock or order state. Those facts change continuously and belong in operational APIs with timestamps and ownership.",
      "This separation matters at the decision point. An agent deciding how to respond to a delayed order must retrieve the current order event, then apply the versioned service policy. If the policy text is stale or the API fails, the correct output is an exception, not a confident invented answer.",
      "The architecture should carry provenance with each proposal: document version, API response time, permission scope and human approver where needed. Without provenance, a persuasive answer can disguise an unsafe action."
    ],
    model: [["RAG", "governed instructions"], ["API", "live operational facts"], ["Policy check", "allowed next step"], ["Action log", "what actually happened"]],
    decision: "Never let retrieved text substitute for live order, price, stock or finance truth."
  },
  {
    key: "payment-volume", title: "Payment Volume Is Not Fintech Net Revenue", slug: "payment-volume-is-not-fintech-net-revenue", related: ["payments", "agent-social"],
    deck: "Payment volume is the traffic on the rails. The economic engine is retained fee income after partner share, loss and delivery cost.",
    argument: [
      "A payment platform can grow total processing volume while weakening net revenue per transaction. A different rail mix, bank share or merchant pricing plan changes fee yield. Fraud, disputes, settlement and compliance costs then change contribution. Volume alone is not a useful profit forecast.",
      "The multi-party payments case on this site is a blueprint, not a delivered growth story. Its confidential modeled revenue figures are withheld. The public lesson is the decision method: build rail, product and country P&Ls, test signed merchant demand and verify regulated capacity before presenting a regional trajectory.",
      "AI can help prioritize onboarding exceptions, monitor routing performance and reconcile ledgers. It should not approve KYC/AML, sanctions, treasury exposure or reversals. Those are regulated decision rights, not friction to be removed."
    ],
    model: [["Payment volume", "processed value"], ["Retained fees", "after partner sharing"], ["Net revenue", "after refunds and adjustments"], ["Contribution", "after loss and operating cost"]],
    decision: "Stage expansion on permitted rails with measured net revenue and loss, not headline transaction volume."
  },
  {
    key: "warehouse-3pl", title: "When Spare Warehouse Capacity Can Become a 3PL Business", slug: "when-spare-warehouse-capacity-can-become-a-3pl-business", related: ["warehouse", "family-retail"],
    deck: "Empty space is an option, not demand. A service business appears only when contracts, costs and collections clear the contribution test.",
    argument: [
      "Unused capacity can tempt a retailer to announce a logistics venture. The more useful question is whether an external customer will pay enough for storage, pick/pack and delivery to cover labour, technology, claims, service levels and receivable time.",
      "A warehouse monetization model in the Oman record forecast external revenue but does not establish realized third-party service sales. Treat it as a business case. Validate usable capacity, identify an anchor customer, cost a real service promise and separate external stock from the retailer’s own inventory.",
      "Working capital is part of both sides. Clearing aged retail stock may free cash even if no third-party logistics venture launches. External contracts may add revenue but tie up receivables. A capacity-to-cash bridge keeps the two opportunities from being conflated."
    ],
    model: [["Usable capacity", "measured, not assumed"], ["Anchor demand", "contracted"], ["Service contribution", "after SLA and handling"], ["Cash", "after collections"]],
    decision: "Do not invest in a new logistics unit until anchor demand and cost-to-serve are evidenced."
  },
  {
    key: "saudi-landed", title: "Saudi Market Entry Begins With Landed Contribution", slug: "saudi-market-entry-begins-with-landed-contribution", related: ["saudi-entry", "oman-commerce"],
    deck: "Rights, freight, tax, channel fees and returns decide whether a regional product can become a viable local proposition.",
    argument: [
      "The apparent gross margin of a product in its origin market rarely survives unchanged in a new country. Distributor rights, import treatment, freight, local handling, channel commission and customer returns all alter the economics before fixed setup is considered.",
      "A Saudi-facing distribution mandate and planning activity are documented in the work archive, but realized sales and profit are not. The right public framing is a staged market-entry case: secure rights, verify landed cost, test a narrow assortment and invest in local capacity only if contribution and collection improve.",
      "AI can accelerate product localization, assortment analysis and demand forecasts. It cannot certify import permissions, brand claims or contractual rights. Those facts require legal and trade ownership; the model should surface uncertainty rather than bury it."
    ],
    model: [["Origin cost", "product and rights"], ["Landed cost", "freight, tax, handling"], ["Channel economics", "fees, returns, service"], ["Contribution", "before fixed setup"]],
    decision: "Reject a market-entry plan that cannot show SKU/channel landed contribution and a stage-gated fixed-cost path."
  },
  {
    key: "fundable-ai", title: "From AI Use Case to Fundable Transformation Scope", slug: "from-ai-use-case-to-fundable-transformation-scope", related: ["ai-command", "app-studio", "retail-sprint"],
    deck: "An AI idea becomes an operating investment only when baseline, workflow, decision rights and measurable value align.",
    argument: [
      "A list of AI use cases is easy to produce. A fundable scope is harder: it names the current process, its cost or value leak, the authoritative data, the action that should change and the person accountable for accepting risk. Without those elements, a demo can look convincing while failing to improve the business.",
      "In commerce, the sequence should begin with a narrow workflow such as catalogue quality or a routine care exception, not an autonomous management layer. In retail turnaround, a leakage model must connect to an approved store or category action and an audited margin-to-cash baseline. In enterprise delivery, an AI requirement draft must trace through testing and client acceptance.",
      "I would fund phases, not a promise of generalized automation. A read-only baseline and safety evaluation precede a controlled pilot; API-connected execution follows only when error, cost and contribution gates pass."
    ],
    model: [["Baseline", "current process and economics"], ["Workflow", "specific decision and data"], ["Control", "human owner and policy"], ["Value", "realized after total cost"]],
    decision: "Do not scale the AI layer until a controlled pilot shows both safe execution and a measurable commercial gain."
  }
];

const articlePath = Object.fromEntries(articles.map(a => [a.key, `/insights/${a.slug}`]));
const byId = Object.fromEntries(cases.map(c => [c.id, c]));
const summaryMeta = text => {
  const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const start = clean.slice(0, 158);
  return (clean.length > 158 ? start.slice(0, start.lastIndexOf(" ")) : start).replace(/[,:; ]+$/, "") + ".";
};
const caseCard = (id, label = "") => {
  const c = byId[id];
  return card(casePath[id], `${label || c.type} · ${c.geography}`, c.name, c.summary, `<span class="card-status">${c.tier}</span>`);
};
const linkList = items => `<div class="related-links">${items.map(([href, name]) => link(href, name)).join("")}</div>`;
const facts = c => `<div class="case-facts"><div><span>Period</span><strong>${c.period}</strong></div><div><span>Geography</span><strong>${c.geography}</strong></div><div><span>Sector</span><strong>${c.sector}</strong></div><div><span>Public type</span><strong>${c.type}</strong></div></div>`;
const diagramNodes = {
  "oman-commerce": [["Historical 1P", "Retail-owned stock and orders"], ["Planning boundary", "Proposed seller model—not proved trade"], ["Economic gate", "Completed-order contribution"], ["2026 redesign", "Verified offers + bounded agents"]],
  "agent-social": [["Merchant", "Approved trade-ready offer"], ["Agent", "Attributable representation"], ["Buyer", "Completed order and service"], ["2026 redesign", "Audited payout + AI support"]],
  "family-retail": [["Category", "Price, supplier and gross profit"], ["Inventory", "Age, turns and markdown"], ["Cash", "Working-capital release"], ["2026 redesign", "Approved action + value ledger"]],
  "clearance": [["Observed pilot", "SKU age and markdown"], ["Store P&L", "Gross-profit currency"], ["Outcome", "Cash release and EBITDA"], ["2026 redesign", "Guarded price scenarios"]],
  "ai-command": [["Live signal", "Authoritative commerce API"], ["Evidence", "Governed policy + facts"], ["Decision", "Human approval by risk"], ["Action", "Scoped tool + audit"]],
  "app-studio": [["Contract", "Approved SOW and estimate"], ["Build", "Requirements and code"], ["Acceptance", "Tests, release and handover"], ["2026 redesign", "AI traceability under review"]],
  "retail-sprint": [["Baseline", "Audited margin-to-cash"], ["Intervention", "Named owner and approval"], ["Comparison", "Control store or period"], ["2026 redesign", "Realized-value cockpit"]],
  "payments": [["Volume", "Processed transactions"], ["Retained fees", "After partner share"], ["Risk and cost", "Loss, settlement, compliance"], ["Business Case", "Net revenue and contribution"]],
  "saudi-entry": [["Rights", "Mandate and permissions"], ["Landed cost", "Freight, tax and handling"], ["Channel", "Partner sell-through"], ["Business Case", "Contribution before fixed setup"]],
  "warehouse": [["Capacity", "Usable space and handling"], ["Anchor demand", "Contracted external service"], ["Service cost", "SLA, claims and collection"], ["Business Case", "3PL contribution + cash"]]
};
const diagram = c => `<figure class="operating-diagram" role="group" aria-label="${esc(c.visual)}"><figcaption><span>Operating model</span><strong>${c.visual}</strong></figcaption><div class="diagram-flow">${diagramNodes[c.id].map(([label, note], i) => `<div class="${i === 3 ? label === "Business Case" ? "diagram-modeled" : "diagram-ai" : ""}"><small>${label}</small><b>${note}</b></div>${i < 3 ? '<i aria-hidden="true">→</i>' : ""}`).join("")}</div></figure>`;
const timeline = c => `<div class="roadmap">${["0–30 days", "30–90 days", "90–180 days"].map((phase, i) => `<div><span>${phase}</span><p>${c.roadmap[i]}</p></div>`).join("")}</div>`;
const lessons = c => `<ol class="lessons">${c.lessons.map(s => `<li>${s}</li>`).join("")}</ol>`;
function casePage(c) {
  const related = c.related.map(id => [casePath[id], byId[id].name]);
  const reads = c.articleKeys.map(key => [articlePath[key], articles.find(a => a.key === key).title]);
  const historical = [
    section("01 / Executive summary", "What this case establishes", prose(c.summary), "case-module"),
    section("02 / Business problem", "The constraint behind the work", prose(c.problem), "case-module"),
    section("03 / Commercial diagnosis", "Where the economics could break", prose(c.diagnosis), "case-module"),
    section("04 / Historical work", "What existed / what was done", prose(c.work), "case-module"),
    section("05 / Economics", "Business model and value bridge", prose(c.economics), "case-module"),
    section("06 / Original system", "Technology and operating model then", prose(c.then), "case-module"),
    section("07 / Evidence boundary", "Results and modeled impact", `<div class="evidence-grid"><div><span class="evidence-tag actual">Observed / actual</span>${prose(c.result)}</div><div><span class="evidence-tag modeled">Forecast / concept</span>${prose(c.forecast)}</div></div>`, "case-module")
  ].join("");
  const modern = [
    section("08 / 2026 AI Rebuild", "How I would rebuild this in 2026", prose(c.rebuild), "case-module"),
    section("09 / AI layer", "Automation worth deploying", prose(c.ai), "case-module"),
    section("10 / Architecture", "Modern technology architecture", prose(c.architecture), "case-module"),
    section("11 / Data", "The source-of-truth requirement", prose(c.data), "case-module"),
    section("12 / Decision rights", "Human versus AI", prose(c.decisions), "case-module"),
    section("13 / Operating model", "How the team would run", prose(c.operating), "case-module"),
    section("14 / Measures", "KPIs and unit economics", prose(c.kpis), "case-module"),
    section("15 / Roadmap", "A staged implementation", timeline(c), "case-module"),
    section("16 / Executive lessons", "Five things the case teaches", lessons(c), "case-module")
  ].join("");
  return {
    path: casePath[c.id], type: "WebPage", kind: "case", title: `${c.name} | Haris Aslam`, description: summaryMeta(c.summary),
    eyebrow: `${c.type} · ${c.geography}`, h1: c.name,
    intro: c.summary, heroAside: `<div class="hero-context"><span>${c.tier}</span><strong>Business problem → economics → operating model → technology → AI</strong><p>Historical evidence and the 2026 redesign are separated throughout.</p></div>`,
    project: c.id === "ai-command" ? { name: c.name, status: "In development", description: "A full commerce operation — catalog, orders, care, sellers, inventory, pricing and finance — run on lean resources by coordinated AI agents under human approval." } : undefined,
    body: `${facts(c)}${diagram(c)}<div class="case-era historical-era"><div class="era-banner"><span>Then / original period</span><strong>Documented work and proposals</strong></div>${historical}</div><div class="case-era modern-era"><div class="era-banner"><span>Now / 2026 AI-native redesign</span><strong>A proposed future operating model—not a historical result</strong></div>${modern}</div>${section("17 / Related work", "The adjacent operating problems", linkList(related), "case-module")}${section("18 / Related articles", "Read the operating argument", linkList(reads), "case-module")}${cta("Which part of the operating system would you change first?")}`
  };
}
function articlePage(a) {
  const related = a.related.map(id => [casePath[id], byId[id].name]);
  return {
    path: articlePath[a.key], type: "Article", kind: "article", title: `${({
      "agent-economics": "Agent-Led Social Commerce Economics",
      "gmv-contribution": "Marketplace GMV, Revenue & Contribution",
      "clearance-margin": "Why Clearance Margin Rates Mislead",
      "warehouse-3pl": "When Warehouse Capacity Becomes 3PL"
    })[a.key] || a.title} | Haris Aslam`,
    description: summaryMeta(a.deck + " " + a.argument[0]), datePublished: "2026-09-15",
    eyebrow: "Insights / Operating analysis", h1: a.title, intro: a.deck,
    heroAside: `<div class="hero-context"><span>Operator note</span><strong>Original analysis</strong><p>Framework, decision rule and linked operating cases.</p></div>`,
    body: `${section("The argument", "What the operating evidence says", prose(a.argument.join("\n")), "article-prose")}${section("Decision model", "The working equation", equation(a.title, a.model), "article-model")}${section("Executive rule", "What I would decide", prose(a.decision), "article-decision")}${section("Related work", "Where this problem appears", linkList(related), "article-related")}${cta("Is this the constraint in your business?")}`
  };
}

const home = {
  path: "/", type: "ProfilePage", kind: "home",
  title: "Muhammad Haris Aslam | GCC Operator & Builder",
  description: "Muhammad Haris Aslam builds businesses, fixes economics and redesigns operating models across GCC commerce, retail, marketplaces, fintech and AI.",
  eyebrow: "Operator · Builder · Transformation leader",
  h1: "I build businesses, fix economics and redesign operating models for the AI era.",
  intro: "Operator, builder and transformation leader across commerce, retail, marketplaces, fintech, enterprise technology and AI in the GCC.",
  heroAside: `<figure class="portrait"><img src="/assets/haris-aslam.webp" width="717" height="960" alt="Portrait of Muhammad Haris Aslam" fetchpriority="high"><figcaption>Operating experience across the GCC</figcaption></figure>`,
  body: [
    section("Selected operating evidence", "Work before claims", `<div class="evidence-strip"><div><strong>Built</strong><p>An Oman multi-category commerce operation from proposition through trading and fulfilment.</p></div><div><strong>Operated</strong><p>Live merchant and agent applications with onboarding and campaign workflows.</p></div><div><strong>Transformed</strong><p>Board-mandated retail operating work spanning category economics, inventory and procurement.</p></div><div><strong>Designed</strong><p>AI and payment blueprints with explicit human decision rights and commercial stage gates.</p></div></div>`),
    section("Build / Transform / Scale", "Three operating modes. One commercial discipline.", cards([
      card("/work/commerce-marketplaces", "Build", "Create the commercial engine", "From proposition and seller supply to completed-order contribution."),
      card("/work/retail-transformation-turnaround", "Transform", "Repair the margin-to-cash bridge", "Follow stock, category economics and decision ownership through the P&L."),
      card("/work/growth-market-entry", "Scale", "Expand only when local economics hold", "Test rights, landed cost, channel execution and cash before fixed capacity.")
    ])),
    section("Selected flagship work", "Problems addressed in the operating record", cards(["oman-commerce", "agent-social", "family-retail", "ai-command"].map(id => caseCard(id)))),
    section("How the work connects", "Economics → operating model → data → technology → AI", equation("The operating transformation chain", [["Business economics", "contribution and cash"], ["Operating model", "owners and cadence"], ["Data + technology", "source truth and APIs"], ["AI", "bounded action"]]) + prose("An AI layer cannot rescue broken commercial logic. The sequence starts with the business problem and the unit economics, then gives the operating team data and technology that support the decisions it already needs to make.")),
    section("AI & Transformation", "Automation as a change to the operating system", prose("The most useful AI work is not a collection of chat interfaces. It joins reliable source data, explicit decision rights, safe workflow actions and a measurable commercial baseline.") + cards([caseCard("ai-command"), card("/ai-transformation", "Approach", "The 2026 AI-native redesign", "See how historical cases are reworked into bounded, API-connected operating models.")]), "feature-section"),
    section("Ventures", "Build a thesis. Test the engine. Separate plan from proof.", prose("The record spans commerce platforms, agent-led distribution and enterprise app delivery. Venture concepts are presented as concepts until customer demand and economics are evidenced.") + cards([caseCard("agent-social"), card("/ventures", "Explore", "Venture building", "Operating models, venture experiments and stage gates.")]), "feature-section"),
    section("Insights", "Ideas tested against commercial reality", cards(articles.slice(0, 3).map(a => card(articlePath[a.key], "Operating note", a.title, a.deck))) + link("/insights", "Read all published insights"), "feature-section"),
    section("About", "An operator shaped by launches, resets and the Gulf", `<div class="about-teaser"><figure><img src="/assets/haris-aslam.webp" width="717" height="960" alt="Muhammad Haris Aslam" loading="lazy"></figure><div>${prose("The through-line is practical: identify the economic constraint, build the operating model around it and stay close enough to the numbers to know what is working. The work spans first-party commerce, social platforms, enterprise delivery, retail transformation and venture design across the GCC.")}${link("/about", "Read the operating profile")}</div></div>`),
    cta("What is the operating problem behind the headline?", "A useful first note gives the market, business context and decision to be made. No confidential data is needed.")
  ].join("")
};

const workPage = {
  path: "/work", type: "CollectionPage", kind: "work", title: "Work | GCC Commerce, Retail & AI | Haris Aslam",
  description: "Explore evidenced operating cases and strategy blueprints across GCC commerce, retail turnaround, AI, payments, enterprise delivery, growth and logistics.",
  eyebrow: "Work / Capability hubs", h1: "The work is organized around operating problems.",
  intro: "Browse the commercial diagnosis, historical evidence and proposed 2026 AI rebuilds. A case study documents real work; a blueprint labels what remained proposed.",
  body: `${section("Capability hubs", "Eight connected areas of work", cards(hubs.map(h => card(h.path, "Capability hub", h.name, h.lead)) ))}${section("Evidence-led work", "Published cases and blueprints", cards(cases.map(c => caseCard(c.id))))}${section("How to read a case", "Observed work is not a modeled outcome", `<div class="type-grid"><div><span>Case Study</span><p>Documented implementation or operating work; results appear only where supported.</p></div><div><span>Strategy Blueprint</span><p>Proposal, investment case or concept without claimed implementation.</p></div><div><span>2026 AI Rebuild</span><p>A modern reinterpretation clearly separated from the historical period.</p></div></div>`)}${cta("Which business problem is closest to yours?")}`
};

const hubPages = hubs.map(h => {
  const primary = h.cases.map(id => byId[id]);
  const adjacent = cases.filter(c => !h.cases.includes(c.id) && c.related.some(id => h.cases.includes(id))).slice(0, 3);
  return {
    path: h.path, type: "CollectionPage", kind: "hub", title: `${h.name} | Work | Haris Aslam`, description: summaryMeta(h.lead + " " + h.question + " Explore verified GCC cases and explicitly labeled strategy blueprints."),
    eyebrow: "Work / Capability hub", h1: h.name, intro: h.lead,
    heroAside: `<div class="hero-context"><span>Operating question</span><strong>${h.question}</strong><p>${h.model}</p></div>`,
    body: `${section("The operating question", h.question, prose(`This capability is not a detached service list. It follows the economic leak or growth constraint into the operating model, source data, technology choices and only then AI automation. ${h.lead}`))}${section("Working model", "How the pieces connect", equation(h.name, h.model.split(" → ").map(p => [p, "decision gate"])))}${section("Published work", "Cases where this problem is visible", cards(primary.map(c => caseCard(c.id))))}${adjacent.length ? section("Adjacent work", "Where the same constraint reappears", cards(adjacent.map(c => caseCard(c.id)))) : ""}${section("From history to 2026", "Two eras, never blended", `<div class="type-grid"><div><span>What existed then</span><p>Operating artefacts, technologies and outcomes are described within their original period.</p></div><div><span>How I would rebuild it now</span><p>Data architecture, bounded AI and automation are a proposed 2026 design, not an achieved historical result.</p></div></div>`)}${cta("What does the economics-to-operations bridge reveal?")}`
  };
});

const aiPage = {
  path: "/ai-transformation", type: "CollectionPage", kind: "ai", title: "AI & Transformation | Haris Aslam",
  description: "Explore an operator-led approach to AI transformation: source data, API-first workflows, bounded agents, human decision rights and measurable commerce impact.",
  eyebrow: "AI & Transformation", h1: "Redesign the operating model, not only the interface.",
  intro: "AI matters when it changes a real workflow safely and measurably. The work connects commercial economics, source-system truth, human decisions and bounded automation.",
  body: `${section("The transformation sequence", "A business case before an agent", equation("A fundable AI transformation", [["Economic leak", "baseline"], ["Workflow", "named owner"], ["Data + APIs", "source truth"], ["Bounded agent", "permission"], ["Measured value", "after cost"]]))}${section("2026 rebuilds", "Historical work is a starting point, not a retroactive AI claim", cards(["oman-commerce", "family-retail", "app-studio", "retail-sprint"].map(id => caseCard(id, "Historical case + 2026 redesign"))))}${section("AI Lab", "Applied experiments around real problems", cards([card("/ai-commerce", "In development · Agentic commerce", "AI Commerce Command Center", "A full commerce operation — catalog, orders, care, sellers, inventory, pricing and finance — run on lean resources by coordinated AI agents under human approval."), card("/career-runway", "Live · Career / Fintech", "Career Runway AI", "Helps professionals stuck in corporate life read their Career DNA and their real financial runway — grounded in their own numbers — before they leap.")]) + link("/ai-lab", "Explore AI Lab"))}${section("Decision rights", "Automate preparation. Govern consequences.", `<div class="rights-grid"><div><span>AI may prepare</span><p>Catalogue enrichment, care drafts, anomaly detection, scenario ranking and evidence summaries.</p></div><div><span>Human approval required</span><p>Prices, seller admission, refunds, payouts, supplier terms, regulated decisions and capital.</p></div><div><span>Audit every action</span><p>Source, policy version, owner, tool permission, outcome and rollback path.</p></div></div>`)}${cta("What decision would a better operating system unlock?")}`
};

const venturesPage = {
  path: "/ventures", type: "CollectionPage", kind: "ventures", title: "Ventures & New Business Models | Haris Aslam",
  description: "Explore GCC venture-building work across commerce platforms, agent-led distribution, app delivery, Saudi growth concepts and applied AI projects.",
  eyebrow: "Ventures", h1: "Build the thesis, then test the operating engine.",
  intro: "New business models earn credibility through customer demand, execution and contribution. This section distinguishes operating ventures from proposed expansion and product experiments.",
  body: `${section("Built and operated", "Commercial systems taken into live work", cards(["oman-commerce", "agent-social", "app-studio"].map(id => caseCard(id))))}${section("Blueprints and concepts", "Plans with explicit evidence boundaries", cards(["saudi-entry", "payments", "warehouse"].map(id => caseCard(id))))}${section("AI Lab", "Projects built around a real operating problem", cards([card("/ai-commerce", "In development", "AI Commerce Command Center", "Coordinated commerce agents under human approval."), card("/career-runway", "Live", "Career Runway AI", "User-grounded career and financial-runway decision support.")]))}${section("Stage gates", "What must be true before scale", equation("Venture proof sequence", [["Customer problem", "validated"], ["Transaction", "completed"], ["Contribution", "after service cost"], ["Operating repeatability", "measured"]]))}${cta("Which venture hypothesis needs evidence first?")}`
};

const insightsPage = {
  path: "/insights", type: "CollectionPage", kind: "insights", title: "Insights on GCC Commerce & AI | Haris Aslam",
  description: "Read original operator analysis on GCC marketplace economics, retail cash and margin, AI decision rights, payment net revenue, logistics and Saudi market entry.",
  eyebrow: "Insights / Operating notes", h1: "Arguments built from operating questions.",
  intro: "These notes unpack the decisions behind commerce, turnaround, technology and AI work. Each includes a working model and links to the underlying case.",
  body: `${section("Published analysis", "Commercial questions worth getting right", cards(articles.map(a => card(articlePath[a.key], "Operating insight", a.title, a.deck))))}${section("Read by problem", "Connect the note to the case", cards([card("/work/commerce-marketplaces", "Commerce", "Marketplace and seller economics", "Completed orders, seller activation and contribution."), card("/work/retail-transformation-turnaround", "Retail", "Margin and working capital", "The P&L and cash bridge behind intervention."), card("/ai-transformation", "AI", "Decision rights and source truth", "Where agents should—and should not—act.")]))}${cta("What argument is missing from the current plan?")}`
};

const aboutPage = {
  path: "/about", type: "ProfilePage", kind: "about", title: "About Muhammad Haris Aslam | GCC Operator",
  description: "Explore Muhammad Haris Aslam's operating path across Oman commerce, social marketplaces, enterprise app delivery, retail transformation and GCC venture building.",
  eyebrow: "About / Operating profile", h1: "An operator shaped by launches, resets and the Gulf.",
  intro: "The through-line is practical: identify the economic constraint, build the operating model around it and stay close enough to the numbers to know what works.",
  heroAside: `<figure class="portrait"><img src="/assets/haris-aslam.webp" width="717" height="960" alt="Muhammad Haris Aslam" loading="lazy"><figcaption>Doha-based · GCC operating history</figcaption></figure>`,
  body: `${section("The operating path", "From enterprise technology to commerce and transformation", prose("The early work connected commercial problems with enterprise technology in Oman. The next chapters moved into multi-category online commerce, merchant and agent distribution, and a repeatable enterprise app-delivery model.\nRetail transformation added a different lens: the relationship among category margin, inventory, procurement, working capital and board-level decisions. Venture and AI work now asks how those operating models should be redesigned with better data, APIs and bounded automation."))}${section("Operating principles", "What repeatedly survives contact with the market", cards([card("/work/commerce-marketplaces", "Principle", "Unit economics before growth", "Order value matters less than retained contribution and cash."), card("/work/retail-transformation-turnaround", "Principle", "Governance enables speed", "Named owners and honest baselines shorten the path from diagnosis to action."), card("/ai-transformation", "Principle", "AI should change the model", "Tools earn their place when workflows improve safely and measurably.")]))}${section("Where the record is documented", "Selected work", cards(["oman-commerce", "agent-social", "family-retail", "app-studio"].map(id => caseCard(id))))}${cta("What is the real constraint underneath the brief?")}`
};

const contactPage = {
  path: "/contact", type: "ContactPage", kind: "contact", title: "Contact Muhammad Haris Aslam | Operating Questions",
  description: "Contact Muhammad Haris Aslam to exchange practical perspectives on GCC commerce, retail economics, marketplaces, venture building and applied AI.",
  eyebrow: "Contact", h1: "Start with the operating problem.",
  intro: "A useful note states the market, business context, economic or execution constraint, and the decision to be made. No confidential data is needed at first contact.",
  body: `${section("Direct channels", "A practical conversation begins here", `<div class="contact-grid"><div><span>Email</span><a href="mailto:${site.email}">${site.email}</a><p>Best for a clear initial question.</p></div><div><span>LinkedIn</span><a href="${site.linkedin}" rel="me noopener">Muhammad Haris Aslam</a><p>Professional background and messages.</p></div></div>`)}${section("A useful first note", "Frame the decision—not a generic introduction", prose("What commercial problem are you solving? Which market and operating model are involved? What decision must the team make next, and what evidence is already available? A concise answer to those questions is more useful than a long deck.\nThe published work on this site is anonymized where needed. Please do not send confidential client or employer information in an initial note."))}${section("Explore before writing", "Find the adjacent operating case", linkList([["/work", "Published work"], ["/ai-transformation", "AI & Transformation"], ["/insights", "Operating insights"]]))}`
};

const aiLabPage = {
  path: "/ai-lab", type: "CollectionPage", kind: "ai-lab", title: "AI Lab | Applied AI Projects | Haris Aslam",
  description: "Explore AI Commerce Command Center and Career Runway AI: applied projects addressing commerce coordination and grounded personal decision support.",
  eyebrow: "AI Lab", h1: "Applied AI projects built around real operating problems.",
  intro: "The lab separates in-development product design from live project status. It does not claim adoption, savings or outcomes that have not been evidenced.",
  body: `${section("Projects", "Two distinct problems and operating models", cards([
    card("/ai-commerce", "In development · Agentic · Commerce", "AI Commerce Command Center", "A full commerce operation — catalog, orders, care, sellers, inventory, pricing and finance — run on lean resources by coordinated AI agents under human approval.", "<span class=\"card-status\">Business problem: fragmented commerce operating signals</span>"),
    card("/career-runway", "Live · Career · Fintech", "Career Runway AI", "Helps professionals stuck in corporate life read their Career DNA and their real financial runway — grounded in their own numbers — before they leap.", "<span class=\"card-status\">Business problem: decisions without runway clarity</span>")
  ]))}${section("Operating principle", "Human judgement remains central", prose("The AI Commerce Command Center is about coordinating commerce decisions under approval. Career Runway AI is a user-led decision-support project grounded in personal numbers. A live status is not a measured user-outcome claim, and an in-development status is not a production capability claim."))}${link("/ai-transformation", "See AI & Transformation")}`
};

const careerPage = {
  path: "/career-runway", type: "WebPage", kind: "project", title: "Career Runway AI | AI Lab | Haris Aslam",
  description: "Career Runway AI is a live decision-support project helping professionals examine Career DNA, personal financial runway and practical trade-offs.",
  eyebrow: "AI Lab / Live project", h1: "Career Runway AI",
  intro: "Helps professionals stuck in corporate life read their Career DNA and their real financial runway — grounded in their own numbers — before they leap.",
  heroAside: `<div class="hero-context"><span>Live · Career · Fintech</span><strong>User-led decision support</strong><p>No adoption or user-outcome claims are published.</p></div>`,
  project: { name: "Career Runway AI", status: "Live", description: "Helps professionals stuck in corporate life read their Career DNA and their real financial runway — grounded in their own numbers — before they leap." },
  body: `${section("Business problem", "Major decisions need grounded trade-offs", prose("Major career decisions are often made without a clear view of personal financial runway, practical trade-offs or the evidence behind the choice. The project centers the user’s own numbers rather than generic encouragement."))}${section("Project status", "Live project; no outcome claim", prose("Live describes the project’s status, not a measure of adoption, financial performance or user outcomes."))}${section("Responsible operating model", "The person decides", equation("A decision-support boundary", [["User facts", "owned and consented"], ["Scenario", "assumptions visible"], ["Trade-offs", "explained"], ["Human choice", "never delegated"]]) + prose("A privacy-first 2026 design would separate user-entered facts from assumptions, test arithmetic, disclose uncertainty and let the person delete their data. This is a design direction, not a historical implementation claim."))}${section("Explore AI Lab", "The other applied project", linkList([["/ai-commerce", "AI Commerce Command Center"], ["/ai-lab", "All AI Lab projects"]]))}`
};

const casePages = cases.map(casePage);
const articlePages = articles.map(articlePage);
const caseCollection = {
  path: "/work/cases", type: "CollectionPage", kind: "cases", title: "Operating Case Studies | Work | Haris Aslam",
  description: "Browse documented GCC operating cases across commerce, marketplaces, retail performance, app delivery, distribution and AI redesign.",
  eyebrow: "Work / Case studies", h1: "Documented operating work, with clear evidence boundaries.",
  intro: "Historical work and 2026 AI redesigns appear as separate eras. Forecasts and confidential outcomes are not presented as achieved results.",
  body: section("Case studies", "Real work, not just a proposition", cards(cases.filter(c => c.type.includes("Case Study") || c.id === "ai-command").map(c => caseCard(c.id))))
};
const blueprintCollection = {
  path: "/work/blueprints", type: "CollectionPage", kind: "blueprints", title: "Strategy Blueprints | Work | Haris Aslam",
  description: "Browse labeled GCC strategy blueprints for payments, Saudi distribution and warehouse monetization, with modeled economics separated from actual work.",
  eyebrow: "Work / Strategy blueprints", h1: "Business cases are valuable when they are labeled honestly.",
  intro: "A strategy blueprint can show a rigorous commercial model without pretending that its forecast became an achieved result.",
  body: section("Blueprints", "Plans and stage gates", cards(["payments", "saudi-entry", "warehouse"].map(id => caseCard(id))))
};

export const pages = [home, workPage, caseCollection, blueprintCollection, ...hubPages, ...casePages, aiPage, venturesPage, insightsPage, ...articlePages, aboutPage, contactPage, aiLabPage, careerPage];
export const reservedCaseIds = Array.from({ length: 72 }, (_, i) => i + 1).filter(id => ![1, 2, 3, 4, 8, 24, 25, 31, 44, 50, 53].includes(id));
