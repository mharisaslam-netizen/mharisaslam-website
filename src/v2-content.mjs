import { v3Ai, v3Saudi, v3UseLibrary } from "./v3-pilot.mjs";
import { pilotTrack } from "./pilot.mjs";
import { aiOperatingCases, expandedLibraryCases, expansionPages, v4AiFamily, v4Insights } from "./v4-expansion.mjs";
import { executiveHome, executiveProfilePage, executiveSearchPage, familyBusinessPage, operatingRecordPage, operatorNotesPage } from "./executive-positioning.mjs";

export const site = {
  name: "Muhammad Haris Aslam",
  shortName: "Haris Aslam",
  origin: "https://www.mharisaslam.com",
  email: "haris@mharisaslam.com",
  linkedin: "https://www.linkedin.com/in/harisaslam/"
};

export const navigation = [
  ["Home", "/"], ["Operating Record", "/operating-record"],
  ["For Business Owners", "/family-business"], ["Executive Profile", "/executive-profile"],
  ["Operator Notes", "/operator-notes"], ["Contact", "/contact"]
];

const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const link = (href, label, className = "text-link") => `<a class="${className}" href="${href}">${esc(label)} <span aria-hidden="true">→</span></a>`;
const section = (title, content, className = "") => `<section class="section ${className}"><div class="section-heading"><h2>${esc(title)}</h2></div>${content}</section>`;
const grid = items => `<div class="card-grid">${items.join("")}</div>`;
const card = (href, label, title, text, meta = "") => `<a class="work-card" href="${href}"><span class="card-label">${esc(label)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p>${meta ? `<span class="card-meta">${esc(meta)}</span>` : ""}<span class="card-link">View details <span aria-hidden="true">→</span></span></a>`;
const tagRow = items => `<div class="tag-row">${items.map(item => `<span>${esc(item)}</span>`).join("")}</div>`;
const field = (label, text) => `<section class="case-field"><h2>${esc(label)}</h2><p>${esc(text)}</p></section>`;
const diagram = (title, items, note = "") => `<figure class="concept-visual"><figcaption>${esc(title)}</figcaption><div class="visual-flow">${items.map((item, index) => `<div class="visual-node"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(item)}</strong></div>`).join("")}</div>${note ? `<p>${esc(note)}</p>` : ""}</figure>`;

const visualFigure = (kind, title, body, note = "", compact = false) => `<figure class="visual-module ${kind}${compact ? " is-compact" : ""}" role="img" aria-label="${esc(title)}"><figcaption>${esc(title)}</figcaption>${body}${note ? `<p class="visual-note">${esc(note)}</p>` : ""}</figure>`;
const journeyVisual = (title, items, note = "", compact = false) => visualFigure("journey-module", title, `<div class="journey-viz">${items.map((item, index) => `<div class="journey-step"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(item)}</strong></div>`).join("")}</div>`, note, compact);
const stackVisual = (title, items, note = "", compact = false) => visualFigure("stack-module", title, `<div class="stack-viz">${items.map((item, index) => `<div class="stack-layer"><span>${String(items.length - index).padStart(2, "0")}</span><strong>${esc(item)}</strong></div>`).join("")}</div>`, note, compact);
const bridgeVisual = (title, items, note = "Conceptual bridge, not to scale.", compact = false) => visualFigure("bridge-module", title, `<div class="bridge-viz">${items.map((item, index) => `<div class="bridge-item bridge-${index + 1}"><span>${index === 0 ? "Base" : index === items.length - 1 ? "Result" : "Adjust"}</span><strong>${esc(item)}</strong></div>`).join("")}</div>`, note, compact);
const networkVisual = (title, center, items, note = "", compact = false) => visualFigure("network-module", title, `<div class="network-viz"><div class="network-hub">${esc(center)}</div>${items.map((item, index) => `<div class="network-node node-${index + 1}">${esc(item)}</div>`).join("")}</div>`, note, compact);
const marketVisual = (title, origin, destination, lanes, note = "", compact = false) => visualFigure("market-module", title, `<div class="market-viz"><div class="market-place"><span>Origin</span><strong>${esc(origin)}</strong></div><div class="market-route">${lanes.map(item => `<span>${esc(item)}</span>`).join("")}</div><div class="market-place destination"><span>Market</span><strong>${esc(destination)}</strong></div></div>`, note, compact);
const authorityVisual = (title, items, note = "", compact = false) => visualFigure("authority-module", title, `<div class="authority-viz">${items.map((item, index) => `<div class="authority-step step-${index + 1}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(item)}</strong></div>`).join("")}</div>`, note, compact);
const interfaceVisual = (title, status, items, note = "", compact = false) => visualFigure("interface-module", title, `<div class="interface-shell"><div class="interface-top"><span class="interface-dots" aria-hidden="true">● ● ●</span><strong>${esc(status)}</strong></div><div class="interface-grid">${items.map((item, index) => `<div class="interface-panel"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(item)}</strong><i></i><i></i></div>`).join("")}</div></div>`, note, compact);
const valueMapVisual = (title, items, note = "", compact = false) => visualFigure("value-map-module", title, `<div class="value-map">${items.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(item)}</strong></div>`).join("")}</div>`, note, compact);

const prose = paragraphs => `<div class="report-prose">${paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}</div>`;
const bulletList = items => `<ul class="report-list">${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
const reportSection = (id, number, title, content, className = "") => `<section class="report-section ${className}" id="${id}"><div class="report-section-head"><span>${String(number).padStart(2, "0")}</span><h2>${esc(title)}</h2></div><div class="report-section-body">${content}</div></section>`;
const reportCallout = (label, title, text, className = "") => `<aside class="report-callout ${className}"><span>${esc(label)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></aside>`;
const reportTable = (caption, headers, rows) => `<div class="report-table-wrap"><table class="report-table"><caption>${esc(caption)}</caption><thead><tr>${headers.map(header => `<th scope="col">${esc(header)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, index) => `<${index === 0 ? "th scope=\"row\"" : "td"}>${esc(cell)}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const exhibitFrame = (number, title, body, note = "", className = "") => `<figure class="report-exhibit ${className}" role="img" aria-label="Exhibit ${number}: ${esc(title)}"><figcaption><span>Exhibit ${String(number).padStart(2, "0")}</span><strong>${esc(title)}</strong></figcaption>${body}${note ? `<p class="exhibit-note">${esc(note)}</p>` : ""}</figure>`;
const journeyExhibit = (number, title, items, note = "") => exhibitFrame(number, title, `<div class="exhibit-journey">${items.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(typeof item === "string" ? item : item.title)}</strong>${typeof item === "string" || !item.detail ? "" : `<p>${esc(item.detail)}</p>`}</div>`).join("")}</div>`, note, "exhibit-journey-wrap");
const ecosystemExhibit = (number, title, center, parties, note = "") => exhibitFrame(number, title, `<div class="exhibit-ecosystem"><div class="ecosystem-center"><span>Orchestrator</span><strong>${esc(center)}</strong></div>${parties.map((party, index) => `<div class="ecosystem-party party-${index + 1}"><span>${esc(party.label)}</span><strong>${esc(party.title)}</strong><p>${esc(party.detail)}</p></div>`).join("")}</div>`, note, "exhibit-ecosystem-wrap");
const waterfallExhibit = (number, title, items, note = "") => exhibitFrame(number, title, `<div class="exhibit-waterfall">${items.map((item, index) => `<div class="waterfall-column ${item.kind || "add"}" style="--bar:${item.height || 60}%"><span>${esc(item.kind === "cost" ? "Cost" : index === items.length - 1 ? "Result" : "Value")}</span><i></i><strong>${esc(item.label)}</strong></div>`).join("")}</div>`, note, "exhibit-waterfall-wrap");
const equationExhibit = (number, title, income, costs, result, note = "") => exhibitFrame(number, title, `<div class="exhibit-equation"><div class="equation-group positive"><span>Value earned</span>${income.map(item => `<strong>${esc(item)}</strong>`).join("")}</div><div class="equation-symbol">−</div><div class="equation-group negative"><span>Cost to serve</span>${costs.map(item => `<strong>${esc(item)}</strong>`).join("")}</div><div class="equation-symbol">=</div><div class="equation-result"><span>Decision metric</span><strong>${esc(result)}</strong></div></div>`, note, "exhibit-equation-wrap");
const architectureExhibit = (number, title, layers, note = "") => exhibitFrame(number, title, `<div class="exhibit-architecture">${layers.map((layer, index) => `<div class="architecture-layer layer-${index + 1}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(layer.title)}</strong><div>${layer.items.map(item => `<i>${esc(item)}</i>`).join("")}</div></div>`).join("")}</div>`, note, "exhibit-architecture-wrap");
const swimlaneExhibit = (number, title, lanes, note = "") => exhibitFrame(number, title, `<div class="exhibit-swimlanes">${lanes.map(lane => `<div class="swimlane"><strong>${esc(lane.title)}</strong><div>${lane.steps.map(step => `<span>${esc(step)}</span>`).join("")}</div></div>`).join("")}</div>`, note, "exhibit-swimlane-wrap");
const kpiExhibit = (number, title, groups, note = "") => exhibitFrame(number, title, `<div class="exhibit-kpis">${groups.map(group => `<div><span>${esc(group.title)}</span>${group.metrics.map(metric => `<strong>${esc(metric)}</strong>`).join("")}</div>`).join("")}</div>`, note, "exhibit-kpi-wrap");
const roadmapExhibit = (number, title, phases, note = "") => exhibitFrame(number, title, `<div class="exhibit-roadmap">${phases.map((phase, index) => `<div><span>${esc(phase.period)}</span><strong>${esc(phase.title)}</strong><p>${esc(phase.detail)}</p><i>${String(index + 1).padStart(2, "0")}</i></div>`).join("")}</div>`, note, "exhibit-roadmap-wrap");
const timelineExhibit = (number, title, items, note = "") => exhibitFrame(number, title, `<div class="exhibit-timeline">${items.map((item, index) => `<div><span>${esc(item.period)}</span><strong>${esc(item.title)}</strong><p>${esc(item.detail)}</p><i>${String(index + 1).padStart(2, "0")}</i></div>`).join("")}</div>`, note, "exhibit-timeline-wrap");
const reportContents = items => `<nav class="report-contents" aria-label="On this page"><span>On this page</span><ol>${items.map(item => `<li><a href="#${item.id}"><b>${String(item.number).padStart(2, "0")}</b>${esc(item.title)}</a></li>`).join("")}</ol></nav>`;
const reportBlock = (title, content) => `<div class="report-block"><h3>${esc(title)}</h3>${content}</div>`;

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
    slug: "salman-miraq", name: "Salman Corporation / Miraq Lifestyle", role: "Operating and investment leadership", geography: "Oman and GCC", period: "2023 to 2025",
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
  }
];

const trackDeep = {
  "roumaan": {
    context: [
      "Roumaan was built in Oman between 2014 and 2018, when broad online retail was still early and customers could not assume that a digital catalogue reflected stock that could actually be delivered. The opportunity was larger than putting products on a website. The business needed to make assortment, availability, payment, order handling and fulfilment work as one promise.",
      "The operating history that can be stated publicly is first-party digital commerce. Roumaan traded online, recorded orders and built a customer base. Later marketplace planning explored how third-party supply could extend the proposition, but that work is kept separate from the results of the original retail operation."
    ],
    problem: [
      "A multi-category proposition creates an immediate coordination problem. Each category has different product data, replenishment patterns, delivery constraints and return behaviour. A broad catalogue can attract demand, but poor availability or weak order handling quickly turns range into a service liability.",
      "The commercial problem was therefore not traffic alone. Each completed order had to carry enough product margin to absorb payment, picking, delivery, returns, customer care and acquisition. Growth that increased cancellations or service work without improving contribution would have made the business busier without making it stronger."
    ],
    work: [
      "Haris shaped the proposition, category choices and operating model, then worked through the daily decisions behind catalogue quality, merchandising, order flow and fulfilment. The business needed a single view of what was sellable, what had been ordered and what could be completed within the service promise shown to the customer.",
      "The model was deliberately practical. Central control over catalogue and order operations reduced ambiguity while the customer proposition was still being proved. Marketplace expansion could only make sense after seller admission, stock truth, commissions, service responsibility and settlement had their own operating design."
    ],
    commercial: [
      "The relevant equation was completed-order contribution: selling price less product cost, payment cost, fulfilment, delivery, returns, service recovery and attributable acquisition. Revenue and order count were useful signals, but neither could answer whether a category or customer cohort earned cash.",
      "Working capital sat beside the order P&L. Inventory bought too early could make the digital range look stronger while locking cash into slow stock. The commercial review therefore needed category margin, stock age, sell-through and fulfilment quality in the same conversation."
    ],
    operating: [
      "Category and merchandising decisions sat close to stock and demand. Order operations coordinated availability, customer communication and fulfilment. Service issues fed back into catalogue and supplier decisions rather than remaining isolated in customer care.",
      "A modern version would preserve those accountabilities while using catalogue automation, live inventory APIs and exception queues to reduce manual work. People would still own price, supplier commitments, refunds and any decision that changes the customer promise."
    ],
    technology: [
      "The original operation used a commerce content layer, product catalogue, customer records and order reporting. The technology supported the retail model; it did not replace the work required to maintain product information, confirm stock and complete orders.",
      "The current architecture would separate product, inventory, price, order and customer-service records behind APIs. AI could identify missing attributes, classify enquiries and summarize exceptions, but the source systems would remain authoritative for stock, money and order status."
    ],
    results: [
      "Roumaan operated as a live online retailer with recorded orders and customer registrations. That is the public evidence used on this site. No unpublished revenue, profit, market-share or third-party marketplace result is presented.",
      "The lasting operating lesson was direct: digital commerce is a trading and fulfilment business before it is a traffic business. The catalogue is credible only when the operation can fulfil the promise attached to it."
    ],
    lessons: ["Build stock truth before catalogue scale.", "Measure completed-order contribution, not checkout activity alone.", "Treat service failures as commercial data.", "Keep first-party and marketplace economics separate.", "Let automation prepare work, while operators retain consequential decisions."],
    timeline: [
      { period: "Build", title: "Proposition and catalogue", detail: "Define the customer promise, categories and first operating controls." },
      { period: "Trade", title: "Orders and fulfilment", detail: "Connect availability, order handling, delivery and customer communication." },
      { period: "Learn", title: "Category economics", detail: "Review margin, stock age, service failures and repeat behaviour." },
      { period: "Extend", title: "Marketplace planning", detail: "Design seller, commission and settlement logic separately from first-party retail." }
    ],
    metrics: [
      { title: "Demand", metrics: ["Qualified sessions", "Category conversion", "Repeat customers"] },
      { title: "Trade", metrics: ["Completed orders", "Cancellation rate", "Return rate"] },
      { title: "Economics", metrics: ["Order contribution", "Acquisition payback", "Stock turn"] },
      { title: "Service", metrics: ["On-time completion", "Care contacts per order", "Refund cycle"] }
    ]
  },
  "salman-miraq": {
    context: [
      "This chapter combined operating leadership, investment work and family-business decision making across Oman and wider GCC opportunities. The starting point was a retail base facing margin pressure, ageing inventory and competing demands on cash. At the same time, distribution and venture opportunities created a legitimate question about where new capital should go.",
      "The work did not treat turnaround and growth as separate conversations. A new venture could not be judged only on market potential while the core business carried unresolved stock and cash issues. The same discipline had to apply to store economics, portfolio choices, regional rights and any recapitalization proposal."
    ],
    problem: [
      "Retail reporting can hide the difference between sales, gross margin and cash. A category may look profitable before markdown and occupancy. Inventory may appear as an asset while losing relevance and absorbing working capital. Expansion can then add fixed cost before the existing economics are stable.",
      "The governance problem was equally important. Family businesses often hold operating history, supplier relationships, property decisions and ownership objectives in the same room. The transformation needed a fact base that supported decisions without pretending that every choice was purely financial."
    ],
    work: [
      "Haris connected store and category performance to stock, procurement, cash and governance. The review moved beyond top-line sales into product margin, stock age, supplier terms, channel overlap and the fixed cost required to keep each activity operating.",
      "Portfolio work examined which activities belonged in the core, which required repair, and which new ideas deserved a separate investment case. Distribution, GCC expansion and venture formation were evaluated through explicit gates covering rights, landed economics, capital needs, operating capacity and downside exposure."
    ],
    commercial: [
      "The core retail test was margin to cash. A price or buying decision mattered only if it improved full contribution and released working capital after markdown, occupancy, labour and handling. The venture test was different: contribution after product, channel, logistics and local overhead, measured against the cash required before sell-through.",
      "Recapitalization and investment assessment therefore sat downstream of the operating facts. Capital could support a viable reset or a proven growth option, but it could not substitute for category economics, stock discipline or accountable execution."
    ],
    operating: [
      "The operating rhythm brought finance, procurement, category and store perspectives into one review. Each issue needed an owner, a decision and a time-bound measure. Stock actions were not allowed to disappear into a general sales target, and new ventures were not allowed to borrow credibility from the existing group without a separate case.",
      "Governance separated recommendation, approval and execution. Management prepared operating evidence. Owners and boards retained capital authority. Venture and market-entry options progressed only when commercial rights, operating capacity and downside limits were understood."
    ],
    technology: [
      "The work used management reporting, P&L analysis, inventory data, e-commerce assessment and ERP considerations. The practical gap was less about adding another dashboard than reconciling sales, margin, inventory and cash into one decision view.",
      "A current control layer would combine POS, inventory, procurement and finance data in a contribution model. AI could summarize exceptions, cluster ageing stock and prepare scenarios. It would not approve markdowns, supplier commitments, investment or financing."
    ],
    results: [
      "The public evidence supports a commercial and operating reset, investment and recapitalization assessment, portfolio decisions and venture formation work. It does not support a claimed group-wide profit uplift, inventory reduction percentage or completed GCC expansion result.",
      "The useful outcome is the decision architecture itself: repair the core with margin and cash evidence, separate portfolio choices, and require new ventures to pass their own investment gates."
    ],
    lessons: ["Turn margin into cash before calling a retail reset successful.", "Separate core repair from venture enthusiasm.", "Make stock age visible beside the P&L.", "Put ownership and decision rights into the operating rhythm.", "Use capital to fund a coherent plan, not to postpone operating choices."],
    timeline: [
      { period: "Diagnose", title: "Core retail economics", detail: "Reconcile margin, overhead, stock age and cash pressure." },
      { period: "Reset", title: "Management rhythm", detail: "Assign owners and review actions through one operating fact base." },
      { period: "Choose", title: "Portfolio and capital", detail: "Separate repair, hold, exit and investment decisions." },
      { period: "Build", title: "Venture and GCC options", detail: "Test rights, economics and operating capacity before scale." }
    ],
    metrics: [
      { title: "Retail", metrics: ["Store contribution", "Category margin", "Markdown cost"] },
      { title: "Working capital", metrics: ["Stock age", "Sell-through", "Supplier days"] },
      { title: "Portfolio", metrics: ["Cash required", "Downside case", "Investment gate"] },
      { title: "Governance", metrics: ["Action closure", "Decision latency", "Owner accountability"] }
    ]
  },
  "floward-oman": {
    context: [
      "Floward Oman was a country-launch assignment for a digital gifting business. The local operation had to translate a regional proposition into an Oman offer that customers could trust on ordinary days and on the occasions when demand, supplier pressure and delivery complexity all rose together.",
      "Gifting is not a conventional replenishment business. The product is perishable, the delivery time is part of the promise, and the recipient is often different from the buyer. Assortment, presentation, message accuracy and last-mile execution all affect the same order."
    ],
    problem: [
      "A market launch can produce a website before it produces an operation. The harder work was local assortment, supplier readiness, quality standards, delivery capacity, trading calendars, acquisition and the daily review required to keep them synchronized.",
      "Occasion peaks made the economics less forgiving. More orders could improve density, but they could also create cancellations, substitution, service recovery and costly delivery failure. The commercial model had to follow completed orders and contribution, not demand captured at checkout."
    ],
    work: [
      "Haris built the local commercial and fulfilment setup. That included local category choices, trading activity, campaign coordination, supplier relationships, delivery execution and the operating rhythm that connected daily demand with capacity.",
      "The country role sat between regional platform capability and local market reality. Local decisions had to stay close to customer behaviour and supplier capacity while preserving the service proposition of the wider business."
    ],
    commercial: [
      "The order P&L began with product margin, then absorbed packaging, payment, delivery, cancellation, substitution, customer care and acquisition. Occasion trading added a capacity question: how much demand could be accepted without paying for service failure later.",
      "The useful management view combined demand, available assortment, fulfilment capacity and completed-order contribution. Marketing efficiency could not be read independently from stock readiness and delivery performance."
    ],
    operating: [
      "The local model linked trading, suppliers, fulfilment and customer demand through a country operation. Daily decisions covered what to promote, what could be fulfilled, where capacity was tight and which service issues required immediate commercial action.",
      "Peak preparation needed a longer cadence. Assortment, supplier commitments, staffing and delivery capacity had to be locked progressively, with clear cut-offs and fallback rules. On the day, the operation needed one exception view rather than separate functional reports."
    ],
    technology: [
      "The operating stack included commerce catalogue, order and fulfilment systems, performance reporting and local workflows. Technology made demand and orders visible, but local teams still had to maintain product readiness and execute the physical service.",
      "A current setup would add live supplier availability, capacity forecasting, route APIs and a supervised exception layer. AI could prepare demand scenarios or classify service issues. It would not promise unavailable stock or change a customer order without policy and approval."
    ],
    results: [
      "The verified public result used here is the establishment of the Oman operation and its local commercial and fulfilment model. No market-share, revenue or profitability figure is used on this site.",
      "The operating lesson is that a country launch is complete only when local supply, fulfilment and commercial cadence work together. A regional brand and platform provide leverage, but the customer experiences the local operation."
    ],
    lessons: ["Build the local supply and fulfilment system alongside demand.", "Plan occasion capacity before marketing is committed.", "Measure completed-order contribution after service recovery.", "Give the country team clear local decision rights.", "Use one exception view across trading, supply and delivery."],
    timeline: [
      { period: "0", title: "Market setup", detail: "Establish the local proposition, supply base and operating responsibilities." },
      { period: "Launch", title: "Assortment and fulfilment", detail: "Connect sellable range, order flow and last-mile execution." },
      { period: "Trade", title: "Occasion calendar", detail: "Coordinate campaigns with supplier and delivery capacity." },
      { period: "Rhythm", title: "Daily operating review", detail: "Manage demand, exceptions, service and contribution together." }
    ],
    metrics: [
      { title: "Demand", metrics: ["Qualified traffic", "Conversion", "Occasion mix"] },
      { title: "Supply", metrics: ["Sellable range", "Substitution rate", "Supplier readiness"] },
      { title: "Fulfilment", metrics: ["On-time completion", "Cancellation rate", "Delivery cost"] },
      { title: "Economics", metrics: ["Order contribution", "Acquisition payback", "Service recovery cost"] }
    ]
  },
  "upapp-factory": {
    context: [
      "UpApp Factory was a founder-led product studio serving web and mobile requirements from Oman into regional delivery contexts. The model depended on a small core team, selected delivery partners and disciplined handover rather than a large permanent development bench.",
      "Custom-product work often looks attractive at contract signature and deteriorates during delivery. Ambiguous requirements, added scope, partner cost, rework and open-ended support can consume the margin before the product reaches the client."
    ],
    problem: [
      "The operating challenge was to turn a business request into a product that could be priced, built, tested and supported. Clients needed flexibility, but the studio needed a clear definition of what was included, which decisions were still open and what evidence would count as acceptance.",
      "Regional delivery added coordination. Client context, partner availability and handover expectations varied, so the studio model needed consistent gates without pretending every engagement was identical."
    ],
    work: [
      "Haris worked across demand qualification, requirements, product design, delivery planning, testing, deployment and client handover. The commercial conversation began before development by testing whether the brief was specific enough to estimate and whether the intended product justified the delivery effort.",
      "A lean core coordinated specialist capacity rather than carrying every skill permanently. This kept the cost base variable, but it made scope ownership, quality review and release control more important."
    ],
    commercial: [
      "Project contribution was contract value less internal delivery time, partner cost, hosting or tooling, rework, project management and the support obligation after launch. A project could appear profitable until late changes or unresolved defects moved effort beyond the priced scope.",
      "The practical controls were milestone billing, change discipline, acceptance criteria and a clear support boundary. The model worked only when client decisions arrived in time and delivery capacity matched the promise made during sale."
    ],
    operating: [
      "The delivery chain moved from qualified requirement to product design, development, testing, deployment and support. Each gate produced a specific artifact or decision, reducing the chance that uncertainty simply moved downstream.",
      "The core team owned client context, scope and quality. Delivery partners owned agreed work packages. The client owned timely decisions and acceptance. Support began from a documented release rather than an informal handover."
    ],
    technology: [
      "The work covered web and mobile development, requirements, project planning, testing and release workflows. Technology choices followed the client context and delivery scope rather than a single product platform.",
      "A current studio would use shared component libraries, automated testing, cloud deployment and AI-assisted documentation or test preparation. Code, security and acceptance would still receive accountable human review."
    ],
    results: [
      "The studio delivered contracted digital products across more than one market context and completed client handovers. Client performance gains, total project count, studio revenue and profitability are not published.",
      "The main operating lesson was that a product studio sells managed uncertainty. Scope, decision speed, quality and support shape the economics as much as the development rate."
    ],
    lessons: ["Qualify the business requirement before pricing the build.", "Turn uncertainty into explicit delivery gates.", "Protect contribution through scope and acceptance discipline.", "Keep partner capacity variable but quality ownership internal.", "Treat handover and support as designed parts of the product."],
    timeline: [
      { period: "Qualify", title: "Business requirement", detail: "Clarify the user, outcome, constraints and decision owner." },
      { period: "Design", title: "Scope and product", detail: "Translate the requirement into an agreed release and acceptance plan." },
      { period: "Build", title: "Delivery and test", detail: "Coordinate specialist capacity, quality and client decisions." },
      { period: "Release", title: "Deployment and support", detail: "Complete acceptance, documentation, handover and support boundaries." }
    ],
    metrics: [
      { title: "Pipeline", metrics: ["Qualified briefs", "Proposal conversion", "Decision time"] },
      { title: "Delivery", metrics: ["Milestone variance", "Defect escape", "Rework hours"] },
      { title: "Economics", metrics: ["Project contribution", "Partner cost", "Cash collection"] },
      { title: "Handover", metrics: ["Acceptance cycle", "Open issues", "Support demand"] }
    ]
  }
};

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
const trackPath = item => `/track-record/${item.slug}`;

const supportingCaseMetrics = item => ({
  "oman-bank-value-wallet": [
    { title: "Customer use", metrics: ["Eligible-wallet views", "Offer activation", "Repeat card use"] },
    { title: "Economics", metrics: ["Incremental spend", "Benefit cost", "Net contribution"] },
    { title: "Control", metrics: ["Consent coverage", "Eligibility accuracy", "Complaints"] }
  ],
  "partner-retail-gifting-network": [
    { title: "Demand", metrics: ["Attachment rate", "Average add-on value", "Repeat gifting"] },
    { title: "Service", metrics: ["Custody exceptions", "On-time delivery", "Care contacts"] },
    { title: "Economics", metrics: ["Service contribution", "Pickup cost", "Partner share"] }
  ],
  "multi-category-digital-commerce": [
    { title: "Trade", metrics: ["Completed orders", "Category conversion", "Repeat rate"] },
    { title: "Service", metrics: ["Stock accuracy", "Cancellation rate", "On-time fulfilment"] },
    { title: "Economics", metrics: ["Order contribution", "Acquisition payback", "Stock turn"] }
  ],
  "agent-led-social-commerce": [
    { title: "Liquidity", metrics: ["Active merchant-agent pairs", "Trade-ready offers", "Completed orders"] },
    { title: "Trust", metrics: ["Attribution accuracy", "Dispute rate", "Payout accuracy"] },
    { title: "Economics", metrics: ["Take rate", "Agent cost", "Order contribution"] }
  ],
  "retail-group-transformation": [
    { title: "Retail", metrics: ["Store contribution", "Category margin", "Markdown cost"] },
    { title: "Cash", metrics: ["Stock age", "Sell-through", "Cash released"] },
    { title: "Management", metrics: ["Action closure", "Forecast accuracy", "Decision time"] }
  ],
  "retail-clearance-stock-profitability": [
    { title: "Stock", metrics: ["Units cleared", "Age profile", "Cash recovered"] },
    { title: "Trade", metrics: ["Markdown depth", "Basket mix", "Return rate"] },
    { title: "P&L", metrics: ["Gross profit", "Store contribution", "EBITDA"] }
  ],
  "payments-embedded-finance-growth": [
    { title: "Volume", metrics: ["Active clients", "Transactions", "Payment value"] },
    { title: "Revenue", metrics: ["Gross fees", "Partner share", "Net revenue"] },
    { title: "Risk and service", metrics: ["Loss rate", "Exceptions", "Support cost"] }
  ],
  "warehouse-working-capital-3pl": [
    { title: "Capacity", metrics: ["Usable positions", "Occupancy", "Throughput"] },
    { title: "Service", metrics: ["Pick accuracy", "On-time dispatch", "Claims"] },
    { title: "Economics", metrics: ["Cash released", "Cost per order", "Client contribution"] }
  ],
  "saudi-market-entry-distribution": [
    { title: "Demand", metrics: ["Qualified accounts", "Pilot sell-through", "Repeat orders"] },
    { title: "Economics", metrics: ["Landed margin", "Channel cost", "Cash cycle"] },
    { title: "Readiness", metrics: ["Rights secured", "Partner capacity", "Compliance gates"] }
  ],
  "enterprise-software-marketplace": [
    { title: "Supply", metrics: ["Verified vendors", "Trade-ready offers", "Provisioning accuracy"] },
    { title: "Customer", metrics: ["Quote conversion", "Renewal rate", "Service attachment"] },
    { title: "Economics", metrics: ["Licence margin", "Platform fees", "Support cost"] }
  ],
  "heritage-lifestyle-commerce": [
    { title: "Place", metrics: ["Qualified footfall", "Repeat visits", "Dwell time"] },
    { title: "Tenant", metrics: ["Sales density", "Occupancy quality", "Event conversion"] },
    { title: "Economics", metrics: ["Rent yield", "Programme cost", "Pilot payback"] }
  ],
  "digital-wedding-platform": [
    { title: "Guest", metrics: ["Response rate", "Change rate", "Check-in success"] },
    { title: "Service", metrics: ["Concierge hours", "Message cost", "Recovery cases"] },
    { title: "Economics", metrics: ["Package value", "Service margin", "Cash collection"] }
  ],
  "enterprise-ai-transformation-practice": [
    { title: "Demand", metrics: ["Qualified mandates", "Diagnostic conversion", "Pipeline coverage"] },
    { title: "Delivery", metrics: ["Cycle time", "Specialist use", "Benefit evidence"] },
    { title: "Economics", metrics: ["Blended contribution", "Fixed-cost cover", "Cash collection"] }
  ],
  "aeofind": [
    { title: "Visibility", metrics: ["Intent coverage", "Source accuracy", "Answer presence"] },
    { title: "Action", metrics: ["Verified gaps", "Fix completion", "Refresh cycle"] },
    { title: "Commercial", metrics: ["Qualified visits", "Assisted pipeline", "Cost per action"] }
  ],
  "ai-commerce-command-center": [
    { title: "Decision", metrics: ["Exceptions surfaced", "Approval time", "Action accuracy"] },
    { title: "Operation", metrics: ["Care cost", "Stock exceptions", "Catalogue quality"] },
    { title: "Economics", metrics: ["Operator time", "Contribution change", "Recovery cost"] }
  ],
  "career-runway-ai": [
    { title: "Use", metrics: ["Completed assessments", "Scenario comparisons", "Return visits"] },
    { title: "Trust", metrics: ["Calculation accuracy", "Assumption clarity", "Deletion success"] },
    { title: "Decision", metrics: ["Trade-offs reviewed", "Runway understood", "User ownership"] }
  ]
}[item.slug] || [
  { title: "Demand", metrics: ["Qualified activity", "Conversion", "Repeat use"] },
  { title: "Operation", metrics: ["Cycle time", "Service quality", "Exceptions"] },
  { title: "Economics", metrics: ["Net revenue", "Cost to serve", "Contribution"] }
]);

const supportingCaseRisks = item => ({
  "oman-bank-value-wallet": [["Eligibility", "A value explanation must never override bank product rules."], ["Consent", "Intent and transaction data need explicit purpose and retention rules."], ["Economics", "Rewards can increase activity while reducing net contribution."]],
  "partner-retail-gifting-network": [["Custody", "The retail item passes through more than one operator."], ["Service", "A failed pickup can break the full gifting promise."], ["Integration", "The pilot must work without forcing deep retailer system changes."]],
  "multi-category-digital-commerce": [["Availability", "Catalogue breadth can outrun reliable stock."], ["Cash", "Slow inventory can absorb the benefit of sales growth."], ["Service", "Category complexity can increase cancellation and return cost."]],
  "agent-led-social-commerce": [["Attribution", "Agents need evidence for why an order earned commission."], ["Payout", "Ledger errors damage trust quickly."], ["Liquidity", "Registrations do not guarantee active trading pairs."]],
  "retail-group-transformation": [["Data", "Store, inventory and finance records may not reconcile."], ["Behaviour", "Actions fail when owners and deadlines remain vague."], ["Capital", "New ventures can distract from unresolved core economics."]],
  "retail-clearance-stock-profitability": [["Margin", "Markdown can release cash while deepening the store loss."], ["Signal", "A short pilot may reflect season or location rather than the model."], ["Brand", "Clearance activity can change customer price expectations."]],
  "payments-embedded-finance-growth": [["Regulation", "Permissions and client use cases differ by market."], ["Loss", "Fraud and operational error can erase a thin fee pool."], ["Volume", "Transaction growth can hide weak net revenue."]],
  "warehouse-working-capital-3pl": [["Capacity", "Space is not spare if the retail operation needs it seasonally."], ["Service", "Claims and failed delivery can change client contribution."], ["Cash", "External revenue may arrive after service cost is paid."]],
  "saudi-market-entry-distribution": [["Rights", "Representation must be documented and enforceable."], ["Landed cost", "Import and channel cost can erase headline margin."], ["Fixed cost", "A local setup can precede proven sell-through."]],
  "enterprise-software-marketplace": [["Entitlement", "Every offer needs verified vendor or distributor rights."], ["Provisioning", "A licence error creates service and financial exposure."], ["Working capital", "Renewal and reseller terms can create cash strain."]],
  "heritage-lifestyle-commerce": [["Demand", "Programming can raise visits without improving tenant sales."], ["Capital", "Physical investment should follow trading evidence."], ["Tenant mix", "Occupancy alone can weaken the customer proposition."]],
  "digital-wedding-platform": [["Privacy", "Guest data requires strict purpose and access controls."], ["Messaging", "Incorrect or repeated messages create reputational harm."], ["Service", "Event-day recovery capacity is part of the product."]],
  "enterprise-ai-transformation-practice": [["Pipeline", "A permanent bench can form before signed demand."], ["Independence", "Specialists must work within client security and approval."], ["Value", "A pilot can ship without changing the business measure."]],
  "aeofind": [["Sampling", "AI answers vary by prompt, model and time."], ["Claims", "Generated recommendations need source review."], ["Attribution", "Visibility does not automatically equal qualified demand."]],
  "ai-commerce-command-center": [["Authority", "Agents must not change money, price or stock without permission."], ["Source data", "Bad operational facts produce confident bad recommendations."], ["Adoption", "A new control layer can add work if it does not replace an existing queue."]],
  "career-runway-ai": [["Privacy", "Financial inputs need strict access and deletion controls."], ["Explanation", "An LLM must not alter deterministic calculations."], ["Dependence", "The product supports a decision; it does not make one."]]
}[item.slug] || [["Evidence", "The pilot needs an agreed baseline."], ["Economics", "Activity can grow without contribution."], ["Ownership", "Every consequential decision needs a named person."]]);

const supportingCaseRoadmap = item => {
  const design = item.type === "Operating case" || item.type === "Operating pilot" ? "Reconcile the operating baseline and choose one constrained improvement." : "Confirm the customer, commercial and control assumptions with one accountable sponsor.";
  return [
    { period: "0 to 30 days", title: "Baseline and design", detail: design },
    { period: "30 to 90 days", title: "Controlled pilot", detail: `Test ${item.visual.slice(0, 2).join(" and ").toLowerCase()} with a limited cohort and explicit stop conditions.` },
    { period: "90 to 180 days", title: "Scale decision", detail: "Compare service, economics and control evidence before adding markets, fixed cost or broader authority." }
  ];
};

const supportingArchitecture = item => architectureExhibit(3, "Technology and data architecture", [
  { title: "Experience", items: [item.sector, "Customer or operator interface"] },
  { title: "Workflow", items: item.visual.slice(0, 2) },
  { title: "Systems of record", items: item.visual.slice(2).length ? item.visual.slice(2) : ["Transaction record", "Operating ledger"] },
  { title: "Control", items: ["Permissions", "Audit", "Measurement"] }
], "Operational facts stay in source systems. AI prepares or ranks work inside defined permissions.");

const supportingEconomics = item => equationExhibit(2, "Commercial equation", [item.visual[0], item.visual[1] || "Qualified demand"], ["Acquisition and service", "Operating and control cost"], item.impactLabel === "Business Impact" ? "Verified operating result" : "Modeled contribution", "The exhibit shows the decision logic, not achieved financial values.");

const supportingCaseBody = item => {
  const contents = [
    { id: "executive-summary", number: 1, title: "Executive summary" },
    { id: "context", number: 2, title: "Business context and problem" },
    { id: "opportunity", number: 3, title: "Commercial opportunity" },
    { id: "journey", number: 4, title: "Journey and solution design" },
    { id: "economics", number: 5, title: "Commercial model and economics" },
    { id: "technology", number: 6, title: "Technology, data and AI" },
    { id: "operating-model", number: 7, title: "Operating model and governance" },
    { id: "implementation", number: 8, title: "Implementation and measurement" },
    { id: "risks", number: 9, title: "Risks and dependencies" },
    { id: "impact", number: 10, title: item.impactLabel }
  ];
  const metrics = supportingCaseMetrics(item);
  const roadmap = supportingCaseRoadmap(item);
  const risks = supportingCaseRisks(item);
  return `${tagRow([item.sector, item.geography, item.type])}<div class="report-layout supporting-report">${reportContents(contents)}<article class="report-main">${reportSection("executive-summary", 1, "Executive summary", `<div class="report-opening">${prose([item.overview, item.impact])}${reportCallout(item.impactLabel === "Business Impact" ? "Evidence" : "Business case", item.impactLabel, item.impact, item.impactLabel === "Modeled Business Impact" ? "modeled" : "")}</div>`)}${reportSection("context", 2, "Business context and problem", `<div class="report-split">${reportBlock("Business context", prose([`${item.sector} in ${item.geography} creates a coordination problem across customer demand, operating ownership and commercial economics. The case is framed around the specific model described here, without extending its evidence beyond the source material.`]))}${reportBlock("Business problem", prose([item.problem]))}</div>`, "tint-band")}${reportSection("opportunity", 3, "Commercial opportunity", `<div class="report-split">${reportBlock("Value pool", prose([item.commercial]))}${reportBlock("Decision test", prose([`The model should progress only when the activity measure, cost to serve and accountable result can be read together. ${item.impactLabel === "Modeled Business Impact" ? "Forecasts remain scenario inputs until a controlled pilot produces evidence." : "Historical evidence remains limited to the operating result stated on this page."}`]))}</div>`)}${reportSection("journey", 4, "Journey and solution design", `${prose([item.solution])}${journeyExhibit(1, `${item.title}: operating journey`, item.visual, "The sequence makes the handoffs and decision points visible.")}`, "dark-band")}${reportSection("economics", 5, "Commercial model and unit economics", `<div class="report-split">${reportBlock("Commercial model", prose([item.commercial]))}${reportBlock("Unit-economics question", prose(["Revenue or volume is not enough. The business case must deduct partner share, service, support, losses, technology and the fixed operating capacity required to keep the promise."]))}</div>${supportingEconomics(item)}`)}${reportSection("technology", 6, "Technology, data and AI", `${prose([item.technology])}${supportingArchitecture(item)}`, "tint-band")}${reportSection("operating-model", 7, "Operating model and governance", `${prose([item.operating])}${swimlaneExhibit(4, "Decision and execution model", [{ title: "Commercial owner", steps: ["Set proposition", "Approve economics", "Review result"] }, { title: "Operations", steps: ["Prepare capacity", "Execute service", "Resolve exceptions"] }, { title: "Technology and data", steps: ["Expose source facts", "Run workflow", "Maintain audit"] }, { title: "Control", steps: ["Set policy", "Approve exceptions", "Review risk"] }], "AI can prepare evidence and recommendations. Named people retain consequential authority.")}`)}${reportSection("implementation", 8, "Implementation roadmap and KPI framework", `${roadmapExhibit(5, "Controlled path to scale", roadmap, "Each stage has a commercial, service and control gate.")}${kpiExhibit(6, "Measurement framework", metrics, "The scorecard pairs activity with economics and operating quality.")}`, "dark-band")}${reportSection("risks", 9, "Risks and dependencies", reportTable("Critical risks", ["Risk", "Management response"], risks))}${reportSection("impact", 10, item.impactLabel, `<div class="impact-conclusion ${item.impactLabel === "Modeled Business Impact" ? "modeled" : "evidence"}"><span>${item.impactLabel === "Modeled Business Impact" ? "Scenario, not achieved result" : "Evidence boundary"}</span><p>${esc(item.impact)}</p></div>${reportBlock("Executive reading", prose(["The case is useful because it connects a real operating problem to the economics, technology, ownership and evidence required for a scale decision. It does not rely on an unverified outcome to make the model credible."]))}`, "impact-band")}</article></div>${section("Continue exploring", `<div class="continue-grid">${card("/use-cases", "Use cases", "More business problems", "Browse commerce, retail, fintech, enterprise technology and growth cases.")}${card("/ai-transformation", "Applied AI", "AI & Transformation", "See how AI fits inside commercial and operating workflows.")}</div>`)}`;
};

const saudiBankBody = item => {
  const contents = [
    ["executive-summary", "Executive summary"], ["business-context", "Business context"], ["business-problem", "Business problem"], ["commercial-opportunity", "Commercial opportunity"], ["customer-journey", "Customer journey"], ["solution-design", "Solution design"], ["value-pools", "Revenue and value pools"], ["commercial-model", "Commercial model"], ["unit-economics", "Unit economics"], ["technology", "Technology architecture"], ["data-ai", "Data and AI layer"], ["operating-model", "Operating model"], ["governance", "Governance and decision rights"], ["roadmap", "Implementation roadmap"], ["kpis", "KPI framework"], ["risks", "Risks and dependencies"], ["impact", "Modeled business impact"], ["takeaways", "Executive takeaways"]
  ].map(([id, title], index) => ({ id, title, number: index + 1 }));
  const decisionRows = [
    ["Offer eligibility", "Cards and loyalty product", "Apply approved financial and campaign rules", "AI model"],
    ["Offer ranking", "Commerce product", "Rank only eligible options and show reason codes", "Merchant sales team"],
    ["Credit or instalment approval", "Bank credit and risk", "Use existing underwriting and affordability controls", "Commerce product or AI model"],
    ["Retail transaction", "Merchant", "Own product, price, checkout, delivery and returns", "Bank"],
    ["Attribution and funding", "Finance and loyalty operations", "Reconcile events, returns and merchant funding", "Marketing alone"],
    ["Model change", "Data and model governance", "Approve features, tests, monitoring and rollback", "Individual analyst"]
  ];
  const riskRows = [
    ["Consent and purpose", "Intent data is collected for one use and quietly reused for another.", "Purpose-specific consent, minimal data and clear withdrawal."],
    ["Credit boundary", "Offer ranking is mistaken for credit or affordability advice.", "Eligibility is resolved by bank systems before ranking. AI does not approve finance."],
    ["False incrementality", "Existing spend is credited to the programme.", "Control cohorts, pre-period baselines and agreed attribution windows."],
    ["Merchant service", "A relevant offer leads to weak stock, delivery or returns service.", "Merchant admission, service standards and suppression rules."],
    ["Funding leakage", "Offers, returns and chargebacks are not reconciled correctly.", "Transaction ledger, return events, settlement controls and audit."],
    ["Model bias or drift", "Ranking repeatedly favours one segment or merchant without commercial cause.", "Feature review, merchant exposure limits, drift monitoring and human override."],
    ["Customer fatigue", "Frequent offers reduce trust in the bank channel.", "Frequency caps, need-state relevance and complaint monitoring."],
    ["Economics", "Reward and platform cost exceed incremental value.", "Merchant-funded design, contribution floors and stop conditions."]
  ];
  return `${tagRow([item.sector, item.geography, "Flagship strategy blueprint", "Modeled impact only"])}<div class="report-layout flagship-report">${reportContents(contents)}<article class="report-main">${reportSection("executive-summary", 1, "Executive summary", `<div class="report-opening flagship-opening">${prose([
    "A bank normally appears at the end of a shopping journey. By the time a card authorization arrives, the customer has already chosen the category, product, merchant and payment method. The bank can process the transaction and award points, but it has little influence over the commercial decision that created the spend.",
    "This blueprint moves the bank upstream without asking it to become a retailer. A consented intent layer inside the bank channel would identify a customer's declared shopping need, resolve which cards, rewards, merchant offers or instalment options are eligible, and rank the relevant value. The customer then completes the retail transaction with the merchant. The bank retains financial-product, risk, consent and attribution controls. The merchant retains product, price, fulfilment and return responsibility.",
    "The commercial case rests on incremental card spend, merchant-funded value, better use of existing loyalty assets and higher engagement with the bank's owned channels. Each pool is measured after reward cost, merchant funding, acquisition, platform, service, fraud, returns and operating capacity. A large payment value is not treated as revenue, and attributed spend is not treated as incremental until control evidence supports the claim.",
    "This is a strategy blueprint, not an implemented bank result. The recommended first move is a 90-day pilot with a small customer cohort, two or three anchor merchant categories, explicit consent, existing card and loyalty rails, and a control group. The pilot is successful only if it proves customer relevance, merchant service, clean attribution, funding reconciliation and positive modeled contribution together."
  ])}${reportCallout("Evidence boundary", "No achieved bank result is claimed", "All commercial outcomes on this page are scenarios and measurement designs. They become evidence only after a controlled pilot and reconciled financial review.", "modeled")}</div>`, "opening-band")}${reportSection("business-context", 2, "Business context", `<div class="report-split">${reportBlock("The bank's current position", prose([
    "Retail banks already hold several assets that matter to commerce: a trusted authenticated channel, card relationships, loyalty balances, transaction history, payment rails and, for eligible customers, financing products. These assets usually operate as separate products. The customer discovers a purchase elsewhere and encounters the bank only when choosing how to pay.",
    "Merchant programmes often sit downstream as well. A discount directory or campaign page can list offers, yet it may not connect the customer's current need to eligibility, stock, merchant service or a measurable transaction. The programme reports clicks or redeemed offers without showing whether it changed behaviour or merely subsidized a purchase that would have happened anyway."
  ]))}${reportBlock("The design premise", prose([
    "The bank should enter at declared purchase intent, not at product search across the whole internet. A customer might state a need such as travel, electronics, home, education or a planned large purchase. The bank can then show value that is already permitted for that customer and category.",
    "This keeps the scope credible. The bank is not building a general marketplace, carrying inventory or managing retail service. It is coordinating eligible financial value and merchant-funded demand before handing the customer to a merchant."
  ]))}</div>`)}${reportSection("business-problem", 3, "Business problem", `<div class="problem-led-grid">${reportBlock("Too late to influence choice", prose([
    "Authorization data explains where money was spent after the commercial decision. It does not reveal the alternatives considered, the reason one merchant won, or which benefit could have changed the choice. Post-transaction rewards can reinforce loyalty, but they cannot consistently move spend upstream.",
    "The result is a gap between card portfolio strategy and day-to-day commerce. The bank can promote card benefits, a loyalty team can issue points and merchants can fund campaigns, while the customer still sees no coherent answer to a simple question: what is the best eligible value for the purchase I am planning now?"
  ]))}${reportCallout("Management question", "Can the bank influence intent without owning retail?", "The answer depends on strict role separation: the bank resolves financial eligibility and value; the merchant owns the product and service; the customer controls consent and choice.")}</div>`)}${reportSection("commercial-opportunity", 4, "Commercial opportunity", `<div class="report-split">${reportBlock("Move upstream into intent", prose([
    "A purchase-intent entry point gives the bank a chance to recapture wallet share before another card, wallet or finance provider becomes the default. The customer receives an explanation of relevant value rather than a long offer catalogue. Merchants gain qualified demand tied to eligible cardholders, not only undifferentiated campaign traffic.",
    "Segmentation should begin with commercial and service relevance: declared category, value sensitivity, existing product eligibility, location or fulfilment feasibility, loyalty balance, recent engagement and consented transaction patterns. Protected characteristics and unrelated sensitive data do not belong in offer ranking."
  ]))}${reportBlock("Choose narrow demand pools", prose([
    "The first merchant categories should have meaningful basket value, reliable digital handoff, usable transaction descriptors and enough repeat or planned demand to measure. Electronics, travel, home, education or selected lifestyle categories may fit, but the actual pilot categories require bank and merchant evidence.",
    "The opportunity is not the number of merchants signed. It is the amount of eligible demand that can be served with a clear value proposition, clean transaction match and positive contribution after the full cost of the offer."
  ]))}</div>` , "tint-band")}${reportSection("customer-journey", 5, "Customer and enterprise journey", `${prose([
    "The journey begins when the customer declares a purchase need inside an authenticated bank channel or a consented partner entry point. Eligibility is resolved before ranking. The customer sees a short set of relevant options with the value, conditions, merchant and payment route explained in plain language.",
    "The customer then moves to the merchant through a tracked handoff. The merchant owns catalogue, price, stock, checkout, delivery and returns. The bank observes consented handoff and transaction events, applies the attribution policy, and reconciles merchant funding, rewards and any card-linked benefit after returns or chargebacks."
  ])}${journeyExhibit(1, "Customer journey from purchase intent to attributed spend", [
    { title: "Declare intent", detail: "Customer selects a need or planned purchase." },
    { title: "Resolve eligibility", detail: "Bank systems confirm cards, rewards, finance and consent." },
    { title: "Rank relevant value", detail: "Only eligible merchant and bank value enters the ranking." },
    { title: "Explain the option", detail: "Customer sees value, conditions and payment route." },
    { title: "Merchant handoff", detail: "Merchant owns product selection, checkout and service." },
    { title: "Match transaction", detail: "Card and merchant events feed attribution and settlement." },
    { title: "Measure incrementality", detail: "Control evidence tests whether behaviour changed." }
  ], "A transparent handoff preserves the role of each party and creates a measurable event chain.")}`, "dark-band")}${reportSection("solution-design", 6, "Solution design", `<div class="report-split">${reportBlock("Four connected capabilities", prose([
    "The customer layer captures intent and explains value. The eligibility layer calls existing card, loyalty and financing rules. The commerce layer manages merchant offers, category fit, handoff and service metadata. The measurement layer matches events, reconciles funding and compares the exposed cohort with a control.",
    "The ranking service sits between eligibility and explanation. It cannot create an entitlement, approve credit or invent a merchant benefit. It orders options that have already passed policy and availability checks, using features that the bank has approved for this purpose."
  ]))}${reportBlock("Merchant ecosystem", prose([
    "Anchor merchants need a clear reason to participate: qualified demand, measurable acquisition and a funding model linked to completed transactions. The bank needs reliable offer data, recognizable transaction descriptors, return events and service ownership. The customer needs relevant value without losing control of choice.",
    "The pilot can begin with merchant-funded offers and existing card benefits. Instalment or financing options enter only where current underwriting, affordability, disclosure and product rules already support them."
  ]))}</div>${ecosystemExhibit(2, "Bank, merchant and customer ecosystem", "Bank commerce layer", [
    { label: "Customer", title: "Purchase intent and consent", detail: "Chooses the need, reviews eligible value and controls the final purchase." },
    { label: "Merchant", title: "Product and retail service", detail: "Owns offer terms, stock, checkout, delivery, returns and customer remedy." },
    { label: "Bank products", title: "Cards, loyalty and finance", detail: "Resolve eligibility, apply policy and execute financial benefits." },
    { label: "Bank operations", title: "Attribution and settlement", detail: "Match transactions, reconcile funding, monitor service and report impact." }
  ], "The model coordinates value across parties without moving retail responsibility to the bank.")}`)}${reportSection("value-pools", 7, "Revenue and value pools", `${prose([
    "The first value pool is incremental card spend: purchases that move to the bank's card portfolio or occur more often because relevant value appeared before checkout. The second is merchant-funded demand, where the merchant contributes to a benefit or acquisition fee because the bank can identify eligible customers and attribute completed transactions.",
    "Loyalty creates a third pool when existing balances and benefits become easier to use, but the programme must count the cost of points, redemption and operational liability. Eligible instalment or financing can create product value on selected purchases, subject to existing credit policy and net revenue after funding, risk and service cost. Engagement and data improve the bank's owned channel only if customers continue to find the experience useful and consent remains valid.",
    "The deductions are substantial: reward subsidy, merchant acquisition, platform and integration cost, customer care, fraud or dispute loss, settlement work and campaign operations. The programme should not claim success from payment volume before these costs are visible."
  ])}${waterfallExhibit(3, "Commercial value-pool waterfall", [
    { label: "Incremental card spend", kind: "add", height: 86 },
    { label: "Merchant-funded value", kind: "add", height: 72 },
    { label: "Loyalty and finance value", kind: "add", height: 62 },
    { label: "Reward and acquisition cost", kind: "cost", height: 54 },
    { label: "Platform and service cost", kind: "cost", height: 46 },
    { label: "Risk and reconciliation", kind: "cost", height: 38 },
    { label: "Net modeled contribution", kind: "result", height: 64 }
  ], "Conceptual waterfall. Bar heights show the logic, not a forecast or achieved value.")}`, "tint-band")}${reportSection("commercial-model", 8, "Commercial model", `<div class="report-split">${reportBlock("Merchant-funded demand", prose([
    "A merchant can fund a fixed benefit, a percentage offer, a category campaign or a completed-transaction acquisition fee. The contract must define eligible customers, offer inventory, attribution window, returns, chargebacks, funding caps, data use and settlement timing.",
    "The merchant should see a reconciled view of qualified handoffs and attributable transactions. The bank should avoid promising sales volume before the pilot establishes conversion and incrementality."
  ]))}${reportBlock("Card, loyalty and finance", prose([
    "The bank's value can include card benefits, points, statement credit or an existing instalment route. Each option needs its own funding source and accounting treatment. A blended customer proposition should not blur who paid for the benefit or which product rules apply.",
    "Where financing is relevant, the commerce layer can explain an eligible route after bank systems approve it. The ranking model cannot relax affordability, exposure or credit rules."
  ]))}</div>${equationExhibit(4, "Commercial model and contribution equation", ["Incremental interchange or card contribution", "Merchant funding", "Loyalty or finance contribution"], ["Customer benefit", "Acquisition and platform", "Service, risk and settlement"], "Net incremental contribution", "Every term is measured against an agreed baseline and control cohort.")}`)}${reportSection("unit-economics", 9, "Unit economics and business case", `${prose([
    "The unit of analysis should be an engaged eligible customer and the attributable completed transaction that follows. Start with the eligible audience, multiply by the share that declares or signals a covered need, the offer-view rate, merchant handoff, completed conversion, basket value and purchase frequency. This produces attributed spend, not yet incremental spend.",
    "Incrementality comes from the difference between exposed and comparable control behaviour after adjusting for season, merchant campaigns and existing card preference. The value side then applies card, merchant, loyalty or finance economics. The cost side applies the benefit, acquisition, integration, platform, care, reconciliation and risk costs generated by the same cohort.",
    "A useful scenario model has base, downside and upside cases. The downside should assume lower conversion, more existing-spend cannibalization, higher service cost and slower merchant funding recovery. The pilot should stop or narrow if the base case survives only through optimistic attribution."
  ])}${reportTable("Unit-economics model", ["Line", "Calculation", "Management use"], [
    ["Eligible demand", "Eligible customers x covered purchase intent", "Defines the reachable cohort"],
    ["Attributed spend", "Handoffs x completed conversion x basket x frequency", "Shows activity linked to the journey"],
    ["Incremental spend", "Exposed spend less control and baseline spend", "Tests behavioural lift"],
    ["Gross value", "Card + merchant + loyalty or finance contribution", "Combines funded value pools"],
    ["Variable cost", "Benefit + acquisition + service + risk + settlement", "Shows cost created by the cohort"],
    ["Net contribution", "Gross value less variable and allocated platform cost", "Determines whether to scale"]
  ])}`)}${reportSection("technology", 10, "Technology architecture", `${prose([
    "The design should use existing bank capabilities wherever possible. The mobile app or authenticated web channel captures intent and displays eligible value. API services call card, loyalty, offer and, where permitted, financing systems. A merchant gateway holds offer and handoff data without copying the merchant's full catalogue into the bank.",
    "An event and attribution layer connects intent, eligibility, offer view, merchant handoff, transaction, return and settlement. A consent ledger records purpose, scope and withdrawal. The bank's card, loyalty and credit systems remain authoritative. Merchant systems remain authoritative for product, price, stock, fulfilment and returns.",
    "The first pilot does not require a new core banking platform or full marketplace. It requires reliable interfaces, a small merchant schema, event identifiers, a transaction-matching policy and an operator console for exceptions."
  ])}${architectureExhibit(5, "Technology and data architecture", [
    { title: "Customer experience", items: ["Bank app", "Intent entry", "Offer explanation", "Merchant handoff"] },
    { title: "Eligibility and ranking", items: ["Card rules", "Loyalty rules", "Finance eligibility", "AI ranking"] },
    { title: "Commerce services", items: ["Merchant offers", "Handoff tokens", "Campaign rules", "Service metadata"] },
    { title: "Systems of record", items: ["Cards", "Loyalty", "Transactions", "Merchant checkout and returns"] },
    { title: "Control and measurement", items: ["Consent ledger", "Attribution", "Settlement", "Model and audit logs"] }
  ], "The architecture separates eligibility, ranking, retail execution and financial settlement.")}`, "dark-band")}${reportSection("data-ai", 11, "Data and AI layer", `<div class="report-split">${reportBlock("Data required", prose([
    "The minimum dataset covers customer consent, eligible card and loyalty products, approved merchant offers, declared category intent, handoff events, transaction descriptors, returns and settlement. Features should have a documented purpose and retention period. Raw merchant browsing or unrelated personal data should not be collected simply because it might improve a model.",
    "Attribution needs stable but controlled identifiers. Tokenized handoff IDs and transaction matching can reduce the need to expose personal data to merchants. Finance and loyalty teams need a reconciled ledger that can reverse rewards or funding when a purchase is returned."
  ]))}${reportBlock("AI role", prose([
    "AI ranks eligible value and can explain why an option appears. It may use category intent, value sensitivity, current eligible products, loyalty balance, merchant service quality and recent consented engagement. Deterministic policy resolves whether an option is allowed before the model sees it.",
    "The model should return reason codes, confidence and alternatives. Monitoring covers ranking quality, merchant concentration, segment outcomes, drift and complaints. A person can suppress a merchant, campaign, category or model version immediately."
  ]))}</div>${reportCallout("Control principle", "Eligibility first, ranking second", "The model can order permitted options. It cannot create financial eligibility, approve credit, alter rewards liability or override consent.", "control")}`)}${reportSection("operating-model", 12, "Operating model", `${prose([
    "The proposition needs one accountable product owner with authority across the customer journey and a weekly commercial review. Cards, loyalty, merchant partnerships, data, technology, risk, compliance, finance and operations each retain specialist responsibilities, but they work from one pilot scorecard and one exception queue.",
    "Merchant operations manage offer readiness, service issues and funding files. Attribution and settlement operations reconcile transactions, returns, rewards and merchant obligations. Customer care needs the same offer and eligibility evidence shown to the customer so it can resolve a complaint without searching across teams.",
    "The cadence should include daily pilot operations, weekly commercial and service review, monthly risk and model review, and a formal scale gate at the end of the test period."
  ])}${swimlaneExhibit(6, "Operating model from intent to settlement", [
    { title: "Customer and channel", steps: ["Declare intent", "Review value", "Choose merchant", "Complete purchase"] },
    { title: "Commerce product", steps: ["Define journey", "Rank eligible value", "Monitor conversion", "Own pilot result"] },
    { title: "Merchant operations", steps: ["Load offer", "Maintain service", "Receive handoff", "Resolve retail issue"] },
    { title: "Cards and loyalty", steps: ["Resolve eligibility", "Execute benefit", "Match transaction", "Reverse on return"] },
    { title: "Finance and control", steps: ["Set policy", "Reconcile funding", "Review risk", "Approve scale gate"] }
  ], "One product owner coordinates the journey; specialist owners retain financial, retail and control authority.")}`)}${reportSection("governance", 13, "Governance and decision rights", `${prose([
    "Governance should make the line between commercial optimization and regulated decision clear. The commerce team can design the journey, merchant mix and ranking objective. Card, loyalty, credit, compliance and data owners approve the rules and data permitted inside it. The merchant cannot see or influence a customer's financial eligibility.",
    "Material model changes, new data features, new financial products or wider customer cohorts require approval and rollback plans. The pilot should maintain an audit trail from consent and eligibility through the ranked offer, customer selection, transaction match and settlement."
  ])}${reportTable("Decision-rights matrix", ["Decision", "Accountable owner", "Control", "Must not decide"], decisionRows)}`, "tint-band")}${reportSection("roadmap", 14, "Implementation roadmap", `${prose([
    "The first 30 days establish the commercial and control design: select categories and anchor merchants, define eligible customer cohorts, confirm existing card and loyalty capabilities, agree the attribution policy, map consent and approve the scorecard. No customer pilot should begin while offer funding or return treatment remains ambiguous.",
    "Days 31 to 60 build the narrow journey, merchant offer feed, eligibility calls, event IDs, operator console and reconciliation file. Internal and employee testing should prove that ineligible value is suppressed, returns reverse correctly and customer care can see the same evidence as the product team.",
    "Days 61 to 90 run a limited customer test with control cohorts and weekly stop-go decisions. The next three to twelve months depend on evidence: add categories, merchants or finance options only when contribution, service, consent and operational control remain within threshold."
  ])}${roadmapExhibit(7, "90-day MVP and 12-month scale path", [
    { period: "Days 0 to 30", title: "Design and approve", detail: "Merchant cohort, eligibility, consent, attribution, economics and scorecard." },
    { period: "Days 31 to 60", title: "Build and reconcile", detail: "Customer flow, APIs, event IDs, operator view, return and funding files." },
    { period: "Days 61 to 90", title: "Controlled customer pilot", detail: "Limited cohort, control group, weekly service and contribution review." },
    { period: "Months 4 to 6", title: "Prove repeatability", detail: "Second category or merchant cohort only after the first economics reconcile." },
    { period: "Months 7 to 12", title: "Selective scale", detail: "Wider segments, merchant self-service and eligible finance use cases." }
  ], "Each expansion step requires commercial, service, risk and data approval.")}`, "dark-band")}${reportSection("kpis", 15, "KPI and measurement framework", `${prose([
    "The scorecard begins upstream with eligible demand and customer engagement, then follows the event chain to merchant handoff, completed transaction and repeat behaviour. Activity metrics are paired with control and economics so the team can see whether conversion came with acceptable service and cost.",
    "Incremental card spend is the central commercial measure, not total attributed spend. Merchant funding recovery, reward cost, service cost and net contribution must reconcile to finance. Risk and trust measures include complaints, consent withdrawal, model overrides, ineligible-offer incidents and merchant service failures."
  ])}${kpiExhibit(8, "Executive KPI dashboard", [
    { title: "Reach and relevance", metrics: ["Eligible customers", "Intent starts", "Offer relevance", "Frequency cap"] },
    { title: "Journey", metrics: ["Offer views", "Merchant handoff", "Completed conversion", "Repeat use"] },
    { title: "Incrementality", metrics: ["Control lift", "Incremental spend", "Wallet recapture", "Category lift"] },
    { title: "Economics", metrics: ["Merchant funding", "Reward cost", "Service cost", "Net contribution"] },
    { title: "Service and trust", metrics: ["Merchant failure", "Complaints", "Consent withdrawal", "Care contacts"] },
    { title: "Control", metrics: ["Eligibility errors", "Settlement breaks", "Model overrides", "Audit closure"] }
  ], "Every executive view should distinguish attributed activity from measured incremental value.")}`)}${reportSection("risks", 16, "Risks and dependencies", `${prose([
    "The programme depends on more than an offer-ranking model. It needs clear data rights, usable merchant integrations, recognizable transactions, timely return events, funding agreements, customer-care readiness and finance reconciliation. Weakness in any one of these can make the customer journey look successful while the operating or financial result remains unresolved.",
    "The most serious risks sit at the boundaries between teams: commerce and credit, marketing and consent, merchant sales and service, attribution and finance. The pilot should make these boundaries explicit and assign a stop condition to each."
  ])}${reportTable("Risk and dependency register", ["Risk", "Failure mode", "Control"], riskRows)}` , "tint-band")}${reportSection("impact", 17, "Modeled business impact", `<div class="impact-conclusion modeled flagship-impact"><span>Scenario, not achieved result</span><p>${esc(item.impact)}</p></div>${prose([
    "The business case should be expressed as a range, not a headline promise. A base case models eligible customers, covered intent, conversion, basket, frequency and control lift. It then applies card, merchant, loyalty or finance contribution and deducts benefit, acquisition, platform, service, risk and settlement cost. A downside case assumes lower incrementality and higher service effort.",
    "The management decision is whether net incremental contribution, customer engagement and strategic card value justify the operating complexity and control exposure. If merchant funding, attribution or service cannot be reconciled, the programme should remain narrow even if customer clicks are strong.",
    "No percentage uplift, revenue forecast or customer adoption figure is published because the source material does not provide an approved achieved result. The page supplies the model and the evidence required to make a future claim responsibly."
  ])}` , "impact-band")}${reportSection("takeaways", 18, "Executive takeaways", `<div class="takeaway-grid">${[
    "Enter at declared intent, before the customer has fixed the merchant and payment route.",
    "Use the bank's existing cards, loyalty and approved finance capabilities before building a new retail layer.",
    "Resolve eligibility with policy systems before AI ranks any option.",
    "Keep the merchant accountable for product, price, fulfilment and returns.",
    "Measure incremental behaviour against controls, not attributed spend alone.",
    "Reconcile merchant funding, rewards, returns and settlement before scaling.",
    "Run one customer, service, economics and risk scorecard under a named product owner.",
    "Treat the first 90 days as an evidence programme, not a launch campaign."
  ].map((takeaway, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><p>${esc(takeaway)}</p></div>`).join("")}</div>` , "takeaway-band")}</article></div>${section("Related work", `<div class="continue-grid">${card("/use-cases/oman-bank-value-wallet", "Banking", "Oman bank value wallet", "A portfolio-first model connecting cards, rewards and instalments to shopping intent.")}${card("/insights/payment-volume-versus-net-revenue", "Economics", "Payment volume versus net revenue", "Why transaction value is not the amount a provider keeps.")}</div>`)}`;
};

const caseVisual = (item, compact = false) => {
  switch (item.slug) {
    case "leading-saudi-bank-commerce-ecosystem": return journeyVisual("Customer to attributed spend", ["Purchase intent", "Customer eligibility", "Relevant value", "Merchant handoff", "Transaction", "Attributed spend"], "The merchant retains the retail transaction. The bank connects eligible value to intent.", compact);
    case "oman-bank-value-wallet": return stackVisual("Value wallet layers", ["Customer intent", "Eligible cards and rewards", "Offer explanation", "Merchant checkout"], "Existing bank products are connected before a new loyalty layer is added.", compact);
    case "partner-retail-gifting-network": return journeyVisual("One controlled gifting journey", ["Retail purchase", "Gift add-ons", "Sealed custody", "Assembly", "One delivery"], "Separate transactions, one controlled service chain.", compact);
    case "multi-category-digital-commerce": return journeyVisual("Commerce operating chain", ["Customer demand", "Curated catalogue", "Digital order", "Fulfilment", "Service learning"], "The verified history is first-party commerce.", compact);
    case "agent-led-social-commerce": return networkVisual("Three-sided commerce model", "Platform", ["Merchant supply", "Sales agent", "Buyer demand", "Audited payout"], "Trade has to work for every participant.", compact);
    case "retail-group-transformation": return valueMapVisual("Retail value-creation map", ["Store economics", "Inventory", "Procurement", "Working capital", "Portfolio choices", "Governance"], "Margin, stock and cash are reviewed as one operating system.", compact);
    case "retail-clearance-stock-profitability": return bridgeVisual("Stock-to-cash bridge", ["Ageing stock", "Markdown decision", "Cash recovered", "Store contribution"], "The full P&L matters more than margin percentage alone.", compact);
    case "payments-embedded-finance-growth": return bridgeVisual("Volume-to-net-revenue bridge", ["Payment volume", "Gross fees", "Partner and risk cost", "Net revenue"], "Conceptual bridge, not to scale.", compact);
    case "warehouse-working-capital-3pl": return bridgeVisual("Capacity-to-contribution model", ["Spare capacity", "Anchor demand", "Service cost", "Client contribution"], "Capacity becomes a business only after full service cost.", compact);
    case "saudi-market-entry-distribution": return marketVisual("Market-entry route", "Oman base", "Saudi Arabia", ["Channel", "Landed cost", "Partner", "Pilot"], "Commit fixed cost only after contribution and cash needs are visible.", compact);
    case "enterprise-software-marketplace": return stackVisual("Verified software marketplace", ["Vendor entitlement", "Reseller offer", "Provisioning", "Renewal and service"], "Every sale resolves to a verified licence and accountable service owner.", compact);
    case "heritage-lifestyle-commerce": return networkVisual("Place-led commerce flywheel", "Landmark", ["Local design", "Pop-ups", "Digital storefronts", "Repeat visits"], "Start with trading pilots before major capital work.", compact);
    case "digital-wedding-platform": return journeyVisual("Event customer journey", ["Invitation", "Guest response", "Concierge", "Vendor workflow", "Event insight"], "A coordinated service around one event record.", compact);
    case "enterprise-ai-transformation-practice": return stackVisual("Enterprise AI delivery stack", ["Business problem", "Process evidence", "Approved platform", "Governed agent", "Value tracking"], "Transformation begins with the workflow, not the model.", compact);
    case "aeofind": return interfaceVisual("AEOFind diagnostic", "Product concept", ["Intent baseline", "Answer coverage", "Evidence gaps", "Priority actions"], "Visibility is measured against a fixed set of commercial questions.", compact);
    case "ai-commerce-command-center": return interfaceVisual("AI Commerce Command Center", "In development", ["Operating signals", "Exception queue", "Recommended action", "Human approval"], "A supervised control layer across commerce operations.", compact);
    case "career-runway-ai": return interfaceVisual("Career Runway AI", "Live", ["Career DNA", "Financial runway", "Scenario trade-offs", "Decision view"], "A personal decision surface grounded in financial facts.", compact);
    default: return journeyVisual("Business system", item.visual, "", compact);
  }
};

const commercialCaseVisual = item => item.slug === "leading-saudi-bank-commerce-ecosystem" ? stackVisual("Commercial value model", ["Incremental card spend", "Merchant-funded value", "Loyalty economics", "Customer engagement and data"], "Value is assessed after rewards, acquisition, platform and service cost.") : "";

const articleVisual = (item, compact = false) => {
  switch (item.slug) {
    case "marketplace-gmv-revenue-contribution": return bridgeVisual("GMV to contribution", ["GMV", "Platform revenue", "Service costs", "Contribution"], "Conceptual waterfall, not to scale.", compact);
    case "seller-onboarding-economics": return journeyVisual("Seller activation funnel", ["Verified seller", "Trade-ready offer", "First order", "Repeat supply"], "Registration is the beginning, not the result.", compact);
    case "margin-to-cash-retail-turnaround": return bridgeVisual("Margin-to-cash bridge", ["Gross margin", "Stock age", "Cash release", "Store contribution"], "One operating bridge across profit and working capital.", compact);
    case "agent-led-social-commerce-economics": return networkVisual("Social-commerce economics", "Attributed order", ["Merchant", "Sales agent", "Buyer", "Audited payout"], "Every participant needs a clear economic role.", compact);
    case "commerce-tasks-for-ai-agents": return authorityVisual("Human and agent authority", ["Read evidence", "Draft action", "Human approval", "Audited execution"], "Authority expands only after accuracy and rollback controls hold.", compact);
    case "rag-versus-live-operational-apis": return stackVisual("Knowledge and live facts", ["Approved knowledge through RAG", "Live facts through APIs", "Decision policy", "Approved action"], "Policy and operational state remain distinct.", compact);
    case "payment-volume-versus-net-revenue": return bridgeVisual("TPV to net revenue", ["Payment volume", "Gross fees", "Partner and loss cost", "Net revenue"], "Conceptual waterfall, not to scale.", compact);
    case "warehouse-capacity-as-a-3pl-business": return bridgeVisual("Capacity to client contribution", ["Spare capacity", "Anchor demand", "Full service cost", "Client contribution"], "A warehouse P&L must include the complete service chain.", compact);
    default: return journeyVisual("Operating lens", item.visual, "", compact);
  }
};

const recordVisual = item => {
  switch (item.slug) {
    case "floward-oman": return `<div class="record-visual-stage">${journeyVisual("Zero to local operating rhythm", ["0", "Local setup", "Assortment", "Fulfilment", "Occasion trading", "Acquisition", "Operating rhythm"], "A country launch built as a complete commercial and fulfilment system.")}${networkVisual("Oman operating model", "Country operation", ["Trading", "Suppliers", "Fulfilment", "Customer demand"], "Local decisions connected to the regional digital proposition.")}</div>`;
    case "salman-miraq": return `<div class="record-visual-stage">${valueMapVisual("Value-creation and transformation map", ["Core retail reset", "Working capital and inventory", "Portfolio decisions", "New venture creation", "Investment and recapitalization assessment", "GCC expansion logic"], "An operating and investment agenda, without claiming a group-wide financial result.")}${marketVisual("Expansion logic", "Core portfolio", "GCC options", ["Economics", "Capital", "Partner", "Gate"], "Each option passes a separate investment gate.")}</div>`;
    case "roumaan": return `<div class="record-visual-stage single">${journeyVisual("Commerce evolution", ["Customer demand", "Catalogue", "Digital commerce", "Fulfilment", "Operating model"], "Later marketplace planning remains separate from the verified first-party operation.")}</div>`;
    case "upapp-factory": return `<div class="record-visual-stage">${journeyVisual("Product delivery lifecycle", ["Business requirement", "Product design", "Development", "Deployment", "Support"], "Scope, testing and handover controlled the delivery model.")}${marketVisual("Studio evolution", "Oman base", "Regional delivery", ["Partner capacity", "Client context", "Handover"], "A lean core team delivered across multiple market contexts.")}</div>`;
    default: return `<div class="record-visual-stage single">${stackVisual("Enterprise operating context", ["Customer experience", "Commerce platform", "Commercial priorities", "Enterprise controls"], "Public role context only. Internal programmes remain confidential.")}</div>`;
  }
};

const useCard = item => `<a class="visual-card" href="${usePath(item)}"><div class="visual-card-copy"><span class="card-label">${esc(item.type)}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><span class="card-meta">${esc(item.sector)} · ${esc(item.geography)}</span></div>${caseVisual(item, true)}<span class="card-link">View details <span aria-hidden="true">→</span></span></a>`;
const trackCard = (item, index = 0) => `<a class="record-card" href="${trackPath(item)}"><span class="record-index">${String(index + 1).padStart(2, "0")}</span><div><span class="card-label">${esc(item.role)}</span><h3>${esc(item.name)}</h3><p>${esc(item.summary)}</p></div><div class="record-card-meta"><span>${esc(item.geography)}</span><span>${esc(item.period)}</span></div><span class="card-link">View record <span aria-hidden="true">→</span></span></a>`;
const recordField = (label, text) => `<section class="record-field"><h2>${esc(label)}</h2><p>${esc(text)}</p></section>`;
const productPreview = item => `<a class="product-preview" href="${usePath(item)}"><div class="product-preview-copy"><span class="card-label">${esc(item.type)}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><span class="card-link">Open product page <span aria-hidden="true">→</span></span></div>${caseVisual(item, true)}</a>`;

const recordJourneyExhibit = item => {
  const items = {
    "roumaan": ["Customer demand", "Curated catalogue", "Digital order", "Fulfilment", "Service learning"],
    "salman-miraq": ["Core diagnosis", "Stock and cash reset", "Portfolio choices", "Capital gates", "GCC options"],
    "floward-oman": ["Local setup", "Assortment", "Supplier readiness", "Fulfilment", "Occasion trading", "Operating rhythm"],
    "upapp-factory": ["Qualified requirement", "Product design", "Development", "Testing", "Deployment", "Support"]
  }[item.slug];
  return journeyExhibit(2, `${item.name}: operating chain`, items, "The sequence shows how the mandate translated into an operating system.");
};

const recordEconomicsExhibit = item => {
  const model = {
    "roumaan": { income: ["Product margin", "Completed-order value"], costs: ["Delivery and payment", "Returns and acquisition"], result: "Order contribution" },
    "salman-miraq": { income: ["Product margin", "Cash released", "Qualified venture value"], costs: ["Markdown and overhead", "Stock and capital required"], result: "Sustainable value creation" },
    "floward-oman": { income: ["Product margin", "Completed gifting order"], costs: ["Packaging and delivery", "Cancellation and acquisition"], result: "Order contribution" },
    "upapp-factory": { income: ["Contract value", "Approved change value"], costs: ["Delivery and partner hours", "Rework and support"], result: "Project contribution" }
  }[item.slug];
  return equationExhibit(3, "Commercial model", model.income, model.costs, model.result, "The equation identifies the management measure. It does not state an unpublished financial result.");
};

const recordArchitectureExhibit = item => {
  const layers = {
    "roumaan": [
      { title: "Customer", items: ["Storefront", "Account", "Care"] },
      { title: "Commerce", items: ["Catalogue", "Price", "Order"] },
      { title: "Operation", items: ["Stock", "Fulfilment", "Returns"] },
      { title: "Management", items: ["Category P&L", "Service", "Cash"] }
    ],
    "salman-miraq": [
      { title: "Trade", items: ["POS", "Category", "Channel"] },
      { title: "Working capital", items: ["Inventory", "Procurement", "Supplier terms"] },
      { title: "Finance", items: ["P&L", "Cash", "Investment case"] },
      { title: "Governance", items: ["Action owner", "Capital gate", "Board decision"] }
    ],
    "floward-oman": [
      { title: "Demand", items: ["Catalogue", "Campaign", "Customer order"] },
      { title: "Supply", items: ["Assortment", "Supplier", "Quality"] },
      { title: "Fulfilment", items: ["Order flow", "Capacity", "Delivery"] },
      { title: "Control", items: ["Daily trade", "Exceptions", "Contribution"] }
    ],
    "upapp-factory": [
      { title: "Client", items: ["Requirement", "Decision", "Acceptance"] },
      { title: "Product", items: ["Design", "Scope", "Release"] },
      { title: "Delivery", items: ["Core team", "Partners", "Testing"] },
      { title: "Control", items: ["Milestones", "Change", "Support"] }
    ]
  }[item.slug];
  return architectureExhibit(4, "Technology and operating architecture", layers, "Technology is organized around the commercial and operating decisions it supports.");
};

const trackPage = item => {
  const detail = trackDeep[item.slug];
  const contents = [
    ["executive-overview", "Executive overview"], ["market-context", "Market context"], ["role-mandate", "Role and mandate"], ["work", "What was built or fixed"], ["commercial", "Commercial contribution"], ["operating-model", "Operating model"], ["technology", "Technology and operations"], ["results", "Results and evidence"], ["lessons", "Business relevance and lessons"]
  ].map(([id, title], index) => ({ id, title, number: index + 1 }));
  const related = allUseCases.filter(useCase => item.slug === "roumaan" ? useCase.slug.includes("commerce") : item.slug === "floward-oman" ? useCase.slug.includes("gifting") : item.slug === "upapp-factory" ? useCase.slug.includes("software") || useCase.slug.includes("enterprise-ai") : useCase.slug.includes("retail")).slice(0, 3);
  return {
    path: trackPath(item), type: "WebPage", kind: "track", title: `${item.name} | Track Record | Haris Aslam`,
    description: `Operating record from ${item.geography}: ${item.role.toLowerCase()}, covering commercial model, operating design, technology, evidence and lessons.`,
    eyebrow: "Track record", h1: item.name, intro: item.summary,
    body: `${tagRow([item.role, item.geography, item.period])}<div class="report-layout track-report">${reportContents(contents)}<article class="report-main">${reportSection("executive-overview", 1, "Executive overview", `<div class="report-opening">${prose([item.summary, item.relevance])}${reportCallout("Evidence boundary", "Only verified public outcomes are stated", detail.results[0], "evidence")}</div>`, "opening-band")}${reportSection("market-context", 2, "Market context", `${prose(detail.context)}${timelineExhibit(1, "Mandate and operating progression", detail.timeline, "The timeline shows the work sequence rather than implying an achieved financial result.")}`)}${reportSection("role-mandate", 3, "Role and mandate", `<div class="report-split">${reportBlock("Mandate", prose([item.mandate]))}${reportBlock("Operating problem", prose(detail.problem))}</div>`, "tint-band")}${reportSection("work", 4, "What was built or fixed", `${prose(detail.work)}${recordJourneyExhibit(item)}`, "dark-band")}${reportSection("commercial", 5, "Commercial contribution", `${prose(detail.commercial)}${recordEconomicsExhibit(item)}`)}${reportSection("operating-model", 6, "Operating model", `<div class="report-split">${reportBlock("How the work ran", prose(detail.operating))}${reportBlock("Decision discipline", prose([item.relevance]))}</div>${swimlaneExhibit(5, "Operating cadence and decision rights", [{ title: "Commercial", steps: ["Set priority", "Read economics", "Choose action"] }, { title: "Operations", steps: ["Prepare capacity", "Execute", "Resolve exception"] }, { title: "Finance and control", steps: ["Reconcile evidence", "Approve commitment", "Review result"] }], "The exact cadence varies by role; the common pattern is named ownership and one operating fact base.")}`)}${reportSection("technology", 7, "Technology and operations", `${prose(detail.technology)}${recordArchitectureExhibit(item)}`, "tint-band")}${reportSection("results", 8, "Results and evidence", `<div class="report-split">${reportBlock("Verified record", prose(detail.results))}${reportBlock("What is not claimed", prose(["No unpublished revenue, profit, market-share or broad transformation percentage is added to the record."]))}</div>${kpiExhibit(6, "Operating measurement framework", detail.metrics, "These are the measures that make the model governable. They are not presented as achieved values.")}`, "impact-band")}${reportSection("lessons", 9, "Business relevance and lessons", `<div class="lessons-layout">${bulletList(detail.lessons)}${reportCallout("Business relevance", "Why this experience matters", item.relevance)}</div>`, "takeaway-band")}</article></div>${section("Related use cases", `<div class="visual-card-grid">${related.map(useCard).join("")}</div>`)}`
  };
};

const useCasePage = item => ({
  path: usePath(item), type: "WebPage", kind: "case", title: `${item.title} | Use Case | Haris Aslam`,
  description: item.summary.length >= 80 ? item.summary : `${item.summary} A business use case covering solution, technology, commercial model, operations and impact.`,
  eyebrow: `${item.type} · ${item.geography}`, h1: item.title, intro: item.summary,
  v3: item.slug === "leading-saudi-bank-commerce-ecosystem",
  v3Body: item.slug === "leading-saudi-bank-commerce-ecosystem" ? v3Saudi({ item }) : "",
  project: item.slug === "ai-commerce-command-center" || item.slug === "career-runway-ai" ? { name: item.title, status: item.type, description: item.summary } : undefined,
  body: item.slug === "leading-saudi-bank-commerce-ecosystem" ? saudiBankBody(item) : supportingCaseBody(item)
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

const articleCard = item => `<a class="insight-card" href="/insights/${item.slug}"><div><span class="card-label">Insight</span><h3>${esc(item.title)}</h3><p>${esc(item.lead)}</p></div>${articleVisual(item, true)}<span class="card-link">Read insight <span aria-hidden="true">→</span></span></a>`;
const articlePage = item => ({ path: `/insights/${item.slug}`, type: "Article", kind: "article", datePublished: "2026-09-16", title: `${item.title} | Haris Aslam`, description: `${item.lead} A practical note on GCC business economics and operating decisions.`, eyebrow: "Insight", h1: item.title, intro: item.lead, body: `<div class="article-visual-stage">${articleVisual(item)}</div><div class="article-layout"><article class="article-copy">${item.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}</article><aside class="article-lens"><span>Operating question</span><p>What changes in the economics, decision rights and evidence before this model can scale?</p></aside></div>${section("Related work", `<div class="continue-grid">${card("/use-cases", "Use cases", "See the models in practice", "Explore business problems, solutions, operating models and economics.")}${card("/ai-transformation", "Applied AI", "AI & Transformation", "See bounded automation inside real workflows.")}</div>`)}` });

const home = {
  path: "/", type: "WebPage", kind: "home", title: "Muhammad Haris Aslam | GCC CEO and Business Builder", description: "Muhammad Haris Aslam is a GCC operator and business builder focused on turnaround, growth, digital commerce and venture building.", eyebrow: "Muhammad Haris Aslam", h1: "Build the market. Fix the economics. Scale what works.", intro: "GCC CEO and business builder across turnaround, growth, digital commerce and venture building.",
  v3: true,
  v3Body: executiveHome({ trackRecords }),
  body: `<div class="hero-actions">${link("/track-record", "View track record", "button")}${link("/use-cases", "Explore use cases", "button button-secondary")}</div>${section("Selected operating record", `<div class="record-feature-grid">${trackRecords.slice(0, 4).map(trackCard).join("")}</div>${link("/track-record", "View full track record")}`, "record-section")}${section("Areas of work", `<div class="builder-system"><div class="builder-path"><span>Business problem</span><span>Commercial economics</span><span>Operating model</span><span>Technology and AI</span><span>Measurable impact</span></div><div class="builder-disciplines"><span>Business building</span><span>Commerce and marketplaces</span><span>Retail economics</span><span>Enterprise technology</span><span>GCC growth</span><span>Applied AI</span></div></div>`, "builder-section")}${section("Selected use cases", `<div class="visual-card-grid">${[useCases[0], useCases[2], useCases[5], useCases[7], aiProjects[0], useCases[10]].map(useCard).join("")}</div>${link("/use-cases", "Browse all use cases")}`)}${section("AI & Transformation", `<p class="section-intro">AI works when it is attached to an operating decision, reliable data and a person who owns the result.</p><div class="product-preview-grid">${[...aiProjects, useCases.find(item => item.slug === "aeofind")].map(productPreview).join("")}</div>${link("/ai-transformation", "Explore AI & Transformation")}`, "ai-preview-section")}${section("Insights", `<div class="insight-grid">${insights.slice(0, 4).map(articleCard).join("")}</div>${link("/insights", "Read all insights")}`)}${section("About", `<div class="narrow-copy"><p>Haris works across the decisions that turn an idea into an operating business: proposition, economics, technology and execution.</p>${link("/about", "More about Haris")}</div>`)}${section("Contact", `<div class="narrow-copy"><p>For a discussion about business building, commerce, transformation or applied AI.</p>${link("/contact", "Get in touch", "button")}</div>`, "contact-section")}`
};

const trackIndex = { path: "/track-record", type: "CollectionPage", kind: "track-index", title: "Track Record | Muhammad Haris Aslam", description: "Selected operating roles and ventures across Roumaan, UpApp Factory, Floward Oman, Salman Corporation and Miraq Lifestyle.", eyebrow: "Track record", h1: "Building, launching and transforming businesses.", intro: "Selected operating roles and ventures where Haris held direct responsibility for building, growth, transformation or investment.", pilot: true, pilotBody: pilotTrack({ trackRecords }), body: `${section("Selected record", `<div class="record-feature-grid record-index-grid">${trackRecords.map(trackCard).join("")}</div>`, "record-section")}${section("Operating arc", journeyVisual("From founder-led commerce to enterprise scale", ["Build a commerce venture", "Create digital products", "Launch a country operation", "Reset retail economics", "Work at enterprise scale"], "The common thread is direct responsibility for the commercial and operating model."), "operating-arc-section")}` };

const useIndex = { path: "/use-cases", type: "CollectionPage", kind: "use-index", title: "Business Use Cases | Muhammad Haris Aslam", description: "A browsable library of business models and transformation cases across banking, commerce, retail, payments, logistics, enterprise technology, AI and GCC market entry.", eyebrow: "Use cases", h1: "Business problems turned into operating models", intro: "Each case connects the problem to commercial logic, technology, operating design and measurable value.", v3: true, v3Body: v3UseLibrary(expandedLibraryCases), body: "" };

const aiPage = { path: "/ai-transformation", type: "CollectionPage", kind: "ai", title: "AI & Transformation | Muhammad Haris Aslam", description: "Applied AI products and enterprise workflows built around reliable data, bounded authority and measurable business economics.", eyebrow: "AI & Transformation", h1: "Operational AI, under control", intro: "Products and enterprise workflows built around reliable facts, bounded authority and measurable business economics.", v3: true, v3Body: `${v3Ai()}${v4AiFamily()}`, body: "" };

const insightsPage = { path: "/insights", type: "CollectionPage", kind: "insights", title: "Insights on Commerce and Transformation | Haris Aslam", description: "Eight practical articles on marketplace economics, retail cash, social commerce, AI operations, payments and warehouse contribution.", eyebrow: "Insights", h1: "Notes from operating work", intro: "Short reads on the economics and decisions that determine whether a model works.", v3: true, v3Body: v4Insights(insights), body: "" };

const about = { path: "/about", type: "ProfilePage", kind: "about", title: "About Muhammad Haris Aslam | GCC Operator", description: "Muhammad Haris Aslam is a GCC operator and business builder with experience across digital commerce, retail, marketplaces, enterprise technology and applied AI.", eyebrow: "About", h1: "Muhammad Haris Aslam", intro: "Operator, business builder and transformation leader.", heroAside: `<figure class="hero-portrait compact"><img src="/assets/haris-aslam.webp" alt="Portrait of Muhammad Haris Aslam" width="717" height="960"></figure>`, body: `${section("Operating background", `<div class="about-layout"><div class="article-copy"><p>Haris has built and operated digital-commerce ventures, launched a country operation, worked through retail margin and cash problems, and delivered enterprise technology.</p><p>His work starts with the business model. Where will value come from? What has to change in the operation? Which technology belongs in the solution, and which decisions still need an accountable person?</p><p>He is based in Doha and works across GCC commerce, retail, enterprise technology and applied AI.</p><p><strong>Current mandate: Strategic Digital Commerce - Major Telecom Operator, Qatar.</strong> Currently working on strategic digital-commerce, marketplace and operating-model transformation within a major telecom operator in Qatar.</p></div>${diagram("Working pattern", ["Find the problem", "Design the economics", "Build the operation", "Measure the result"])}</div>`)}${section("Selected track record", grid(trackRecords.slice(0, 3).map(trackCard)))}` };

const operatingRecord = { path: "/operating-record", type: "CollectionPage", kind: "operating-record", title: "Operating Record | Muhammad Haris Aslam", description: "Operating evidence across GCC retail turnaround, country launch, digital commerce, enterprise technology and venture building.", eyebrow: "Operating record", h1: "Evidence of building, launching and changing businesses.", intro: "Named operating experience and verified results where the public record supports them.", v3: true, v3Body: operatingRecordPage({ trackRecords }), body: "" };

const familyBusiness = { path: "/family-business", type: "WebPage", kind: "family-business", title: "Family Business Transformation GCC | Haris Aslam", description: "An operator's perspective on turnaround, professionalisation, growth, digital commerce and venture creation in GCC family businesses.", eyebrow: "For business owners", h1: "When a good family business needs its next operating model.", intro: "Operating leadership for the point where growth, economics and organisation must change together.", v3: true, v3Body: familyBusinessPage(), body: "" };

const executiveProfile = { path: "/executive-profile", type: "ProfilePage", kind: "executive-profile", title: "Executive Profile | Muhammad Haris Aslam", description: "Executive profile of Muhammad Haris Aslam, a GCC operator across turnaround, growth, digital commerce and venture building.", eyebrow: "Executive profile", h1: "Commercial leadership grounded in operating detail.", intro: "GCC operator, CEO and business builder with more than seventeen years of experience.", v3: true, v3Body: executiveProfilePage({ trackRecords }), body: "" };

const executiveSearch = { path: "/executive-search", type: "WebPage", kind: "executive-search", title: "Executive Search Profile | Muhammad Haris Aslam", description: "A concise assessment of Muhammad Haris Aslam's leadership focus, GCC geography, sectors, career record and mandate environments.", eyebrow: "Executive search", h1: "Considering Haris for a mandate?", intro: "A due-diligence view for executive-search firms and leadership decision makers.", v3: true, v3Body: executiveSearchPage({ trackRecords }), body: "" };

const operatorNotes = { path: "/operator-notes", type: "CollectionPage", kind: "operator-notes", title: "Operator Notes | Muhammad Haris Aslam", description: "Planned and published operating notes on GCC turnaround, marketplaces, retail economics, Saudi expansion and family business.", eyebrow: "Operator Notes", h1: "Working notes on growth, turnaround and operating economics.", intro: "Editorial previews and published analysis for owners, boards and operators.", v3: true, v3Body: operatorNotesPage(), body: "" };

const contact = { path: "/contact", type: "ContactPage", kind: "contact", title: "Discuss a Mandate | Muhammad Haris Aslam", description: "Start a confidential conversation with Muhammad Haris Aslam about a board, leadership, transformation or business-building mandate.", eyebrow: "Contact", h1: "Discuss a mandate", intro: "For board, leadership and operating mandates across the GCC.", body: `${section("Start a confidential conversation", `<div class="contact-grid"><div><span>Email</span><a href="mailto:${site.email}" data-cta-id="contact_click">${site.email}</a></div><div><span>LinkedIn</span><a href="${site.linkedin}" rel="me noopener" data-cta-id="linkedin_click">Connect with Haris <span aria-hidden="true">↗</span></a></div></div><p class="contact-note">A short note on the business situation, market and decision is enough.</p>`)}` };

const existingCasePages = [...useCases.map(useCasePage), ...aiProjects.filter(item => item.slug !== "ai-commerce-command-center").map(useCasePage)];
const addedCasePages = expansionPages(existingCasePages.map(page => page.path));

export const pages = [home, operatingRecord, familyBusiness, executiveProfile, executiveSearch, operatorNotes, trackIndex, ...trackRecords.map(trackPage), useIndex, ...existingCasePages, ...addedCasePages, aiPage, insightsPage, ...insights.map(articlePage), about, contact];
