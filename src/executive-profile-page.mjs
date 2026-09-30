const expertise = [
  {
    label: "Commerce & marketplaces",
    question: "Does growth earn its cost?",
    method: "Follow a completed order through product margin, partner share, payments, fulfilment, returns and acquisition. Read contribution and cash alongside GMV and revenue. For a marketplace, seller quality, service responsibility and settlement belong in the same model.",
    experience: "Roumaan provides the first-party commerce context. Marketplace and ecosystem blueprints extend the analysis into different business models; their proposed results remain separate from that operating history.",
    links: [
      ["/track-record/roumaan", "Operating experience: Roumaan"],
      ["/insights/marketplace-economics-gmv-revenue-contribution-gcc", "Insight: GMV, revenue, contribution and cash"],
      ["/use-cases/leading-saudi-bank-commerce-ecosystem", "Strategy blueprint: bank commerce ecosystem"]
    ]
  },
  {
    label: "Retail & working capital",
    question: "Where is cash getting trapped?",
    method: "Bring store and category performance together with stock age, markdown, purchasing and supplier terms. Test whether a margin decision releases cash, whether a new channel earns its cost, and what must change before more capital is committed.",
    experience: "The Salman Corporation / Miraq Lifestyle record connects store and category performance to stock, procurement, cash and portfolio choices. It shows how the operating review and investment decisions were linked.",
    links: [
      ["/track-record/salman-miraq", "Operating experience: retail and portfolio work"],
      ["/use-cases/retail-group-transformation", "Case: retail group transformation"],
      ["/insights/distributor-cash-allocation-operating-system-ai", "Insight: distributor cash allocation"]
    ]
  },
  {
    label: "Growth & new ventures",
    question: "What must be true before scale?",
    method: "Connect customer demand to commercial rights, landed economics, local capacity and the cash needed before revenue arrives. Define a narrow first market or channel and the evidence required for the next investment decision.",
    experience: "Floward Oman gives this thinking a country-launch context: local assortment, supplier coordination, trading and fulfilment. Saudi and UAE strategy cases explore how commercial rights, channel economics and local capacity change the expansion decision.",
    links: [
      ["/track-record/floward-oman", "Operating experience: Floward Oman"],
      ["/insights/saudi-market-entry-retail-commerce-economics", "Insight: the economics before expansion"],
      ["/use-cases/saudi-market-entry-distribution", "Case: Saudi distribution and commerce entry"]
    ]
  },
  {
    label: "Technology & applied AI",
    question: "Which decisions can be improved?",
    method: "Start with the workflow and its source of truth. Make the handoffs, permissions, exception paths and accountable owner explicit. Use AI to prepare evidence and recommendations, then test accuracy, service quality and the full cost of supervision.",
    experience: "UpApp Factory provides the digital-product delivery context. The AI work applies that operating lens to new workflows and product concepts, with live products, development work and proposed models identified on their own pages.",
    links: [
      ["/track-record/upapp-factory", "Operating experience: UpApp Factory"],
      ["/insights/ai-transformation-gcc-enterprise-operating-model", "Insight: the AI operating model"],
      ["/ai-commerce", "In development: AI Commerce Command Center"]
    ]
  }
];

const faq = [
  {
    question: "What connects these areas of expertise?",
    answer: "A focus on the connection between customer demand, commercial economics, operating ownership and technology. Each area starts with a business question and the evidence needed to make a decision."
  },
  {
    question: "Which work is operating experience, and which is a proposed model?",
    answer: "The track record describes named businesses where Haris held direct operating responsibility. Use-case pages identify strategy blueprints, product concepts and modeled outcomes separately. An analytical model is not presented as an achieved result."
  },
  {
    question: "What is the geographic perspective?",
    answer: "The perspective is grounded in operating experience in Oman and Qatar, alongside research and strategy cases for wider GCC markets. Market pages explore local economics, channels and operating conditions; they do not imply a physical presence in every country."
  }
];

export const executiveProfilePage = {
  path: "/gcc-executive-profile",
  type: "ProfilePage",
  kind: "operating-profile",
  title: "Commerce, Growth & AI Expertise | Haris Aslam",
  description: "Explore Haris Aslam's operating perspective on commerce economics, retail cash, GCC growth and applied AI, with specific experience, cases and practical insights.",
  eyebrow: "Expertise & operating perspective",
  h1: "The questions behind better business decisions.",
  intro: "Four connected areas of work, explained through the questions I ask, the method I use and the experience or analysis behind it.",
  faq,
  body: `
    <div class="hero-actions">
      <a class="button" href="#expertise">Explore the four areas</a>
      <a class="button button-secondary" href="/insights">Read the insights</a>
    </div>
    <section class="section" id="expertise">
      <div class="section-heading"><h2>Expertise in practice</h2></div>
      <div class="expertise-detail-grid">
        ${expertise.map((item, index) => `<article class="expertise-detail">
          <span class="card-label">0${index + 1} · ${item.label}</span>
          <h3>${item.question}</h3>
          <p>${item.method}</p>
          <div class="expertise-context"><span>Experience & context</span><p>${item.experience}</p></div>
          <ul class="expertise-reading">${item.links.map(([href, text]) => `<li><a href="${href}">${text} <span aria-hidden="true">↗</span></a></li>`).join("")}</ul>
        </article>`).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-heading"><h2>A common working method</h2></div>
      <div class="card-grid">
        <div class="work-card"><span class="card-label">01 · Frame</span><h3>Name the decision</h3><p>Define the customer problem, who owns the decision and what is currently preventing a better result.</p></div>
        <div class="work-card"><span class="card-label">02 · Model</span><h3>Make the economics visible</h3><p>Separate revenue from contribution and cash. State the assumptions, service obligations and downside exposure.</p></div>
        <div class="work-card"><span class="card-label">03 · Design</span><h3>Connect the operation</h3><p>Map the systems, people, handoffs and controls needed to deliver the proposition in daily use.</p></div>
        <div class="work-card"><span class="card-label">04 · Test</span><h3>Set the evidence for scale</h3><p>Define what a narrow test must prove, how it will be measured and when to continue, change or stop.</p></div>
      </div>
    </section>
    <section class="section">
      <div class="section-heading"><h2>Reading the work in context</h2></div>
      <div class="report-prose">${faq.map(item => `<h3>${item.question}</h3><p>${item.answer}</p>`).join("")}</div>
      <div class="hero-actions"><a class="button button-secondary" href="/track-record">Explore the operating experience</a><a class="button button-secondary" href="/about">About Haris</a></div>
    </section>
  `
};
