import { libraryCases as baseLibraryCases } from "./v3-pilot.mjs";
import { rentLibraryCase, rentPage } from "./v4-rent.mjs";

const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const slugify = value => String(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const list = items => `<ul>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
const pageTitle = title => `${title.length > 45 ? `${title.slice(0, 42).trim()}...` : title} | Haris Aslam`;
const description = summary => `${summary} The case connects economics, technology, operating ownership, controls and a measured path to scale.`.slice(0, 188);
const libraryHref = item => item.href || `/use-cases/${slugify(item.title)}`;

const sectorMap = {
  "Marketplaces & Commerce": "Marketplaces",
  "Venture / New Business": "New Ventures",
  "AI & Automation": "Enterprise Technology"
};
const solutionMap = { Fintech: "Payments", Automation: "AI / Automation", Turnaround: "Transformation" };

export const aiOperatingCases = [
  {
    title: "AI Commerce Command Center", sector: "Marketplaces", problem: "AI Transformation", solution: "AI / Automation", status: "In development", href: "/ai-commerce",
    summary: "Coordinate catalogue, orders, sellers, inventory, customer care, pricing and finance through one supervised exception and decision layer.",
    decision: "Which operating exception needs attention now, what evidence explains it, and which bounded action is permitted?",
    workflows: ["Detect cross-system exceptions", "Assemble an evidence packet", "Rank urgency and commercial consequence", "Prepare a bounded action", "Request approval and record the outcome"],
    authoritative: ["Commerce platform for orders and catalogue", "ERP or inventory service for stock and cost", "CRM or helpdesk for customer cases", "Payment and finance records for money", "Seller and fulfilment systems for service evidence"],
    human: ["Approve refunds, payouts and price changes", "Suspend sellers or customer access", "Change policy or decision thresholds", "Accept financial write-offs"],
    architecture: ["Event and API layer", "Commerce operating graph", "Policy and permission service", "Specialist workflow agents", "Human approval queue", "Audit and evaluation store"],
    economics: "Value comes from fewer manual searches, faster exception resolution, lower service leakage and better protection of order contribution. The business case deducts integration, model operations, evaluation and retained human capacity.",
    kpis: ["Exception detection precision", "Time to evidence", "Resolution cycle time", "Human override rate", "Contribution protected", "Customer and seller service level"],
    risks: ["Conflicting source records", "Action without current authority", "False urgency that distorts priorities", "Automation of a broken process"],
    roadmap: ["Map the top ten exceptions", "Connect read-only evidence", "Pilot recommendations", "Add approved actions", "Expand only after measured accuracy"]
  },
  {
    title: "AI Seller Onboarding Factory", sector: "Marketplaces", problem: "Operating Model", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-seller-onboarding-factory",
    summary: "Move a seller from verified identity to accurate bilingual offers, tested fulfilment and a first completed order with less manual rework.",
    decision: "Is this seller and each proposed offer trade-ready, and what work remains before customer exposure?",
    workflows: ["Collect seller and beneficial-owner evidence", "Extract and normalize product data", "Draft Arabic and English attributes", "Test policy, image and category quality", "Route gaps to seller or reviewer", "Activate only after human approval"],
    authoritative: ["KYC and company registry evidence", "Seller agreement and policy rules", "Product information and taxonomy", "Inventory and fulfilment capability", "Payments and settlement configuration"],
    human: ["Approve seller verification", "Accept regulated or restricted products", "Resolve ambiguous product rights", "Release the seller to trade"],
    architecture: ["Seller portal", "Document and image extraction", "Product normalization service", "Bilingual content models", "Rules and quality engine", "Reviewer workbench"],
    economics: "The value model connects onboarding cost to time-to-first-live-offer, first completed order and repeat contribution. Registrations have no commercial value until supply is accurate, available and serviceable.",
    kpis: ["Verification cycle time", "First-pass offer quality", "Time to first live offer", "First completed order", "Repeat trading rate", "Onboarding cost per productive seller"],
    risks: ["Fabricated attributes", "Weak rights evidence", "Biased seller risk scoring", "Activation before fulfilment readiness"],
    roadmap: ["Baseline one category", "Automate extraction and drafts", "Add reviewer evidence", "Pilot trade-readiness scoring", "Expand by category"]
  },
  {
    title: "AI Category & Merchandising Copilot", sector: "Retail & Consumer", problem: "Profitability", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-category-merchandising-copilot",
    summary: "Combine demand, margin, stock age, price and promotion evidence so category teams can make better assortment and inventory decisions.",
    decision: "Which SKU, supplier, price or promotion action can improve contribution and cash without weakening availability?",
    workflows: ["Sense demand by store and channel", "Flag stock-age and availability conflicts", "Prepare assortment and order scenarios", "Simulate price and promotion effects", "Explain the margin and cash trade-off"],
    authoritative: ["POS and order history", "Inventory and purchase orders", "Product cost and supplier terms", "Price and promotion calendar", "Returns and availability"],
    human: ["Approve price and promotion", "Commit supplier orders", "Change category role", "Accept markdown or write-off"],
    architecture: ["Retail data products", "Forecast and elasticity services", "Scenario engine", "Merchandising copilot", "Approval workflow", "Outcome ledger"],
    economics: "The case is measured through gross margin, sell-through, stock cover, markdown cost, lost sales and cash released. A recommendation that improves one measure while harming full contribution is rejected.",
    kpis: ["Forecast error", "Availability", "Stock cover", "Aged inventory", "Markdown rate", "Category contribution", "Cash conversion"],
    risks: ["Promotional causality errors", "Stale cost or stock data", "Short-term margin bias", "Supplier constraints omitted from the model"],
    roadmap: ["Choose one category", "Build a trusted data view", "Shadow category decisions", "Pilot scenarios with approvals", "Scale after cash evidence"]
  },
  {
    title: "AI Retail Turnaround Cockpit", sector: "Retail & Consumer", problem: "Profitability", solution: "Transformation", status: "Strategy note", href: "/use-cases/ai-retail-turnaround-cockpit",
    summary: "Turn store and SKU margin leakage, aged inventory, working capital and intervention tracking into one weekly management system.",
    decision: "Which intervention releases the most cash and contribution in the next operating cycle, and who owns it?",
    workflows: ["Detect store and SKU leakage", "Cluster aged inventory", "Prepare markdown and transfer scenarios", "Forecast cash release", "Track intervention owner and realized effect"],
    authoritative: ["POS and store P&L", "Inventory age and location", "Purchase orders and supplier terms", "Labour and occupancy cost", "Cash and payable records"],
    human: ["Approve markdowns and transfers", "Renegotiate supplier terms", "Change store staffing", "Close or reinvest in locations"],
    architecture: ["Retail turnaround data mart", "Exception analytics", "Scenario models", "Weekly action cockpit", "Owner and benefit tracker", "Finance reconciliation"],
    economics: "The cockpit separates gross-margin movement, stock cash, operating cost and full-store contribution. Modeled benefit is replaced by realized cash and reconciled P&L evidence after each action.",
    kpis: ["Gross margin bridge", "Aged stock", "Sell-through", "Cash released", "Store contribution", "Action completion", "Benefit realization"],
    risks: ["Discounting without incremental sell-through", "Double-counted benefits", "Local constraints hidden by averages", "Action overload without owners"],
    roadmap: ["Reconcile the baseline", "Define weekly action logic", "Run one-region cockpit", "Validate realized benefits", "Roll out by management cadence"]
  },
  {
    title: "AI Customer Care Operating Model", sector: "Telecom", problem: "Customer Experience", solution: "Operating Model", status: "Strategy note", href: "/use-cases/ai-customer-care-operating-model",
    summary: "Combine approved knowledge, live order and account APIs, automated triage and accountable human escalation in one care workflow.",
    decision: "What is true about this customer case now, what policy applies, and which remedy is authorized?",
    workflows: ["Classify intent and urgency", "Retrieve the approved policy", "Query live account or order state", "Draft a grounded response", "Execute low-risk tools or escalate with evidence"],
    authoritative: ["CRM and interaction history", "Order and service APIs", "Billing and payment state", "Approved policies and SOPs", "Identity and consent"],
    human: ["Approve material credits", "Handle vulnerability and complaints", "Override policy with authority", "Resolve regulated or reputational cases"],
    architecture: ["Omnichannel intake", "Intent router", "RAG knowledge layer", "Live operational APIs", "Tool-permission gateway", "Agent desktop and audit"],
    economics: "The business case balances containment and handling time with first-contact resolution, repeat contact, remedy cost, complaint outcomes and trust. Deflecting a case that returns later is not value.",
    kpis: ["Grounded-response rate", "First-contact resolution", "Repeat contact", "Average handling time", "Escalation quality", "Remedy cost", "Customer outcome"],
    risks: ["Confident answer over stale knowledge", "Wrong account action", "Inadequate vulnerability handling", "Optimization for deflection rather than resolution"],
    roadmap: ["Start with agent assist", "Connect live read-only facts", "Evaluate grounded answers", "Add bounded tools", "Automate narrow repeatable intents"]
  },
  {
    title: "AI Loyalty & Next-Best-Value Engine", sector: "Banking & Fintech", problem: "Growth", solution: "Loyalty", status: "Strategy note", href: "/use-cases/ai-loyalty-next-best-value-engine",
    summary: "Rank eligible merchant-funded and loyalty value around customer intent while measuring incremental spend and reward cost.",
    decision: "Which permitted benefit creates useful customer value and incremental contribution for the current need?",
    workflows: ["Resolve product and customer eligibility", "Assemble approved merchant and loyalty value", "Rank next-best-value options", "Explain benefit and conditions", "Attribute spend and reverse returns"],
    authoritative: ["Card and product eligibility", "Loyalty balance and liability", "Merchant offer terms", "Transactions and returns", "Consent and channel events"],
    human: ["Approve eligibility rules", "Fund and publish offers", "Change loyalty liability", "Resolve settlement and customer disputes"],
    architecture: ["Intent capture", "Deterministic policy gate", "Offer and rewards service", "AI ranking", "Attribution ledger", "Funding reconciliation"],
    economics: "Incremental card contribution and merchant funding are set against customer benefit, rewards cost, platform cost, returns and service. Attributed spend is not incremental without a valid control.",
    kpis: ["Eligible intent", "Offer relevance", "Control-group lift", "Reward cost", "Merchant funding recovery", "Net incremental contribution"],
    risks: ["Existing spend claimed as lift", "Ineligible offer exposure", "Unfair concentration", "Merchant funding or reversals that do not reconcile"],
    roadmap: ["Choose one intent", "Connect eligibility and offers", "Run a controlled cohort", "Reconcile returns and funding", "Expand by proven category"]
  },
  {
    title: "AI Marketplace Trust & Quality Layer", sector: "Marketplaces", problem: "Customer Experience", solution: "Platform", status: "Strategy note", href: "/use-cases/ai-marketplace-trust-quality-layer",
    summary: "Score seller and listing risk, monitor service evidence and route disputes without replacing policy or investigator judgment.",
    decision: "Which seller, offer or order needs review, what evidence supports the concern, and what action is permitted?",
    workflows: ["Detect listing-quality gaps", "Flag unusual seller and order patterns", "Monitor service-level breaches", "Assemble dispute evidence", "Recommend a proportionate review route"],
    authoritative: ["Verified seller identity", "Listing and product rights", "Orders, delivery and returns", "Customer and seller disputes", "Policy and enforcement history"],
    human: ["Suspend or remove sellers", "Decide fraud and appeals", "Resolve high-value disputes", "Change marketplace policy"],
    architecture: ["Trust event stream", "Rules and anomaly models", "Evidence graph", "Case-management queue", "Appeals workflow", "Decision audit"],
    economics: "Trust investment protects conversion, repeat demand and payment loss while reducing manual review. The model includes false positives, seller friction and the cost of remedies.",
    kpis: ["Listing defect rate", "Service breach rate", "Precision and recall", "Dispute cycle time", "False-positive rate", "Loss avoided", "Repeat purchase"],
    risks: ["Biased seller treatment", "Weak explainability", "Adversarial adaptation", "Automated enforcement without adequate evidence"],
    roadmap: ["Unify trust taxonomy", "Build evidence views", "Run models in shadow", "Pilot reviewer recommendations", "Automate only low-risk routing"]
  },
  {
    title: "AI Pricing & Promotion Control Tower", sector: "Retail & Consumer", problem: "Profitability", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-pricing-promotion-control-tower",
    summary: "Use elasticity, contribution, stock and competitor signals to prepare price and promotion scenarios within approval controls.",
    decision: "Which price or promotion can improve incremental contribution after cannibalization, funding and inventory effects?",
    workflows: ["Read price and demand history", "Estimate response ranges", "Simulate promotion and cannibalization", "Check margin and stock guardrails", "Prepare an approval-ready scenario"],
    authoritative: ["Price and promotion history", "POS and order demand", "Cost and supplier funding", "Inventory and availability", "Competitor observations"],
    human: ["Approve customer price", "Accept margin exceptions", "Commit campaign funding", "Handle regulated or sensitive categories"],
    architecture: ["Pricing data product", "Elasticity models", "Scenario and guardrail engine", "Approval workflow", "Price publication service", "Causal outcome measurement"],
    economics: "The model measures incremental gross profit and cash, not sales lift alone. It deducts discount, cannibalization, supplier funding gaps, returns and execution cost.",
    kpis: ["Incremental units", "Incremental gross profit", "Cannibalization", "Supplier funding", "Price-error rate", "Stock-out effect", "Model override"],
    risks: ["Spurious elasticity", "Price discrimination concerns", "Competitor-data quality", "Uncoordinated channel prices"],
    roadmap: ["Select a stable category", "Rebuild promotion history", "Run scenario back-tests", "Pilot human-approved prices", "Expand with causal evidence"]
  },
  {
    title: "AI Working-Capital & Inventory Agent", sector: "Retail & Consumer", problem: "Profitability", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-working-capital-inventory-agent",
    summary: "Connect stock aging, sell-through, demand, purchase commitments and cash scenarios so teams act before inventory becomes stranded.",
    decision: "Which replenishment, transfer, markdown or supplier action improves availability and releases cash?",
    workflows: ["Detect aging and excess exposure", "Forecast demand ranges", "Recommend reorder or stop-buy", "Prepare transfer and clearance options", "Model the cash-release effect"],
    authoritative: ["SKU-level inventory", "Sales and returns", "Open purchase orders", "Lead times and supplier terms", "Cost, price and cash records"],
    human: ["Commit or cancel purchase orders", "Approve markdown and disposal", "Renegotiate supplier terms", "Accept availability risk"],
    architecture: ["Inventory ledger", "Demand and lead-time models", "Policy guardrails", "Scenario agent", "Buyer approval queue", "Cash realization tracker"],
    economics: "Value is measured as realized cash release, lower markdown and write-off, improved availability and reduced expedites, net of model and operating cost.",
    kpis: ["Stock cover", "Aged inventory", "Forecast error", "Availability", "Purchase commitment", "Cash released", "Write-off and markdown"],
    risks: ["Demand shock", "Incomplete purchase commitments", "Over-optimization of cash", "Recommendations that ignore supplier relationships"],
    roadmap: ["Reconcile one inventory pool", "Add aging and demand alerts", "Pilot buyer scenarios", "Track realized cash", "Expand by category and supplier"]
  },
  {
    title: "AI Last-Mile Exception Manager", sector: "Logistics", problem: "Customer Experience", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-last-mile-exception-manager",
    summary: "Use scan, route, ETA and customer evidence to detect failed-delivery risk, prepare remedies and route costly exceptions.",
    decision: "Which delivery is likely to fail, which response is permitted, and when must a dispatcher or care agent intervene?",
    workflows: ["Detect missing or conflicting events", "Predict late or failed delivery risk", "Prepare reroute or contact options", "Send approved customer updates", "Assemble claim and carrier evidence"],
    authoritative: ["Order promise", "Carrier scans and GPS", "Route and capacity plan", "Customer delivery preference", "Claims and refund state"],
    human: ["Change high-cost routes", "Approve refund or compensation", "Resolve safety and custody issues", "Manage carrier accountability"],
    architecture: ["Logistics event stream", "ETA and anomaly models", "Exception playbooks", "Dispatcher console", "Customer messaging tools", "Claims evidence store"],
    economics: "Value comes from fewer failed attempts, lower care and claim cost, better capacity use and protected repeat demand. Rerouting cost and customer remedy remain visible.",
    kpis: ["On-time delivery", "Failed-attempt rate", "Prediction precision", "Time to intervention", "Cost per stop", "Claims cost", "Customer contact rate"],
    risks: ["Missing scans", "Unsafe automated rerouting", "Excess customer messaging", "Carrier incentives that distort data"],
    roadmap: ["Instrument one route family", "Add read-only risk alerts", "Pilot dispatcher recommendations", "Enable bounded messaging", "Scale by carrier evidence"]
  },
  {
    title: "AI Finance & Reconciliation Agent", sector: "Marketplaces", problem: "Operating Model", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-finance-reconciliation-agent",
    summary: "Match orders, commissions, refunds, seller payouts and bank settlement while keeping release of money under financial control.",
    decision: "Which financial leg is unmatched, what evidence explains it, and who has authority to clear or correct it?",
    workflows: ["Ingest transaction and settlement records", "Match deterministic references", "Classify unmatched items", "Prepare adjusting evidence", "Route approval and close the audit trail"],
    authoritative: ["Order and return ledger", "Payment gateway records", "Seller commission rules", "Payout and bank statements", "General ledger and tax records"],
    human: ["Release or hold payouts", "Approve adjustments and write-offs", "Change commission rules", "Close financial periods"],
    architecture: ["Financial event ledger", "Rules-based matcher", "LLM evidence classifier", "Exception workbench", "Approval and posting tools", "Immutable audit history"],
    economics: "The case reduces manual matching, payout delay and leakage while improving close quality. Benefit is measured against retained review capacity, false matches and unresolved balances.",
    kpis: ["Auto-match rate", "False-match rate", "Aged unmatched value", "Payout timeliness", "Close cycle", "Adjustment rate", "Leakage recovered"],
    risks: ["False positive matching", "Uncontrolled journal preparation", "Missing return events", "Currency and tax complexity"],
    roadmap: ["Reconcile one payment rail", "Create exception taxonomy", "Run shadow classification", "Pilot approval-ready adjustments", "Add rails after clean close"]
  },
  {
    title: "AI B2B Software Procurement Advisor", sector: "Enterprise Technology", problem: "Profitability", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-b2b-software-procurement-advisor",
    summary: "Translate requirements, entitlements, renewal timing and service needs into an explainable software-buying and optimization workflow.",
    decision: "What licence, quantity, term and service package meets the requirement at the lowest defensible lifecycle cost?",
    workflows: ["Extract business and technical requirements", "Match vendor entitlement rules", "Compare licence and service options", "Predict renewal and unused exposure", "Prepare an approval and negotiation brief"],
    authoritative: ["Approved vendor catalogues", "Contracts and entitlement rules", "Current deployment and usage", "Renewal and support history", "Security and architecture standards"],
    human: ["Select vendor and contract", "Accept security exception", "Commit budget", "Negotiate final commercial terms"],
    architecture: ["Requirements workspace", "Vendor knowledge RAG", "Entitlement rules engine", "Usage and renewal APIs", "Scenario advisor", "Procurement approval workflow"],
    economics: "Value combines avoided over-licensing, better renewal timing, service attachment and reduced buying effort. It excludes savings that result only from deferring required capability.",
    kpis: ["Requirement completeness", "Unused entitlement", "Renewal forecast accuracy", "Procurement cycle time", "Lifecycle cost", "Service adoption", "Compliance exceptions"],
    risks: ["Outdated vendor terms", "Biased recommendations", "Hidden switching cost", "Security or integration requirements omitted"],
    roadmap: ["Start with one vendor family", "Ground entitlement evidence", "Connect usage read-only", "Pilot renewal scenarios", "Expand after procurement acceptance"]
  },
  {
    title: "AI Market-Entry Intelligence Engine", sector: "New Ventures", problem: "Market Entry", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-market-entry-intelligence-engine",
    summary: "Keep market sizing, competitor evidence, landed economics, regulation and launch stage gates in one traceable decision system.",
    decision: "Does this market and route to customer justify the next commitment of cash, people and local capacity?",
    workflows: ["Collect cited market and competitor evidence", "Model landed unit economics", "Track regulatory assumptions", "Compare channel and partner routes", "Prepare launch, pause or stop gates"],
    authoritative: ["Government and regulator sources", "Audited company and market data", "Supplier and logistics quotes", "Tax and landed-cost inputs", "Pilot demand and conversion evidence"],
    human: ["Approve market and partner", "Accept regulatory assumptions", "Commit inventory and fixed cost", "Release each investment gate"],
    architecture: ["Source registry", "Cited research RAG", "Economics model", "Assumption and confidence ledger", "Scenario workbench", "Investment-gate workflow"],
    economics: "The engine makes fixed cost, inventory, working capital, partner margin and customer-acquisition assumptions visible. It does not turn uncertain market data into false precision.",
    kpis: ["Source freshness", "Assumption confidence", "Landed contribution", "Working-capital need", "Pilot conversion", "Cash burn", "Gate variance"],
    risks: ["False precision", "Weak local evidence", "Regulation treated as static", "Model outputs that hide partner execution risk"],
    roadmap: ["Define the investment question", "Build source and assumption ledger", "Model downside and base cases", "Run a narrow demand test", "Commit only after gate review"]
  },
  {
    title: "AI Creator-Commerce Engine", sector: "Marketplaces", problem: "Growth", solution: "Commerce", status: "Strategy note", href: "/use-cases/ai-creator-commerce-engine",
    summary: "Match creators to approved products, preserve attribution through returns and pay commission on contribution rather than noisy reach.",
    decision: "Which creator and product pairing can create attributable, serviceable and profitable demand?",
    workflows: ["Match creator audience and product context", "Generate approved campaign options", "Track content-to-order attribution", "Adjust for returns and cancellations", "Prepare contribution-based payouts"],
    authoritative: ["Creator identity and audience evidence", "Product rights, stock and margin", "Campaign terms", "Orders, returns and refunds", "Payout and tax records"],
    human: ["Approve creator and brand fit", "Approve claims and content", "Resolve attribution disputes", "Release payout"],
    architecture: ["Creator and product graph", "Campaign workspace", "Attribution event layer", "Return-adjusted payout engine", "Content approval", "Finance reconciliation"],
    economics: "The model links creator cost to completed, return-adjusted contribution. Views and clicks are diagnostic signals, not the commercial result.",
    kpis: ["Qualified creator-product pairs", "Attributable conversion", "Return rate", "Contribution after payout", "Repeat purchase", "Payout accuracy"],
    risks: ["Misleading claims", "Attribution gaming", "Inventory not available", "Payout before return evidence"],
    roadmap: ["Select one category", "Approve creators and claims", "Instrument attribution", "Pilot return-adjusted payouts", "Expand by positive contribution"]
  },
  {
    title: "AI Gifting Concierge", sector: "Retail & Consumer", problem: "Customer Experience", solution: "Commerce", status: "Strategy note", href: "/use-cases/ai-gifting-concierge",
    summary: "Translate occasion, relationship, budget, live inventory and fulfilment capacity into explainable gift options a customer can trust.",
    decision: "Which available gift best fits the occasion, recipient, budget and delivery promise right now?",
    workflows: ["Capture occasion and recipient context", "Filter live inventory and delivery feasibility", "Rank explainable combinations", "Prepare a personalized message", "Confirm stock, price and promise before checkout"],
    authoritative: ["Product catalogue and attributes", "Live inventory and price", "Delivery zones and capacity", "Customer consented preferences", "Order and substitution rules"],
    human: ["Approve sensitive message or claim", "Handle substitution and quality", "Resolve service recovery", "Control assortment and pricing"],
    architecture: ["Conversational interface", "Product and occasion graph", "Inventory and fulfilment APIs", "Recommendation model", "Checkout handoff", "Care and feedback loop"],
    economics: "Value is measured through conversion, basket, attach, substitution, service cost and repeat gifting, not conversational engagement alone.",
    kpis: ["Recommendation acceptance", "Conversion", "Average basket", "Substitution rate", "On-time delivery", "Care contact", "Repeat occasion use"],
    risks: ["Unavailable recommendations", "Cultural or relationship errors", "Privacy overreach", "Delivery promise beyond capacity"],
    roadmap: ["Start with three occasions", "Ground live stock and delivery", "Pilot assisted recommendations", "Add personalization with consent", "Expand by service evidence"]
  },
  {
    title: "AI Enterprise Workflow Copilot", sector: "Enterprise Technology", problem: "Digital Transformation", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-enterprise-workflow-copilot",
    summary: "Combine grounded SOP retrieval with live ERP, CRM and work-order facts so staff can prepare and execute controlled enterprise actions.",
    decision: "What policy applies, what is the current system state, and which named action can this user take?",
    workflows: ["Understand the task and role", "Retrieve approved procedure", "Query live enterprise records", "Prepare form or transaction", "Request approval or execute a bounded tool", "Record evidence"],
    authoritative: ["Approved policies and SOPs", "ERP and financial records", "CRM and account state", "Work-order and asset systems", "Identity, role and approval limits"],
    human: ["Approve commitments and postings", "Accept control exceptions", "Change master data", "Handle safety, legal and customer consequence"],
    architecture: ["Enterprise identity", "Knowledge RAG", "API and tool gateway", "Workflow state", "Copilot interface", "Policy, audit and evaluation"],
    economics: "The case values reduced search and re-entry, shorter cycle time and fewer control defects. It includes integration, evaluation and the human review that remains necessary.",
    kpis: ["Grounded answer rate", "Task cycle time", "Rework", "Control defects", "Approval time", "Tool success", "User adoption by workflow"],
    risks: ["Permission leakage", "Stale procedure", "Unsafe cross-system action", "Shadow workflows outside the system of record"],
    roadmap: ["Choose one high-volume workflow", "Ground policy and read-only facts", "Pilot form preparation", "Add one approved tool", "Scale after audit evidence"]
  },
  {
    title: "AI Retail-Media Optimizer", sector: "Retail & Consumer", problem: "New Revenue", solution: "Platform", status: "Strategy note", href: "/use-cases/ai-retail-media-optimizer",
    summary: "Allocate retail-media inventory across advertiser demand while protecting customer relevance and incremental retail contribution.",
    decision: "Which sponsored placement creates incremental value without weakening the retail journey or hiding organic relevance?",
    workflows: ["Forecast placement supply and advertiser demand", "Rank eligible campaigns", "Apply customer and category guardrails", "Measure incrementality and cannibalization", "Optimize yield within approved limits"],
    authoritative: ["Owned-channel inventory", "Product availability and margin", "Campaign terms and budget", "Customer consent and relevance", "Sales, returns and control cohorts"],
    human: ["Approve advertisers and claims", "Set category and customer guardrails", "Resolve conflicts and make-goods", "Change auction or pricing policy"],
    architecture: ["Ad inventory service", "Campaign and eligibility engine", "Ranking and pacing models", "Measurement layer", "Advertiser console", "Finance and billing"],
    economics: "Media revenue is set against discounts, make-goods, technology, sales and measurement cost plus any loss of organic conversion. Incremental retail contribution remains the governing measure.",
    kpis: ["Fill and yield", "Advertiser return", "Incremental sales", "Organic conversion", "Customer frequency", "Make-good rate", "Net media contribution"],
    risks: ["Attribution inflation", "Paid relevance crowding out customer value", "Inventory conflicts", "Sensitive targeting"],
    roadmap: ["Define limited inventory", "Instrument control cohorts", "Pilot direct campaigns", "Add ranking and pacing", "Scale after incremental evidence"]
  },
  {
    title: "AI Procurement / Supplier Negotiation Copilot", sector: "Enterprise Technology", problem: "Profitability", solution: "AI / Automation", status: "Strategy note", href: "/use-cases/ai-procurement-supplier-negotiation-copilot",
    summary: "Prepare supplier negotiations from landed margin, MOQ, demand, inventory risk, service performance and contractual evidence.",
    decision: "Which term matters most to full landed contribution and supply risk, and what evidence supports the negotiation position?",
    workflows: ["Extract current contract and price terms", "Model demand, MOQ and stock exposure", "Compare supplier performance", "Prepare negotiation ranges and trade-offs", "Record approved commitments"],
    authoritative: ["Contracts and price lists", "Purchase and receipt history", "Demand and inventory", "Quality and service performance", "Freight, duty and payment terms"],
    human: ["Set relationship strategy", "Make contractual commitments", "Approve price and volume", "Accept concentration or supply risk"],
    architecture: ["Contract RAG", "Supplier performance mart", "Landed-cost engine", "Scenario copilot", "Negotiation workspace", "Approval and commitment ledger"],
    economics: "The model converts unit price, payment terms, freight, MOQ, quality, lead time and inventory exposure into total landed contribution and cash need.",
    kpis: ["Landed margin", "MOQ exposure", "Lead-time variance", "Quality loss", "Payment-term value", "Inventory risk", "Realized negotiated benefit"],
    risks: ["Hallucinated contract terms", "Short-term price bias", "Exposure of confidential positions", "Unapproved commitments"],
    roadmap: ["Start with one supplier group", "Ground contracts and history", "Back-test landed-cost scenarios", "Pilot negotiation briefs", "Track realized terms before expansion"]
  }
];

const normalizedBase = baseLibraryCases
  .filter(item => item.title !== "AI Commerce Command Center")
  .map(item => {
    const sector = sectorMap[item.sector] || item.sector;
    const solution = solutionMap[item.solution] || (item.problem === "Operating Model" ? "Operating Model" : item.solution);
    return { ...item, sector, solution, href: libraryHref(item), tier: item.status === "Flagship" ? "substantial" : "note" };
  });

export const expandedLibraryCases = [rentLibraryCase, ...aiOperatingCases, ...normalizedBase]
  .filter((item, index, all) => all.findIndex(peer => peer.href === item.href) === index);

const caseExhibit = (item, number = 1) => `<figure class="v4-case-exhibit"><figcaption><span>${String(number).padStart(2, "0")}</span><strong>${esc(item.title)} operating chain</strong></figcaption><div class="v4-case-chain"><div><span>Problem</span><b>${esc(item.problem)}</b></div><i></i><div><span>Commercial logic</span><b>Value must exceed full cost to serve</b></div><i></i><div><span>Solution</span><b>${esc(item.solution)}</b></div><i></i><div><span>Scale gate</span><b>Measured contribution and control</b></div></div></figure>`;
const decisionExhibit = (item, number = 2) => `<figure class="v4-case-exhibit dark"><figcaption><span>${String(number).padStart(2, "0")}</span><strong>Decision-rights model</strong></figcaption><div class="v4-decision-grid"><div><span>Business owner</span><b>Proposition and economics</b></div><div><span>Operations</span><b>Capacity, service and exceptions</b></div><div><span>Technology and data</span><b>Reliable facts and workflow</b></div><div><span>Control</span><b>Policy, money and customer consequence</b></div></div><p>Automation prepares evidence and repeatable actions. Named people retain authority for commitments, money and consequential exceptions.</p></figure>`;
const roadmapExhibit = (steps, number = 3) => `<figure class="v4-case-exhibit"><figcaption><span>${String(number).padStart(2, "0")}</span><strong>Controlled implementation path</strong></figcaption><div class="v4-note-roadmap">${steps.map((step,index)=>`<div><span>${index === 0 ? "0-30" : index === 1 ? "30-90" : index === 2 ? "90-180" : "Scale"}</span><b>${esc(step)}</b></div>`).join("")}</div></figure>`;

function strategyNotePage(item) {
  const steps = ["Confirm the baseline, owner and economic question", `Pilot the ${item.solution.toLowerCase()} workflow with one accountable team`, "Measure contribution, service and control before adding scope", "Standardize only what the evidence supports"];
  const impactLabel = item.status.toLowerCase().includes("operating") || item.status.toLowerCase().includes("live") ? "Business impact boundary" : "Modeled business impact";
  return {
    path: item.href, type: "WebPage", kind: "case", title: pageTitle(item.title), description: description(item.summary), eyebrow: `${item.status} · ${item.sector}`, h1: item.title, intro: item.summary, v3: true,
    v3Body: `<section class="v3-case-hero v4-note-hero"><div class="v3-shell"><div><span class="v3-label">${esc(item.status)} · ${esc(item.sector)}</span><h1>${esc(item.title)}</h1><p>${esc(item.summary)}</p><div class="v3-case-facts"><span><b>Business problem</b>${esc(item.problem)}</span><span><b>Solution type</b>${esc(item.solution)}</span><span><b>Outcome basis</b>${impactLabel}</span></div></div>${caseExhibit(item,1)}</div></section>
    <section class="v3-case-section"><div class="v3-shell v3-narrative-aside"><div><span class="v3-label">Executive summary</span><h2>Start with the management decision, then design the operating chain.</h2><p>${esc(item.summary)} The value of the case does not come from adding a digital channel or naming a technology. It comes from connecting customer or enterprise demand to a commercial model, a reliable operating process, an accountable owner and evidence that can support a scale decision.</p><p>The first task is to define the unit of activity and the unit of value. For a marketplace that may be a completed, return-adjusted order and its contribution. For a platform it may be an active account or workflow after support and integration cost. For a transformation it may be cash released, margin protected, cycle time removed or a service failure prevented. Volume alone is not the result.</p><p>This page is a strategy note. Where implementation evidence is not present, outcomes remain modeled. The purpose is to make the business design, data requirements, decision rights and test plan explicit without inventing customers, adoption or financial performance.</p></div><aside class="v3-board-note"><span>Executive question</span><h3>What must be true before this model deserves scale?</h3><dl><div><dt>Demand</dt><dd>A real user or enterprise problem recurs often enough.</dd></div><div><dt>Economics</dt><dd>The full cost to serve fits inside the value pool.</dd></div><div><dt>Operation</dt><dd>Named teams can deliver and resolve exceptions.</dd></div><div><dt>Control</dt><dd>Money, customer and policy decisions remain governed.</dd></div></dl></aside></div></section>
    <section class="v3-case-section dark"><div class="v3-shell"><header class="v3-case-heading"><span class="v3-label">Business problem and commercial opportunity</span><h2>${esc(item.problem)} is the outcome to manage, not a label for the project.</h2><div><p>The operating problem is that demand, economics and ownership usually sit in different places. A customer or business user experiences one journey, while product, operations, finance, technology and partners each manage a fragment. The fragmentation creates delay, weak accountability and an incomplete view of contribution.</p><p>The commercial opportunity is to organize those fragments around a measurable transaction or decision. ${esc(item.summary)} That proposition should specify who pays, which behavior or cost changes, when revenue or savings can be recognized and which service obligation is created in return.</p><p>The model should be tested under a downside case as well as a base case. Lower conversion, higher support, more exceptions, slower partner execution and greater working-capital need often matter more than the headline market size. A model that works only under optimistic volume is not ready.</p></div></header>${decisionExhibit(item,2)}</div></section>
    <section class="v3-case-section"><div class="v3-shell"><header class="v3-case-heading"><span class="v3-label">Solution, technology and operating model</span><h2>Technology belongs inside an owned workflow.</h2><div><p>The ${esc(item.solution.toLowerCase())} solution should expose the minimum reliable facts needed for the decision, move work through explicit states and create an evidence trail. Systems of record remain authoritative for customer identity, product, price, inventory, orders, money, contracts or service events. The workflow layer coordinates them rather than creating a second uncontrolled truth.</p><p>AI and automation are useful for classification, extraction, matching, scenario preparation, evidence assembly and repeatable low-risk steps. They are not a substitute for missing data or unclear authority. Actions that change money, customer rights, partner status, commitments or material service outcomes require policy, permissions and accountable approval.</p><p>The operating model needs one proposition owner, a small cross-functional delivery team and a shared exception queue. A daily rhythm handles service and transaction breaks. A weekly review reads demand, unit economics and operational quality together. A monthly gate approves scope, investment and material policy changes.</p></div></header><div class="v4-model-panels"><article><span>Commercial model</span><h3>Revenue or benefit follows a governed event.</h3><p>Define the charge, saving or value pool at transaction level. Deduct partner share, incentives, returns, service, technology, risk, fixed capacity and working capital before calling the model profitable.</p></article><article><span>Data model</span><h3>Source facts stay traceable.</h3><p>Each recommendation or automated action should point to the current system record, applicable policy, user authority and time of decision. Derived scores are labeled and monitored.</p></article><article><span>Operating model</span><h3>Exceptions have named owners.</h3><p>Standard work can move quickly only when edge cases, appeals, refunds, disputes and financial adjustments have clear routes and service levels.</p></article></div></div></section>
    <section class="v3-case-section dark"><div class="v3-shell"><header class="v3-case-heading"><span class="v3-label">Implementation, KPIs and risk</span><h2>Earn the next stage through evidence.</h2><div><p>Days 0 to 30 define the journey, baseline, economic equation, source systems, control boundary and stop conditions. Days 30 to 90 build a narrow workflow and run it with a limited cohort. Days 90 to 180 compare outcomes with the baseline, remove failure modes and decide whether a repeatable operating model exists.</p><p>The KPI set should pair demand and activity with contribution, service and control. Typical measures include qualified demand, completion, repeat use, cost to serve, exception rate, resolution time, customer or partner failure, realized benefit and financial reconciliation. The exact measure depends on the case, but every dashboard needs a denominator and an accountable owner.</p><p>Material risks include weak source data, benefits counted twice, partner dependence, customer harm, uncontrolled automation and an operating burden that appears only after launch. Governance should make those risks visible before scope expands. A delayed or stopped pilot can be a successful decision when the economics or controls do not hold.</p></div></header>${roadmapExhibit(steps,3)}<div class="v4-impact-note"><span>${impactLabel}</span><p>${item.status.toLowerCase().includes("operating") ? "The public record describes the operating model without adding unverified financial results. Further outcome claims require source evidence." : "The commercial effect is a scenario until a controlled pilot produces reconciled evidence. No achieved revenue, savings, adoption or market share is claimed."}</p></div></div></section>`
  };
}

const aiFlowExhibit = item => `<figure class="v4-ai-exhibit"><figcaption><span>01</span><strong>AI workflow and authority</strong></figcaption><div class="v4-ai-flow">${item.workflows.map((step,index)=>`<div><span>${String(index+1).padStart(2,"0")}</span><b>${esc(step)}</b></div>`).join("")}</div><div class="v4-ai-human"><span>Human approval points</span>${item.human.map(point=>`<b>${esc(point)}</b>`).join("")}</div></figure>`;
const aiArchitectureExhibit = item => `<figure class="v4-ai-exhibit dark"><figcaption><span>02</span><strong>Technology and data architecture</strong></figcaption><div class="v4-ai-stack">${item.architecture.map((layer,index)=>`<div><span>0${index+1}</span><b>${esc(layer)}</b><small>${index === 0 ? "Source and interaction" : index === item.architecture.length-1 ? "Control and evidence" : "Workflow capability"}</small></div>`).join("")}</div><div class="v4-source-strip"><span>Authoritative data</span>${item.authoritative.map(source=>`<b>${esc(source)}</b>`).join("")}</div></figure>`;
const aiKpiExhibit = item => `<figure class="v4-ai-exhibit"><figcaption><span>03</span><strong>Economics and KPI framework</strong></figcaption><p>${esc(item.economics)}</p><div class="v4-kpi-grid">${item.kpis.map(kpi=>`<div><span>Measure</span><b>${esc(kpi)}</b></div>`).join("")}</div></figure>`;

function aiOperatingPage(item) {
  return {
    path: item.href, type: "WebPage", kind: "case", title: pageTitle(item.title), description: description(item.summary), eyebrow: `${item.status} · Practical AI operating case`, h1: item.title, intro: item.summary, v3: true,
    project: item.title === "AI Commerce Command Center" ? { name:item.title, status:item.status, description:item.summary } : undefined,
    v3Body: `<section class="v3-case-hero v4-ai-case-hero"><div class="v3-shell"><div><span class="v3-label">Practical AI operating case · ${esc(item.sector)}</span><h1>${esc(item.title)}</h1><p>${esc(item.summary)}</p><div class="v3-case-facts"><span><b>Management decision</b>${esc(item.decision)}</span><span><b>Authority model</b>Supervised and auditable</span><span><b>Outcome basis</b>Modeled business impact</span></div></div>${aiFlowExhibit(item)}</div></section>
    <nav class="v3-case-nav" aria-label="Case chapters"><div class="v3-shell"><a href="#problem">Problem</a><a href="#model">Operating model</a><a href="#workflows">AI workflows</a><a href="#architecture">Architecture</a><a href="#economics">Economics</a><a href="#roadmap">Roadmap</a></div></nav>
    <section class="v3-case-section" id="problem"><div class="v3-shell v3-narrative-aside"><div><span class="v3-label">Problem and commercial diagnosis</span><h2>The unit of value is a better operating decision, not an AI interaction.</h2><p>${esc(item.summary)} The business problem exists because evidence and action are separated across teams and systems. People spend time finding the current fact, reconciling conflicting records and deciding which policy applies before they can address the commercial or service issue.</p><p>The management question is: ${esc(item.decision)} That question defines the workflow boundary. It also prevents a broad AI programme from becoming a collection of demonstrations without an owner, a cost baseline or an operating result.</p><p>The commercial diagnosis starts with the present cost of delay, rework, leakage or missed opportunity. It records case volume, handling time, error, exception age, customer or partner consequence and the contribution affected. Benefits are modeled against that baseline and replaced by realized evidence only after a controlled deployment.</p><p>This case is a modern operating design. It does not imply that the workflow was historically deployed, that a named enterprise uses it or that modeled impact has been achieved.</p></div><aside class="v3-board-note"><span>Design rule</span><h3>AI earns authority one reversible step at a time.</h3><dl><div><dt>Read</dt><dd>Access only approved sources for the task.</dd></div><div><dt>Prepare</dt><dd>Assemble evidence, draft or scenario.</dd></div><div><dt>Recommend</dt><dd>Explain a permitted next action.</dd></div><div><dt>Execute</dt><dd>Use a named tool only inside approved limits.</dd></div></dl></aside></div></section>
    <section class="v3-case-section dark" id="model"><div class="v3-shell"><header class="v3-case-heading"><span class="v3-label">Operating model</span><h2>Put the agent inside the workflow, with an owner on both sides.</h2><div><p>The business owner defines the outcome, priority logic and economic guardrails. Operations owns the day-to-day queue, service level and exception resolution. Technology owns reliable interfaces, identity, observability and rollback. Data and control owners approve purpose, source access, retention, evaluation and consequential tool permissions.</p><p>The workflow should begin in read-only mode. The agent identifies the case, retrieves evidence and prepares a recommendation. Reviewers compare it with the source records and label the result. Once accuracy, failure modes and economic value are understood, the team can permit selected low-risk tools. Higher-consequence actions remain approval-gated.</p><p>A shared case record keeps the input, policy, source references, model version, recommendation, reviewer decision, action and outcome together. This makes disputes and audits easier, and it creates the evaluation set needed to improve the system without silently changing behavior.</p></div></header>${aiFlowExhibit(item)}</div></section>
    <section class="v3-case-section" id="workflows"><div class="v3-shell"><header class="v3-case-heading"><span class="v3-label">AI agents and automated workflows</span><h2>Specialist tasks, one controlled state machine.</h2><div><p>The intake agent identifies the task and required records. A retrieval or evidence agent gathers approved knowledge and live facts. An analytical agent compares those facts with rules, thresholds or models. A recommendation agent explains the permitted options and their expected operational or commercial effect. A workflow agent routes approval and invokes a named tool only when authorization is present.</p><p>The specific workflow steps are tailored to this case: ${esc(item.workflows.join("; "))}. Each step has a deterministic input and completion state even where a probabilistic model helps interpret the evidence. A confidence score never replaces missing authority or a required source record.</p><p>Exception handling is part of the design. Missing data, conflicting records, low confidence, policy ambiguity and tool failure move to a person with the evidence already assembled. The system should fail closed for money, customer rights, safety, regulated decisions and material partner consequences.</p></div></header><div class="v4-model-panels"><article><span>Prepare</span><h3>Low consequence</h3><p>Classify, summarize, match and draft while preserving source references.</p></article><article><span>Recommend</span><h3>Review required</h3><p>Rank permitted options and show the assumptions, confidence and trade-offs.</p></article><article><span>Act</span><h3>Bounded permission</h3><p>Use a named tool within value, role, policy and rollback limits.</p></article></div></div></section>
    <section class="v3-case-section dark" id="architecture"><div class="v3-shell"><header class="v3-case-heading"><span class="v3-label">Technology and data architecture</span><h2>Knowledge, live facts, workflow state and authority stay separate.</h2><div><p>The architecture begins with enterprise identity and role-based access. Retrieval-augmented generation supplies approved policies, procedures and reference knowledge. APIs supply facts that change, such as stock, price, order state, payment, account status or capacity. An event layer signals that something changed and a workflow store records the case state.</p><p>The authoritative sources for this operating case are ${esc(item.authoritative.join("; "))}. Model prompts and vector indexes are not systems of record. Each material answer or recommendation should carry source references and timestamps so a reviewer can see what the system knew when it acted.</p><p>A policy and tool gateway checks the user, task, allowed source, action, value threshold and required approval before any write. Observability records latency, cost, tool success, model errors and downstream outcome. Evaluation includes task accuracy and business effect, not only language quality.</p></div></header>${aiArchitectureExhibit(item)}</div></section>
    <section class="v3-case-section" id="economics"><div class="v3-shell"><header class="v3-case-heading"><span class="v3-label">Commercial model and KPIs</span><h2>Automation capacity is a cost until the business result changes.</h2><div><p>${esc(item.economics)} The baseline should use actual workflow volume, handling effort, defect, leakage, service consequence and decision delay. Modeled impact then applies conservative adoption, accuracy and retained-review assumptions.</p><p>The cost model includes integration, data preparation, model use, evaluation, monitoring, support, retained human approval and change management. It also values new failure modes: false positives, poor escalation, incorrect action and the time required to remedy them. The net case is the verified benefit less all of those costs.</p><p>KPIs should be read as a linked system: ${esc(item.kpis.join("; "))}. Activity metrics such as generated recommendations or tool calls matter only as diagnostic evidence. The operating result and control outcome determine whether authority should expand.</p></div></header>${aiKpiExhibit(item)}<div class="v4-risk-list"><span>Principal risks</span>${item.risks.map((risk,index)=>`<div><b>${String(index+1).padStart(2,"0")}</b><p>${esc(risk)}</p></div>`).join("")}</div></div></section>
    <section class="v3-case-section dark" id="roadmap"><div class="v3-shell"><header class="v3-case-heading"><span class="v3-label">Implementation roadmap</span><h2>Prove evidence quality before expanding action rights.</h2><div><p>Days 0 to 30 establish the workflow baseline, source ownership, authority map, evaluation set and economic equation. The team selects a narrow case family with enough volume to learn and enough reversibility to operate safely. It documents stop conditions before the first model output reaches a user.</p><p>Days 30 to 90 connect read-only sources and run recommendations in shadow or assisted mode. Reviewers label correctness, missing evidence and unsafe suggestions. The product team measures cycle time, service outcome, override, model cost and the effect on the real operating queue.</p><p>Days 90 to 180 introduce one or two bounded tools with explicit approval and rollback. The sequence for this case is ${esc(item.roadmap.join("; "))}. Wider data, higher values or unattended action require a fresh gate, not an informal configuration change.</p><p>Governance reviews model version, source changes, override patterns, customer or partner harm, access exceptions and realized economics. The system can be scaled, narrowed or paused. A credible AI operating model includes the ability to remove authority when the evidence weakens.</p></div></header>${roadmapExhibit(item.roadmap.slice(0,4),4)}<div class="v4-impact-note"><span>Modeled business impact</span><p>No achieved financial or operating result is claimed. The case defines the baseline, evidence and control required to convert a plausible benefit into a measured result.</p></div></div></section>`
  };
}

export function expansionPages(existingPaths = []) {
  const existing = new Set(existingPaths);
  const pages = [rentPage(), ...aiOperatingCases.map(aiOperatingPage), ...normalizedBase.map(strategyNotePage)];
  return pages.filter(page => !existing.has(page.path));
}

const insightVisual = slug => {
  if (slug.includes("omnichannel")) return `<div class="v4-insight-architecture"><span>Inventory truth</span><i>+</i><span>Commercial rules</span><i>→</i><strong>Profitable fulfilment</strong></div>`;
  if (slug.includes("marketplace-economics")) return `<div class="v4-insight-waterfall"><span style="--w:100%">GMV</span><span style="--w:34%">Revenue</span><i>less transaction cost</i><strong style="--w:16%">Contribution</strong></div>`;
  if (slug.includes("ai-transformation-gcc")) return `<div class="v4-insight-ladder"><span>Workflow</span><span>Evidence</span><span>Bounded action</span><strong>Measured outcome</strong></div>`;
  if (slug.includes("gmv")) return `<div class="v4-insight-waterfall"><span style="--w:100%">GMV</span><span style="--w:38%">Revenue</span><i>less service cost</i><strong style="--w:19%">Contribution</strong></div>`;
  if (slug.includes("seller")) return `<div class="v4-insight-funnel"><span>Registered sellers</span><span>Verified</span><span>Trade-ready offers</span><strong>Repeat contribution</strong></div>`;
  if (slug.includes("margin")) return `<div class="v4-insight-bridge"><span>Margin</span><i>→</i><span>Stock age</span><i>→</i><strong>Cash</strong></div>`;
  if (slug.includes("ai-agents")) return `<div class="v4-insight-ladder"><span>Read</span><span>Prepare</span><span>Recommend</span><strong>Human approval</strong></div>`;
  if (slug.includes("rag")) return `<div class="v4-insight-architecture"><span>Approved knowledge<br><b>RAG</b></span><i>+</i><span>Live facts<br><b>APIs</b></span><i>→</i><strong>Grounded action</strong></div>`;
  if (slug.includes("payment")) return `<div class="v4-insight-waterfall"><span style="--w:100%">Payment volume</span><span style="--w:28%">Gross fees</span><i>less partner and loss</i><strong style="--w:14%">Net revenue</strong></div>`;
  if (slug.includes("warehouse")) return `<div class="v4-insight-bridge"><span>Capacity</span><i>+</i><span>Anchor demand</span><i>−</i><span>Full service cost</span><i>=</i><strong>Contribution</strong></div>`;
  return `<div class="v4-insight-architecture"><span>Demand</span><i>→</i><span>Economics</span><i>→</i><strong>Decision</strong></div>`;
};

export function v4Insights(items) {
  const legacyCategories = ["Marketplace economics", "Marketplace operations", "Retail turnaround", "Commerce models", "Applied AI", "AI architecture", "Payments economics", "Logistics ventures"];
  return `<section class="v4-insights-hero"><div class="v3-shell"><span class="v3-label">Insights</span><h1>Operating ideas with an economic spine.</h1><p>Long-form research and practical notes on the measures, workflows and decisions that determine whether a business model can scale.</p></div></section><section class="v4-insights-grid"><div class="v3-shell">${items.map((item,index)=>`<a class="v4-insight-card" href="/insights/${item.slug}"><div class="copy"><span>${esc(item.category || legacyCategories[Math.max(0,index-3)] || "Operating model")} · ${item.readMinutes || (index < 7 ? 5 : 6)} min read</span><h2>${esc(item.title)}</h2><p>${esc(item.lead)}</p><b>Read insight <i aria-hidden="true">↗</i></b></div><figure aria-label="Visual summary for ${esc(item.title)}">${insightVisual(item.slug)}</figure></a>`).join("")}</div></section><section class="v4-insight-method"><div class="v3-shell"><span class="v3-label">Editorial lens</span><h2>Problem, economics, operating choice, evidence.</h2><p>The writing stays close to how value is created, what it costs to deliver, who owns the decision and what must be measured before scale. Long-form pieces include public sources and further reading.</p></div></section>`;
}

export function v4AiFamily() {
  return `<section class="v4-ai-family"><div class="v3-shell"><header class="v3-section-intro split"><span class="v3-label">AI operating cases</span><h2>Eighteen practical models for commerce, retail, finance and enterprise operations.</h2><p>Each case defines the workflow, authoritative data, human approval, technology, economics, KPIs, risk and a controlled implementation path.</p></header><div class="v4-ai-family-grid">${aiOperatingCases.map((item,index)=>`<a href="${item.href}"><span>${String(index+1).padStart(2,"0")} · ${esc(item.sector)}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><b>Open operating case <i aria-hidden="true">↗</i></b></a>`).join("")}</div></div></section>`;
}
