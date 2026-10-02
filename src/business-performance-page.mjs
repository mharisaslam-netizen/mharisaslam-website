export const businessPerformancePage = {
  path: "/business-performance",
  type: "WebPage",
  kind: "business-performance",
  v3: true,
  title: "Business Performance in the GCC | Haris Aslam",
  description: "An operator's perspective on stronger margins, healthier cash and disciplined growth for established businesses in Qatar, Oman, Saudi Arabia and Bahrain.",
  eyebrow: "Business Performance",
  h1: "Stronger margins. Healthier cash flow. Growth you can execute.",
  intro: "An operator’s perspective on the commercial and operating questions facing established businesses across the GCC.",
  v3Body: `
<section class="bp-hero">
  <div class="bp-shell">
    <div class="bp-breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Business Performance</span></div>
    <div class="bp-hero-layout">
      <div class="bp-hero-copy">
        <p class="bp-eyebrow bp-pill">BUSINESS PERFORMANCE</p>
        <h1>Stronger margins.<br>Healthier cash flow.<br><span>Growth you can execute.</span></h1>
        <div class="bp-spectrum" aria-hidden="true"></div>
        <p class="bp-hero-intro">As a business grows across stores, products or channels, sales tell only part of the story. The next decisions shape how much growth earns, how quickly it turns into cash and how consistently the team can deliver.</p>
        <p class="bp-hero-support">An operator’s perspective on the commercial and operating questions facing established businesses across the GCC.</p>
        <div class="bp-actions"><a class="bp-button bp-button-light" href="#operating-questions">Explore the operating questions</a><a class="bp-button bp-button-outline" href="#operating-evidence">View the experience</a></div>
      </div>
      <div class="bp-hero-visual">
        <figure class="bp-operating-image"><img src="/assets/business-performance-hero.webp" alt="Conceptual illustration connecting retail, inventory, fulfilment and disciplined business operations" width="1200" height="800" fetchpriority="high"><figcaption>Commercial decisions. Connected operations.</figcaption></figure>
        <div class="bp-priority-strip" aria-label="Three operating priorities"><div><span>01</span><strong>Grow what earns</strong></div><div><span>02</span><strong>Free up trapped cash</strong></div><div><span>03</span><strong>Make execution repeatable</strong></div></div>
        <p class="bp-image-note">Conceptual illustration of an operating business.</p>
      </div>
    </div>
    <div class="bp-hero-foot"><span>COMMERCIAL PERFORMANCE</span><span>WORKING CAPITAL</span><span>DISCIPLINED GROWTH</span><span>OPERATING EXECUTION</span></div>
  </div>
</section>
<section class="bp-context-section">
  <div class="bp-shell bp-context-layout">
    <p class="bp-eyebrow">THE OWNER’S VIEW</p>
    <div><h2>The business is bigger.<br>Are the returns stronger?</h2><p>Long-standing customer relationships, market knowledge and entrepreneurial judgement are valuable foundations. As complexity grows, owners and management need a shared view of where value is created, where cash is tied up and which decisions still depend on too few people.</p><p class="bp-context-emphasis">That is where commercial performance and everyday execution need to come together.</p></div>
  </div>
</section>
<section class="bp-questions-section bp-section" id="operating-questions">
  <div class="bp-shell">
    <div class="bp-section-heading"><div><p class="bp-eyebrow">FOUR OPERATING QUESTIONS</p><h2>Start with the pressure<br>the business is feeling.</h2></div><p>Each question should lead to a decision, a named owner and evidence that something is improving.</p></div>
    <div class="bp-question-layout">
      <div class="bp-question-tabs" role="tablist" aria-label="Business performance questions" aria-orientation="vertical">
        <button class="bp-question-tab" id="tab-margin" role="tab" aria-controls="panel-margin" aria-selected="true" tabindex="0"><span class="bp-tab-index">01</span><span><span class="bp-tab-label">PROFITABILITY</span><strong>Sales are growing.<br>Margin is not keeping up.</strong></span><span class="bp-tab-plus" aria-hidden="true">+</span></button>
        <button class="bp-question-tab" id="tab-cash" role="tab" aria-controls="panel-cash" aria-selected="false" tabindex="-1"><span class="bp-tab-index">02</span><span><span class="bp-tab-label">CASH</span><strong>There is stock and activity.<br>Cash still feels tight.</strong></span><span class="bp-tab-plus" aria-hidden="true">+</span></button>
        <button class="bp-question-tab" id="tab-growth" role="tab" aria-controls="panel-growth" aria-selected="false" tabindex="-1"><span class="bp-tab-index">03</span><span><span class="bp-tab-label">GROWTH</span><strong>The opportunity is attractive.<br>The next commitment is large.</strong></span><span class="bp-tab-plus" aria-hidden="true">+</span></button>
        <button class="bp-question-tab" id="tab-execution" role="tab" aria-controls="panel-execution" aria-selected="false" tabindex="-1"><span class="bp-tab-index">04</span><span><span class="bp-tab-label">EXECUTION</span><strong>The plan is clear.<br>Too much still comes back to you.</strong></span><span class="bp-tab-plus" aria-hidden="true">+</span></button>
      </div>
      <div class="bp-question-panels">
        <article class="bp-question-panel" id="panel-margin" role="tabpanel" aria-labelledby="tab-margin" tabindex="0">
          <p class="bp-panel-kicker">READ THE ECONOMICS</p><h3>What does each sale<br>really contribute?</h3><p>Revenue can hide discounting, weak product mix and expensive service. Read performance by product, customer and channel, including the cost of fulfilment, returns and support.</p>
          <div class="bp-decision-block"><span>THE DECISION</span><p>Where should pricing, assortment, customer terms or channel effort change before more volume is added?</p></div>
          <h4>Put the evidence on one page</h4><ul><li>Sales and gross margin by category or channel</li><li>Discounts, returns and cost to serve</li><li>Contribution after the costs that move with the sale</li></ul>
          <p class="bp-panel-bottom">A useful result: a clear view of what to grow, reprice, simplify or stop.</p>
        </article>
        <article class="bp-question-panel" id="panel-cash" role="tabpanel" aria-labelledby="tab-cash" tabindex="0">
          <p class="bp-panel-kicker">FOLLOW THE CASH</p><h3>Where is cash waiting<br>to become useful again?</h3><p>Stock on the shelf, slow collections and supplier commitments compete for the same cash. Purchasing and sales decisions need to be read together, with finance and operations using the same facts.</p>
          <div class="bp-decision-block"><span>THE DECISION</span><p>Which purchases should slow down, which stock needs a commercial action and which collection issues need an accountable owner?</p></div>
          <h4>Put the evidence on one page</h4><ul><li>Stock age, sell-through and open purchase commitments</li><li>Receivables ageing, disputes and collection ownership</li><li>Supplier terms alongside expected customer receipts</li></ul>
          <p class="bp-panel-bottom">A useful result: specific cash-release actions with their margin and service trade-offs visible.</p>
        </article>
        <article class="bp-question-panel" id="panel-growth" role="tabpanel" aria-labelledby="tab-growth" tabindex="0">
          <p class="bp-panel-kicker">PROVE THE NEXT STEP</p><h3>What must be true<br>before committing more?</h3><p>A new market, brand, store or digital channel creates another operating obligation. The case needs customer demand, commercial rights, landed cost and local delivery capacity to work together.</p>
          <div class="bp-decision-block"><span>THE DECISION</span><p>What is the smallest credible test, what capital does it put at risk and what evidence would justify the next commitment?</p></div>
          <h4>Put the evidence on one page</h4><ul><li>Customer demand and route-to-market assumptions</li><li>Landed contribution and working-capital requirement</li><li>Local capabilities, decision gates and stop conditions</li></ul>
          <p class="bp-panel-bottom">A useful result: a staged growth decision, with explicit conditions for expanding or pausing.</p>
        </article>
        <article class="bp-question-panel" id="panel-execution" role="tabpanel" aria-labelledby="tab-execution" tabindex="0">
          <p class="bp-panel-kicker">MAKE THE PLAN OPERABLE</p><h3>Can the team act<br>without another escalation?</h3><p>A business can outgrow its informal ways of working. Repeated exceptions, unclear authority and fragmented systems make routine decisions slow, even when the strategy is understood.</p>
          <div class="bp-decision-block"><span>THE DECISION</span><p>Which decisions belong with the team, what information do they need and which exceptions should come back to leadership?</p></div>
          <h4>Put the evidence on one page</h4><ul><li>Critical workflows and recurring points of delay</li><li>A named decision owner and clear escalation limits</li><li>A short operating review tied to margin, cash and service</li></ul>
          <p class="bp-panel-bottom">A useful result: clearer accountability, fewer avoidable hand-offs and a way to check execution.</p>
        </article>
      </div>
    </div>
  </div>
</section>
<section class="bp-approach-section bp-section" id="working-approach">
  <div class="bp-shell">
    <div class="bp-section-heading"><div><p class="bp-eyebrow">FROM QUESTION TO EXECUTION</p><h2>A practical way<br>to work through it.</h2></div><p>The analysis becomes useful when management can act on it and review the consequences.</p></div>
    <div class="bp-approach-grid">
      <article><div class="bp-step-number">01</div><h3>Establish the facts</h3><p>Build a shared view of sales, margin, cash and service. Mark assumptions and data gaps clearly.</p><span class="bp-output-label">A usable performance baseline</span></article>
      <article><div class="bp-step-number">02</div><h3>Choose the few moves</h3><p>Separate immediate leakage from longer-term opportunity. Make the trade-offs and capital required visible.</p><span class="bp-output-label">A short list of decisions</span></article>
      <article><div class="bp-step-number">03</div><h3>Make ownership clear</h3><p>Connect each decision to a person, workflow, system and review date. Keep authority close to the work.</p><span class="bp-output-label">An executable operating plan</span></article>
      <article><div class="bp-step-number">04</div><h3>Review against reality</h3><p>Track the operating evidence. Adjust where the economics, customer response or team capacity differ from the plan.</p><span class="bp-output-label">A repeatable review rhythm</span></article>
    </div>
    <div class="bp-technology-note"><span class="bp-tech-mark" aria-hidden="true">AI</span><div><h3>Technology has to earn its place.</h3><p>Digital tools and AI are useful when they improve a defined workflow or decision. Start with reliable data and a measurable operating need. Keep authority over money, customers and material risk with people.</p></div><a href="/ai-transformation">Explore the AI perspective</a></div>
  </div>
</section>
<section class="bp-evidence-section bp-section" id="operating-evidence">
  <div class="bp-shell">
    <div class="bp-evidence-intro"><div><p class="bp-eyebrow">OPERATING EXPERIENCE</p><h2>A perspective built<br>inside the operation.</h2><p>My experience spans retail performance, country launches and building commerce businesses. The common thread is connecting the commercial proposition to the people, systems and daily decisions that deliver it.</p></div><div class="bp-profile"><img src="/assets/haris-aslam.webp" alt="Muhammad Haris Aslam" width="717" height="960" loading="lazy"><div><strong>Muhammad Haris Aslam</strong><span>Operator, founder<br>and business builder</span><a href="/about">Read the background</a></div></div></div>
    <div class="bp-evidence-grid">
      <article class="bp-evidence-card bp-evidence-featured"><div class="bp-evidence-top"><span class="bp-eyebrow">OMAN &amp; GCC · 2023-25</span><span class="bp-evidence-index">01</span></div><h3>Salman Corporation /<br>Miraq Lifestyle</h3><p class="bp-role">Operating and investment leadership</p><p>Connected retail and category performance with inventory, procurement, cash and portfolio decisions.</p><div class="bp-evidence-relevance"><span>RELEVANT OPERATING QUESTION</span><p>How do store, category and stock decisions change the health of the wider business?</p></div><a class="bp-text-link" href="/track-record/salman-miraq">Read the operating record</a></article>
      <article class="bp-evidence-card"><div class="bp-evidence-top"><span class="bp-eyebrow">OMAN · COUNTRY OPERATIONS</span><span class="bp-evidence-index">02</span></div><h3>Floward Oman</h3><p class="bp-role">Country launch and operating leadership</p><p>Built the local commercial and fulfilment setup, connecting assortment, suppliers, trading campaigns and delivery execution.</p><div class="bp-evidence-relevance"><span>RELEVANT OPERATING QUESTION</span><p>Can the local operation deliver the customer promise as demand grows?</p></div><a class="bp-text-link" href="/track-record/floward-oman">Read the operating record</a></article>
      <article class="bp-evidence-card"><div class="bp-evidence-top"><span class="bp-eyebrow">OMAN · 2014-18</span><span class="bp-evidence-index">03</span></div><h3>Roumaan</h3><p class="bp-role">Founder and operator</p><p>Built and operated a multi-category online retailer, spanning the proposition, catalogue, merchandising, order flow and fulfilment.</p><div class="bp-evidence-relevance"><span>RELEVANT OPERATING QUESTION</span><p>Does the proposition hold together from the customer’s first visit to the delivered order?</p></div><a class="bp-text-link" href="/track-record/roumaan">Read the operating record</a></article>
    </div>
    <div class="bp-current-focus"><span class="bp-eyebrow">CURRENT OPERATING FOCUS</span><p>Strategic digital commerce, marketplace and operating-model transformation within a major telecom operator in Qatar.</p></div>
    <p class="bp-evidence-boundary">The linked records describe role and scope. They do not claim an unpublished group-wide financial uplift.</p>
  </div>
</section>
<section class="bp-reading-section bp-section">
  <div class="bp-shell"><div class="bp-section-heading"><div><p class="bp-eyebrow">TAKE THE QUESTION FURTHER</p><h2>Thinking you can examine.</h2></div><p>Published perspectives on the decisions behind stronger performance.</p></div>
    <div class="bp-reading-grid">
      <a class="bp-reading-card" href="/insights/distributor-cash-allocation-operating-system-ai"><span class="bp-reading-category">CASH &amp; DISTRIBUTION</span><h3>Where is cash trapped?</h3><p>A proposed framework for connecting stock, receivables and commercial choices to cash allocation.</p><span class="bp-reading-link">Read the perspective</span></a>
      <a class="bp-reading-card" href="/insights/marketplace-economics-gmv-revenue-contribution-gcc"><span class="bp-reading-category">COMMERCE ECONOMICS</span><h3>Growth beyond the headline.</h3><p>Follow the bridge from transaction value to revenue, contribution and cash.</p><span class="bp-reading-link">Read the perspective</span></a>
      <a class="bp-reading-card" href="/insights/saudi-market-entry-retail-commerce-economics"><span class="bp-reading-category">DISCIPLINED EXPANSION</span><h3>The economics before entry.</h3><p>Examine demand, landed contribution and operating readiness before expanding into Saudi Arabia.</p><span class="bp-reading-link">Read the perspective</span></a>
    </div>
    <div class="bp-regional-note"><strong>A GCC perspective, with market-level decisions.</strong><p>The questions are relevant across Qatar, Oman, Saudi Arabia and Bahrain. Customer behaviour, commercial arrangements and operating requirements still need to be tested market by market.</p></div>
  </div>
</section>
<section class="bp-contact-section"><div class="bp-shell bp-contact-layout"><div><p class="bp-eyebrow">CONTINUE THE CONVERSATION</p><h2>Start with a specific<br>business question.</h2><p>For questions about the ideas or operating experience shared here, connect by email or LinkedIn.</p></div><div class="bp-contact-actions"><a class="bp-button bp-button-light" href="/contact">Contact Haris</a><a class="bp-contact-secondary" href="/track-record">Explore the full track record</a></div></div></section>
`
};
