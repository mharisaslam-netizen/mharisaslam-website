const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const paragraphs = items => items.map(text => `<p>${text}</p>`).join("");
const table = (caption, headers, rows) => `<div class="report-table-wrap"><table class="report-table"><caption>${esc(caption)}</caption><thead><tr>${headers.map(text => `<th scope="col">${esc(text)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((text, index) => index ? `<td>${esc(text)}</td>` : `<th scope="row">${esc(text)}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const section = (id, heading, html) => `<section class="section priority-content" id="${id}"><div class="v3-shell"><div class="section-heading"><h2>${heading}</h2></div>${html}</div></section>`;
const prose = items => `<div class="report-prose">${paragraphs(items)}</div>`;
const exhibit = (number, title, labels) => `<figure class="v4-case-exhibit"><figcaption><span>${number}</span><strong>${title}</strong></figcaption><div class="v4-case-chain">${labels.map(label => `<div><span>Decision</span><b>${label}</b></div>`).join("<i></i>")}</div></figure>`;

export function telcoMarketplaceBody() {
  return `<section class="v3-case-hero v4-note-hero"><div class="v3-shell"><div><span class="v3-label">Strategy blueprint · Telecom · GCC</span><h1>Telco-led national marketplace</h1><p>A practical launch model connecting customer reach, seller readiness, completed-order contribution and service ownership.</p><div class="v3-case-facts"><span><b>Commercial question</b>Can distribution advantage earn the full cost to serve?</span><span><b>Evidence basis</b>Proposed operating model</span><span><b>Scale gate</b>Contribution, repeat demand and reliable fulfilment</span></div></div>${exhibit("01", "The marketplace launch decision", ["Relevant customer need", "Trade-ready supply", "Completed order", "Retained contribution"])}</div></section>
  ${section("executive-summary", "Executive summary", prose([
    "A telecom operator should build a marketplace only when its customer access, distribution or existing service relationships solve a specific commerce problem better than a standalone storefront. An installed customer base is a possible distribution advantage. It is not proof that customers will buy unrelated products, accept the proposed delivery promise or return without a subsidy.",
    "The first launch decision is a narrow combination of customer segment, category and service promise. Define the purchase need, the sellers that can meet it, the event that earns a fee and the full completed-order cost. Prove that combination before expanding catalogue, geography or free-delivery commitments. This page is a proposed blueprint, not a disclosure of a current employer's programme or a claim of achieved marketplace results."
  ]))}
  ${section("commercial-opportunity", "Business problem and commercial opportunity", prose([
    "A marketplace introduces a different operating obligation from selling a telecom product. The platform may own discovery and checkout while a seller owns stock and product rights, a courier owns transit and a payment partner owns processing. Customers still experience one promise. Unclear responsibility turns seller or courier failures into the platform's support cost and reputational problem.",
    "Start with an identifiable customer need rather than the largest possible assortment. A device customer may need a compatible accessory or dependable installation; a business customer may need a verified software subscription. Those examples imply different product rights, fulfilment, returns, support and accounting. Combining them in one broad launch hides the cost of complexity.",
    "Compare each category against the customer's existing alternatives. The platform needs a reason to win: availability, relevance, trusted supply, convenience, an eligible benefit or a better resolved service problem. A discount can stimulate a first purchase, but repeat use must be tested after the discount is removed. Consent, eligibility and financial-product approvals remain separate from marketing reach."
  ]) + table("Select the first category", ["Question", "Evidence to collect", "Decision"], [
    ["Is there relevant demand?", "Customer intent, existing category purchases and a controlled offer test", "Choose one purchase need and customer cohort"],
    ["Can sellers fulfil the promise?", "Available stock, preparation cutoffs, product rights and test orders", "Activate a small ready seller cohort"],
    ["Can the order earn its cost?", "Retained fees less delivery, payments, care, returns and incentives", "Set price, service and subsidy limits"],
    ["Does demand repeat?", "Repeat completed orders and contribution after introductory offers", "Expand only when the cohort remains viable"]
  ]))}
  ${section("responsibilities", "Solution, technology and operating model", prose([
    "Write the customer promise and responsibility matrix before choosing the integration architecture. A customer must know who sells the product, when it should arrive, how to request a remedy and which party handles the issue. Seller agreements, customer policies and operating procedures should describe the same model. Legal, accounting and regulated-payment decisions require their respective qualified owners.",
    "A shared order reference should connect the customer order, seller acknowledgement, stock reservation, payment, collection, delivery, return and settlement. Record the party responsible for the next event and the time at which an exception becomes visible. Customer care needs the same facts, rather than asking the customer to reconstruct the journey."
  ]) + table("Who owns the transaction?", ["Party", "Operating responsibility", "Evidence"], [
    ["Platform", "Customer journey, order orchestration, policy presentation and exception routing", "Order, consent, promise and case history"],
    ["Seller", "Product rights, accurate offers, inventory and agreed preparation", "Offer version, stock acknowledgement and handover"],
    ["Delivery partner", "Agreed collection, custody, transit and delivery events", "Scan trail and delivery or exception evidence"],
    ["Payment and finance owners", "Processing, refunds, seller liabilities and reconciliation", "Provider references, ledger and settlement records"]
  ]) + exhibit("02", "The operational handoff", ["Seller accepts", "Stock reserved", "Order handed over", "Delivery reconciled"]))}
  ${section("order-economics", "What does a completed order contribute?", prose([
    "For a third-party agency model, begin with retained platform commission and charged services. Gross merchandise value is transaction activity, not automatically platform revenue. Deduct payment processing, fulfilment, packaging, customer care, expected claims, returns and platform-funded incentives. Compare the remainder with acquisition cost, fixed capacity and the cash needed before fees and obligations settle.",
    "Keep the delivery view explicit. Customer delivery charges and seller funding may offset the courier and packaging cost; a shortfall is a subsidy that needs an owner and a measurable objective. Failed attempts, return collection and support should not disappear outside the order model. The correct treatment depends on the actual customer promise and commercial agreements.",
    "The <a href=\"/insights/marketplace-economics-gmv-revenue-contribution-gcc#worked-contribution-model\">worked contribution model</a> illustrates the calculation with editable assumptions. Its values are examples, not GCC benchmarks or a current programme's business case. Use finance-approved realized revenue and cost definitions when replacing those examples with operating data."
  ]))}
  ${section("seller-readiness", "Release sellers by trade readiness", prose([
    "Registration, verification and a large catalogue do not establish usable supply. Check legal identity, product rights, listing and variant quality, available stock, preparation capacity, returns responsibility and settlement configuration separately. A clean product image cannot compensate for an unresolved right to sell or a seller that cannot keep stock current.",
    "Before exposing the first offer, run the operating journey with test orders and realistic exceptions. Include an unavailable item, a rejected order, a late collection, a cancellation, a failed delivery and a return. Confirm the resulting customer message, fee, refund, seller liability and finance record. A launch rehearsal should test the unhappy paths as carefully as checkout.",
    "Measure onboarding by time to the first completed order, first-pass offer quality, manual review effort and subsequent seller contribution. Keep commercial activation separate from payment release. A seller may be ready to trade while a particular payout remains subject to reconciliation or an unresolved dispute."
  ]))}
  ${section("technology-decisions", "Connect the minimum reliable systems", prose([
    "The initial architecture needs a commerce and order layer, seller and catalogue services, stock interfaces, payment-provider references, courier events, a care queue and a reconciled finance view. The platform should retain the history of the offer and promise shown at purchase. Otherwise a later product edit or policy change can make a dispute impossible to reconstruct.",
    "Treat retries as normal. An order notification may arrive twice, an API may be unavailable and a refund event may arrive before settlement. Use idempotent actions, explicit states and a visible exception queue. Do not infer that money moved because a screen displays a successful instruction; reconcile the payment or refund against the authoritative provider record.",
    "AI can prepare catalogue drafts, collect case evidence and rank exceptions for review. It should not certify a seller, invent an attribute, approve a refund or override a financial control. Start with an assisted workflow over known sources and expand permissions only after the business owner evaluates error, service consequence and operating cost."
  ]))}
  ${section("launch-gates", "Implementation, KPIs and risk", prose([
    "Use a sequenced pilot with explicit stop conditions. The timing below is an illustrative work plan, not a public launch commitment. One accountable programme owner should bring commercial, operations, technology, finance and control decisions into the same weekly review. Unresolved settlement or returns treatment is a launch dependency, not a detail to defer.",
    "The executive scorecard should connect completed orders, effective retained revenue, variable cost, contribution, seller readiness, cancellation, delivery performance, returns, repeat demand and cash after liabilities. Read results by seller and category cohort. Averages can hide profitable categories funding persistent service failures elsewhere.",
    "Before widening the launch, test the downside: weaker conversion, lower basket size, higher returns, more support, slower seller settlement or a larger delivery subsidy. Expand only when the permitted investment, service obligations and loss limits remain explicit. A larger catalogue is not a successful scale decision if the operating burden grows faster than retained contribution."
  ]) + table("Pilot decisions and release gates", ["Stage", "Work", "Gate"], [
    ["Design", "Customer need, seller cohort, promise, policies and contribution model", "Owners approve the economics and obligations"],
    ["Rehearse", "Normal orders, cancellation, return, care and reconciliation", "Critical exceptions have a tested route"],
    ["Controlled launch", "Limited cohort with daily exception review", "Service and loss remain within approved limits"],
    ["Scale review", "Repeat demand and contribution after incentives", "Finance and operating owners validate the next category"]
  ]) + exhibit("03", "The scale gate", ["Repeat purchase", "Service reliability", "Contribution", "Cash after liabilities"]) + prose([
    "Public reference: <a href=\"https://www.ooredoo.com/en/media/news_view/ooredoo-to-launch-digital-marketplace-to-accelerate-business-transformation-across-mena-partners-with-kloudville/\" rel=\"noopener noreferrer\">Ooredoo's published B2B digital-marketplace announcement</a> is an example of a telecom marketplace proposition. It is not evidence of this blueprint's implementation or commercial results."
  ]) + `<div class="v4-impact-note"><span>Modeled business impact</span><p>No achieved revenue, adoption, margin or financial result is claimed. The blueprint describes the decisions, records and operating gates needed to test a marketplace proposition.</p></div>`)}`;
}

const trustControls = () => section("seller-risk-decisions", "How should marketplace seller-risk evidence change the decision?", prose([
  "A seller-risk model should prepare an evidence-backed review route, not issue a verdict from a score alone. Separate identity, rights, listing quality, fulfilment and payment concerns. A missing courier scan, an inaccurate stock feed and a counterfeit complaint require different checks and different owners.",
  "The following is a proposed control matrix. Adapt it to the platform's categories, contracts and applicable rules. A flag opens a case; it does not establish misconduct. Preserve the source, customer promise, reviewer decision, remedy and any appeal so false positives can be measured and corrected."
]) + table("Signal, evidence and permitted response", ["Concern", "Evidence to inspect", "Review route", "Remedy or appeal"], [
  ["Identity mismatch", "Submitted company records, authorized representative and verified account details", "Verification owner resolves the mismatch before activation", "Explain the missing or conflicting evidence and allow correction"],
  ["Product rights or authenticity concern", "Supplier invoice, brand authorization where relevant, product provenance and the listing shown at purchase", "Category and policy owners review the specific offer", "Use a proportionate temporary restriction where permitted; retain an appeal route"],
  ["Incorrect listing or variant", "Source specification, offered variant, image and customer order", "Catalogue reviewer distinguishes an error from a rights concern", "Correct the offer and remedy affected orders under policy"],
  ["Repeated late fulfilment", "Stock acknowledgement, seller preparation time, courier handover and promised delivery", "Operations separates seller and carrier causes", "Agree a corrective plan; review repeated failures with evidence"],
  ["Return or dispute pattern", "Reason codes, order cohort, customer contacts, inspection and refunds", "Disputes owner checks the denominator and alternative explanations", "Record the outcome and any overturned decision"],
  ["Payout anomaly", "Beneficiary change, seller ledger, provider references and settlement history", "Finance and risk review before an authorized release", "Keep any permitted hold bounded, documented and reviewable"]
]) + prose([
  "Use category-appropriate evidence. A serial identifier may be relevant for an electronic device; it is not a universal authenticity test for fragrance, apparel or accessories. Document which evidence applies to the product rather than requiring an invented identifier.",
  "Before automating a review route, test a labelled case set across seller sizes and categories. Measure missed cases, false positives, reviewer overrides, resolution time and appeals upheld. Reduced case volume is not success if legitimate sellers are suppressed or customers cannot report a problem."
]));

const retailActions = () => section("weekly-recovery-framework", "A weekly margin-to-cash recovery framework", prose([
  "Begin with the cash constraint and the store-and-category facts. Reconcile sales, product cost, stock age, available units, open purchases, rent, labour and returns before ranking interventions. A margin percentage can improve while cash remains tied up in a growing inventory balance.",
  "Use one action register with a baseline, proposed decision, accountable owner, expected timing and realized result. The illustrative sequence below is a management framework, not a claim that a particular business achieved these outcomes or a promise of recovery within a fixed period."
]) + table("Weekly recovery decisions", ["Stage", "Decision", "Evidence", "Result to reconcile"], [
  ["Establish the baseline", "Which store, category and commitment is consuming cash?", "Reconciled P&L, stock age, open orders and near-term obligations", "One starting position accepted by finance and operations"],
  ["Select interventions", "Transfer, markdown, supplier return, order reduction or continued holding?", "Demand, expected proceeds, selling costs and availability impact", "Expected contribution and cash timing recorded separately"],
  ["Execute a bounded test", "Which cohort and owner can implement the action?", "Approved price limits, stock movement and supplier constraints", "Actual execution against the action register"],
  ["Review weekly", "Did the intervention improve the intended result?", "Receipts, returns, remaining inventory and supplier payments", "Realized cash and full-store contribution"],
  ["Decide whether to scale", "Continue, change or stop the action?", "Comparison cohort where feasible, service impact and repeatability", "A documented decision rather than a sales-only success claim"]
]) + prose([
  "Separate three effects. A markdown changes proceeds and profit per unit. A supplier extension changes payment timing. A stock write-down changes accounting value without collecting cash. Do not add these together as interchangeable profit improvements.",
  "A transfer between stores is not a customer sale. A cancelled purchase commitment is not cash already received. A short-term clearance lift may pull demand forward or require expensive replenishment. Keep those distinctions in the review so the action does not look successful only because its later costs are outside the period.",
  "Historical evidence remains limited to the documented operating work on this page. New illustrations, frameworks and proposed tests do not add an achieved group-wide turnaround or an unpublished financial percentage."
]));

const modelInputs = [
  ["aov", "Completed-order value", 250, "1"], ["takeRate", "Effective retained commission (%)", 12, "0.1"],
  ["deliveryRevenue", "Customer delivery charge retained", 10, "0.1"], ["fulfilment", "Fulfilment cost", 12, "0.1"],
  ["packaging", "Packaging cost", 2, "0.1"], ["payments", "Payment-processing cost", 5, "0.1"],
  ["care", "Customer-care cost", 2, "0.1"], ["claims", "Expected returns and claims cost", 3, "0.1"],
  ["incentives", "Platform-funded incentive", 6, "0.1"], ["monthlyOrders", "Completed orders per month", 1000, "1"],
  ["fixedCost", "Monthly fixed operating cost", 20000, "1"]
];
const contributionModel = () => section("worked-contribution-model", "Worked marketplace contribution model", prose([
  "This example models a third-party marketplace acting as an agent, using one common monetary unit for all amounts. An order value of 250 at a retained commission of 12% produces 30 of commission. Add 10 of retained delivery revenue: platform revenue is 40, not the order's GMV of 250.",
  "Fulfilment of 12, packaging of 2, processing of 5, care of 2, expected returns and claims of 3, and incentives of 6 total 30 of variable cost. Contribution is therefore 10 per completed order, equivalent to 25% of retained platform revenue or 4% of GMV. Those percentages use different denominators and should be labelled accordingly."
]) + table("Illustrative completed-order waterfall", ["Item", "Amount", "Calculation"], [
  ["Completed GMV", "250.00", "Transaction activity; not platform revenue"],
  ["Retained commission", "30.00", "250 x 12%"], ["Delivery revenue", "10.00", "Retained customer charge"],
  ["Platform revenue", "40.00", "30 + 10"], ["Variable cost", "30.00", "12 + 2 + 5 + 2 + 3 + 6"],
  ["Order contribution", "10.00", "40 - 30"], ["Contribution / platform revenue", "25.0%", "10 / 40"],
  ["Contribution / GMV", "4.0%", "10 / 250"]
]) + `<div class="contribution-tool" data-contribution-model><h3>Test your own assumptions</h3><p>Illustrative defaults, not market benchmarks or a disclosed operating business case. All monetary inputs must use the same currency and tax basis.</p><div class="contribution-inputs">${modelInputs.map(([key, label, value, step]) => `<label>${label}<input type="number" name="${key}" value="${value}" min="0"${key === "takeRate" ? ' max="100"' : ""} step="${step}" inputmode="decimal"></label>`).join("")}</div><div class="contribution-results" aria-live="polite" aria-atomic="true"><p><strong>Order contribution: <span data-model-output="contribution">10.00</span></strong></p><p>Retained revenue: <span data-model-output="revenue">40.00</span> · Variable cost: <span data-model-output="variableCost">30.00</span></p><p>Monthly result after entered fixed cost: <span data-model-output="monthlyResult">-10,000.00</span></p><p>Orders to cover entered fixed cost: <span data-model-output="breakEvenOrders">2,000</span></p></div><p class="contribution-error" data-model-error role="alert" hidden></p><button type="button" class="button" data-model-download>Download scenario (.csv)</button><p class="source-note">The export is a snapshot of your entered scenario. Calculations run in this browser; inputs are not sent to a server.</p></div>` + prose([
  "At the default assumptions, 1,000 orders produce 10,000 of contribution. With fixed monthly operating cost of 20,000, the result is negative 10,000. It takes 2,000 completed orders to cover that fixed cost at unchanged positive order contribution. If contribution is zero or negative, additional volume does not produce a break-even order count.",
  "The effective commission assumption should reflect the revenue actually retained after cancellations, refunds and fee reversals. Expected returns and claims should capture additional unrecovered cost, without counting those same revenue reversals twice. This simplified model excludes inventory ownership, VAT differences, financing, capital expenditure and cash timing. It is not a full accounting model or cash forecast."
])) + '<script type="module" src="/assets/order-contribution.js"></script>';

export function priorityContentFor(path) {
  if (path === "/use-cases/ai-marketplace-trust-quality-layer") return trustControls();
  if (path === "/use-cases/retail-group-transformation") return retailActions();
  if (path === "/insights/marketplace-economics-gmv-revenue-contribution-gcc") return contributionModel();
  if (path === "/track-record") return section("responsibility-and-evidence", "Operating responsibility and evidence", prose([
    "Each record distinguishes the work Haris was responsible for from financial or operating outcomes that can be publicly supported. An operating role does not establish every business result, and a strategy blueprint is not presented as a deployed client programme."
  ]) + table("Read the record by responsibility", ["Business", "Responsibility", "Public evidence boundary"], [
    ["Roumaan", "Founder and operator: customer proposition, catalogue, trading, orders and fulfilment", "Live online retail operation; no unpublished revenue or third-party marketplace outcome claimed"],
    ["Salman Corporation / Miraq Lifestyle", "Operating and investment leadership: store and category economics, stock, procurement and portfolio choices", "Documented commercial and operating reset; no group-wide financial uplift claimed"],
    ["Floward Oman", "Country launch and operating leadership: local trading, assortment and fulfilment", "Local operating setup and responsibility; no market-share percentage published"],
    ["UpApp Factory", "Co-founder and operator: scope, partner delivery, testing and handover", "Contracted digital-product delivery; no client financial gains or studio profitability published"]
  ]));
  return "";
}
