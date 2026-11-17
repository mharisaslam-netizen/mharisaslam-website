// Reviewed topic relationships. These are reader routes, not a list of SEO keywords.
export const searchUpdateDate = "2026-11-17";

export const shortInsightSections = {
  "seller-onboarding-economics": [
    ["Measure the seller funnel after registration", "Keep verification, accepted catalogue, available stock, tested fulfilment and first completed order as separate stages. Each stage has its own owner and failure reason. A seller that passes identity checks but cannot maintain stock should not be counted as productive supply. Measure time and manual effort between stages, including seller contacts and repeated catalogue corrections."],
    ["Review contribution by activation cohort", "Group sellers by activation month and category, then follow their completed orders, cancellation, support, returns and repeat trading. Compare the contribution they generate with verification, catalogue preparation, integration and support effort. A large seller may need more onboarding work and still be attractive; a cheaply registered seller may remain a permanent support cost. The decision depends on the full cohort economics."],
    ["Test automation at one release gate", "Begin with a bounded task such as extracting proposed product attributes from a supplier file. Preserve the source value, suggested value and reviewer correction. Compare first-pass accuracy and manual minutes with the existing process. Do not claim an onboarding saving if the work simply moves to returns or customer care after launch."]
  ],
  "margin-to-cash-retail-turnaround": [
    ["Separate profit movements from cash movements", "A markdown reduces the selling price and may reduce profit per unit while accelerating cash collection. A supplier extension changes cash timing without improving product margin. An inventory write-down recognizes an accounting loss but does not itself collect cash. Put these actions in separate columns so management can see whether the intervention improves profitability, liquidity or both."],
    ["Build the weekly action register", "For each category or store, record the starting stock, ageing, expected proceeds, full selling cost, open purchase commitments and the person responsible for the action. Compare a transfer, targeted markdown, supplier return and continued holding. Include lost availability and replacement cost: selling a useful item cheaply and buying it back can create activity without value."],
    ["Reconcile the result with finance", "Follow actual cash receipts, returns, remaining stock and supplier payments after the intervention. Separate inventory moved between stores from inventory sold to a customer. Keep an untreated comparison where feasible and account for seasonality. Do not add a margin benefit and a stock-cash release as though they were two independent additions to profit."]
  ],
  "agent-led-social-commerce-economics": [
    ["Agree attribution before paying commission", "Define what makes an order attributable to an agent: an eligible link or code, a stated attribution window, a completed transaction and a rule for competing claims. Decide how repeat purchases are treated. The merchant, agent and platform should see the same order reference and commission basis, rather than negotiating ownership after a sale."],
    ["Follow the order through returns and settlement", "Commission earned on an order that is later cancelled or refunded needs an explicit reversal treatment. Separate pending, approved and paid commission, and record the event that moves money between those states. The operating cost includes dispute handling, payout reconciliation, merchant support and the delivery experience represented by the agent."],
    ["Judge the model by repeat contribution", "A useful pilot follows one merchant-agent cohort through completed orders, repeat customers and return-adjusted payouts. Compare customer acquisition and service costs with the same merchant's existing channel. More agent registrations do not prove incremental demand: some orders may have occurred anyway or shifted from a cheaper route. Scale only when attribution, service and retained contribution hold together."]
  ],
  "commerce-tasks-for-ai-agents": [
    ["Choose a task with a checkable answer", "An order-status summary can be checked against the order system; catalogue attributes can be checked against a supplier source. Select one task and define the record that determines correctness. If the source is missing or contradictory, the useful result is an explicit exception, not a confident answer. Measure the review effort as well as the apparent time saved."],
    ["Separate a recommendation from an authorized action", "The permission to read an order is different from the permission to refund it. A draft response is different from a message sent to a customer. Give each tool a narrow purpose, allowed inputs, financial limits where relevant and an audit record. Consequential changes require the approved policy and the accountable person's authority."],
    ["Evaluate the failure paths before expansion", "Include cancelled orders, partial refunds, stale inventory, duplicate requests, unavailable APIs and contradictory policy in the test set. Verify that a retry cannot apply the same action twice and that tool failure is visible to the operating team. Compare assisted and existing workflows on resolution, repeat contacts, errors and total cost before expanding automation."]
  ],
  "rag-versus-live-operational-apis": [
    ["Ask whether the answer changes during the working day", "A returns policy is approved knowledge. Whether a particular order is eligible for a return also depends on current delivery time, prior refunds, item condition and account history. Retrieval can explain the rule, while operational APIs supply those changing facts. A document that describes yesterday's stock is still a document; retrieval does not make it live."],
    ["Keep rule evidence and transaction evidence separate", "Record the policy version and passage used, the operational record identifier, retrieval time and the decision made. If the policy and account system disagree, the workflow should expose the conflict and route it to the owner. Do not ask a language model to silently choose which source is authoritative for a financial or customer-rights decision."],
    ["Design for unavailable or stale data", "An API failure must not trigger a guessed balance, price or delivery date. Define freshness limits for each fact, return an explicit unavailable state and make the next operating step clear. Before allowing an action, recheck the relevant facts and permissions. Evaluate source selection, factual accuracy and safe failure separately; a fluent answer can still use the wrong evidence."]
  ],
  "warehouse-capacity-as-a-3pl-business": [
    ["Spare space is only one part of capacity", "A warehouse may have empty locations while receiving docks, pickers, packing stations or dispatch cutoffs are already constrained. Map the external customer's service promise against each resource, including peak days and returns. Confirm custody, insurance, stock accuracy, claims and system integration before treating a free rack as saleable capacity."],
    ["Model the external contract on its own", "Separate storage, inbound handling, picking, packing, transport and value-added service charges. Against them, include labour, consumables, system support, claims, management time and any extra shift or equipment. Shared costs may be allocated differently for accounting and for an incremental decision, but neither view should hide the cost of the next capacity step."],
    ["Prove an anchor customer before committing fixed cost", "Use a defined pilot with realistic order profiles, stock movements and service penalties. Test the fee at low volume, peak demand and a higher return rate. Track the effect on the original retail operation as well as the new customer. A contract that appears profitable can destroy value if it displaces higher-contribution internal work or requires capacity before committed demand arrives."]
  ]
};

const clusters = [
  [
    ["/insights/marketplace-economics-gmv-revenue-contribution-gcc", "Marketplace economics: GMV, revenue, contribution and cash"],
    ["/use-cases/telco-led-national-marketplace", "Telco marketplace operating model"],
    ["/use-cases/multi-category-digital-commerce", "Multi-category commerce operating case"],
    ["/track-record/roumaan", "Roumaan: marketplace founder experience"],
    ["/insights/seller-onboarding-economics", "Seller onboarding economics"]
  ],
  [
    ["/insights/seller-onboarding-economics", "Seller onboarding economics"],
    ["/use-cases/ai-seller-onboarding-factory", "AI seller onboarding and trade readiness"],
    ["/use-cases/ai-marketplace-trust-quality-layer", "Marketplace seller risk, listing quality and disputes"],
    ["/use-cases/ai-category-merchandising-copilot", "AI category and merchandising decisions"]
  ],
  [
    ["/insights/margin-to-cash-retail-turnaround", "Margin, inventory and cash in a retail turnaround"],
    ["/use-cases/retail-group-transformation", "Retail group transformation operating case"],
    ["/use-cases/90-day-margin-to-cash-turnaround", "90-day margin-to-cash model"],
    ["/use-cases/ai-retail-turnaround-cockpit", "AI retail turnaround cockpit"],
    ["/business-performance", "Retail margin, working capital and business performance"],
    ["/track-record/salman-miraq", "Retail transformation operating experience"]
  ],
  [
    ["/insights/saudi-market-entry-retail-commerce-economics", "Saudi retail market-entry economics"],
    ["/markets/saudi-arabia", "Saudi Arabia market-entry perspective"],
    ["/use-cases/saudi-market-entry-distribution", "Saudi distribution and e-commerce entry model"],
    ["/gcc-growth-transformation", "GCC growth and transformation"],
    ["/markets/uae", "UAE growth and regional operating models"]
  ],
  [
    ["/insights/rag-versus-live-operational-apis", "RAG knowledge versus live operational APIs"],
    ["/insights/commerce-tasks-for-ai-agents", "Which commerce tasks to automate with agents"],
    ["/insights/ai-transformation-gcc-enterprise-operating-model", "Enterprise AI operating model"],
    ["/use-cases/ai-enterprise-workflow-copilot", "Enterprise workflow copilot"],
    ["/use-cases/ai-customer-care-operating-model", "AI customer care with live order evidence"],
    ["/ai-commerce", "AI Commerce Command Center"]
  ],
  [
    ["/insights/warehouse-capacity-as-a-3pl-business", "When spare warehouse capacity can support a 3PL business"],
    ["/use-cases/warehouse-working-capital-3pl", "Warehouse and working-capital reset"],
    ["/use-cases/ai-working-capital-inventory-agent", "AI working-capital and inventory decisions"],
    ["/insights/distributor-cash-allocation-operating-system-ai", "Distributor cash-allocation operating system"]
  ],
  [
    ["/insights/payment-volume-versus-net-revenue", "Payments: volume versus net revenue"],
    ["/use-cases/payments-embedded-finance-growth", "Payments and embedded-finance growth model"],
    ["/use-cases/leading-saudi-bank-commerce-ecosystem", "Saudi bank commerce ecosystem blueprint"],
    ["/use-cases/oman-banking-commerce-and-rewards-ecosystem", "Oman bank rewards and commerce model"]
  ]
];

export function relatedReadingFor(path) {
  const candidates = clusters.filter(group => group.some(([href]) => href === path)).flat();
  return [...new Map(candidates.filter(([href]) => href !== path)).entries()].slice(0, 4);
}

// Hypothetical operating tests; no client deployment or achieved result is implied.
export const practicalCaseNotes = {
  "/use-cases/ai-marketplace-trust-quality-layer": {
    heading: "A late order needs evidence before it becomes a seller sanction",
    scenario: "Consider a seller with rising delivery complaints. A late courier scan, an inaccurate stock feed and deliberate misrepresentation need different responses. The reviewer first separates seller preparation time from carrier transit, checks the promised delivery window and reads the actual cancellation and return reasons. A single risk score must not collapse these causes into one accusation.",
    test: "Build a labelled review set across categories and seller sizes. Compare reviewer decisions with the proposed route, then measure false positives alongside missed cases and dispute cycle time. Keep appeals and overturned decisions in the evaluation set. An apparent reduction in complaints is not success if legitimate sellers are suppressed or customers stop reporting problems.",
    boundary: "Identification, serial-number or authenticity evidence depends on the product category. Electronics may have serial identifiers; perfume, apparel and accessories need different provenance and listing checks. The system must show which required evidence is missing rather than inventing an identifier or treating its absence as fraud."
  },
  "/use-cases/ai-seller-onboarding-factory": {
    heading: "A registered seller is not yet ready to accept an order",
    scenario: "A seller can upload a company document and hundreds of product rows while remaining unable to fulfil a single order reliably. Check product rights, variant mapping, Arabic and English attributes, current stock, collection cutoffs, returns responsibility and settlement details. Treat these as separate release conditions so a clean catalogue does not hide an unresolved operating obligation.",
    test: "Pilot one category from document submission through the first completed and return-adjusted order. Record manual minutes, rejected fields, repeated seller contacts, activation errors and time to first trade. Compare with the existing process using similarly complex sellers. Faster document processing has little value if catalogue corrections or cancellations rise after activation.",
    boundary: "AI can extract a document and propose an attribute. It cannot certify legal identity, assume product rights or approve a regulated listing. Keep the original source beside each proposed field, record the review decision and prevent activation while a required control is unresolved."
  },
  "/use-cases/ai-retail-turnaround-cockpit": {
    heading: "A markdown should improve the recovery decision, not just sales",
    scenario: "Consider aged stock that still shows a healthy accounting margin. Compare a transfer, a targeted markdown, a supplier return and continued holding. Include expected sell-through, transfer and selling costs, likely future markdown, shelf space and the time until cash returns. Separate the book value written down from cash actually collected; they answer different management questions.",
    test: "Choose a small store-and-category cohort and record the intervention before it starts. Finance reconciles sales proceeds, product cost, discount, transfer cost, returns and remaining stock. The weekly meeting should explain which action released cash and which merely moved inventory or pulled sales forward. Compare with an appropriate untreated cohort where possible.",
    boundary: "A recommendation does not authorize a price change, purchase commitment or store closure. Merchandising owns the category action, operations confirms execution constraints and finance validates the result. Do not count the same improvement once as margin benefit and again as an independent cash saving."
  },
  "/use-cases/ai-working-capital-inventory-agent": {
    heading: "Buying less can release cash and still damage the business",
    scenario: "For a slow-moving item, compare demand, available stock, open purchase orders, minimum order quantities, supplier terms and the cost of a stockout. An inventory reduction is not automatically a better decision: the item may support a profitable bundle or a service commitment. Explain the trade-off at SKU and supplier level before aggregating it into a cash-release scenario.",
    test: "Run recommendations without changing purchase orders during the first pilot. Buyers record whether they would accept, modify or reject each suggestion and why. After an approved trial, measure actual cash timing, availability, expediting, lost contribution and inventory age. Reconcile open commitments as well as stock on hand so cancelled or delayed orders are not mistaken for cash already recovered.",
    boundary: "Live ERP balances, contractual supplier terms and finance records remain authoritative. The agent must not negotiate new commitments or change payment terms by inference. A buyer approves purchasing changes; finance confirms whether the resulting cash movement is realized, deferred or only forecast."
  }
};
