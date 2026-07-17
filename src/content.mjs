export const site = {
  name: "Muhammad Haris Aslam",
  shortName: "Haris Aslam",
  origin: "https://www.mharisaslam.com",
  email: "haris@mharisaslam.com",
  phone: "+96898110669",
  linkedin: "https://www.linkedin.com/in/harisaslam/"
};

const expertiseLinks = [
  { href: "/retail-turnaround", title: "Retail turnaround", text: "Reset economics, operating cadence and governance when growth no longer produces durable profit." },
  { href: "/marketplace-strategy", title: "Marketplace strategy", text: "Build the seller ecosystem, assortment, fulfilment and trading model that make a marketplace work." },
  { href: "/ecommerce-transformation", title: "E-commerce transformation", text: "Connect proposition, technology, operations and commercial discipline into one executable roadmap." }
];

const marketLinks = [
  { href: "/markets/qatar", title: "Qatar", text: "A Doha-based perspective on a compact, high-value digital commerce market." },
  { href: "/markets/oman", title: "Oman", text: "Marketplace founding, D2C country launch and group-turnaround experience." },
  { href: "/markets/saudi-arabia", title: "Saudi Arabia", text: "Venture building, capital discipline and a route to the Kingdom's scale." },
  { href: "/markets/uae", title: "UAE", text: "Regional operating experience for the Gulf's most competitive commerce market." }
];

export const pages = [
  {
    path: "/",
    type: "ProfilePage",
    title: "GCC Digital Commerce & Retail Turnaround | Haris Aslam",
    description: "Muhammad Haris Aslam helps build, scale and turn around marketplaces, retail and e-commerce businesses across Qatar, Oman, Saudi Arabia and the UAE.",
    eyebrow: "GCC commerce operator · builder · advisor",
    h1: "Build the market. Fix the economics. Scale what works.",
    intro: "Muhammad Haris Aslam is a digital-commerce builder and operator with 17+ years across the Gulf—founding marketplaces, launching country operations, leading turnarounds and backing what comes next.",
    heroAside: `<figure class="portrait"><img src="/assets/haris-aslam.webp" width="717" height="960" alt="Muhammad Haris Aslam" fetchpriority="high" decoding="async"><figcaption>Qatar · Oman · Saudi Arabia · UAE</figcaption></figure><p>Building and scaling digital-commerce businesses through commercial transformation, venture building and applied AI.</p>`,
    body: `
      <section class="section proof-strip" aria-label="Selected experience">
        <div><strong>17+ years</strong><span>building GCC commerce</span></div>
        <div><strong>0 → market</strong><span>country and venture launches</span></div>
        <div><strong>Turnaround</strong><span>board-mandated transformation</span></div>
        <div><strong>Founder</strong><span>marketplace and SaaS ventures</span></div>
      </section>
      ${section("What I work on", "Operator experience, applied where the commercial model matters most.", cards(expertiseLinks))}
      ${section("Selected operating record", "The work behind the point of view.", `
        <div class="case-grid">
          ${caseStudy("Roumaan.com", "Founded Oman's first multi-category online marketplace, building the proposition, seller base and operating model from a blank sheet.", "/marketplace-strategy", "Marketplace strategy")}
          ${caseStudy("Floward Oman", "Launched the Oman operation and built the local commercial and fulfilment engine to more than 75% category share.", "/markets/oman", "Oman experience")}
          ${caseStudy("Salman Corporation → Miraq Lifestyle", "Led a board-mandated group turnaround, secured a regional distribution mandate and shaped a new Saudi-focused venture.", "/retail-turnaround", "Turnaround approach")}
          ${caseStudy("UpApp Factory", "Co-founded a B2B SaaS platform, expanded it across six markets and later exited the venture.", "/ventures-eir", "Ventures and AI")}
        </div>`) }
      ${section("GCC market experience", "Local context changes the operating model. The site separates the four markets rather than treating the Gulf as one.", cards(marketLinks))}
      ${cta("A difficult commercial brief?", "If the mandate involves a launch, a turnaround, marketplace economics or family-business transformation, start with the operating problem.", "/contact", "Start a conversation")}
    `
  },
  {
    path: "/about",
    type: "ProfilePage",
    title: "Executive Profile | Muhammad Haris Aslam",
    description: "Executive profile of Muhammad Haris Aslam, a GCC digital-commerce operator, marketplace founder, turnaround CEO, venture builder and angel investor.",
    eyebrow: "Executive profile",
    h1: "An operator shaped by launches, turnarounds and the Gulf.",
    intro: "The through-line is practical: take an ambiguous commercial problem, build the operating model around it and stay close enough to the numbers to know what is working.",
    body: `
      ${splitSection("The operating path", `<p>The work began on the commercial side of enterprise technology in Oman as the region's digital economy was taking shape. It moved into e-commerce while the category was still being defined in the Gulf.</p><p>Since then, the roles have ranged from founder and country launcher to turnaround CEO, venture builder and angel investor. The settings changed; the core question did not: how do you move from a blank sheet to a category-leading business, then preserve the economics as it scales?</p><p>Today, Haris is based in Doha and focused on strategic digital-commerce initiatives at Vodafone Qatar. He continues to build, operate, invest and share practical lessons from commerce transformation across the GCC.</p>`)}
      ${section("Principles from the work", "Four ideas that consistently survive contact with the market.", cards([
        { title: "Unit economics before growth", text: "GMV, contribution margin, CAC/LTV and the EBITDA path need to work together." },
        { title: "Localisation is operational", text: "A GCC expansion is won in assortment, fulfilment, payments, talent and trading cadence—not in a translated deck." },
        { title: "Governance enables speed", text: "Clear decision rights and an honest operating rhythm help teams move faster with less noise." },
        { title: "AI should change the model", text: "The value is in leaner catalog, seller, care and reporting operations—not in adding another presentation layer." }
      ]))}
      ${section("Where the experience is most useful", "", pillLinks([
        ["Retail turnaround", "/retail-turnaround"], ["Marketplace strategy", "/marketplace-strategy"], ["E-commerce transformation", "/ecommerce-transformation"], ["Strategic advisory", "/advisory"], ["Ventures and AI", "/ventures-eir"]
      ]))}
      ${cta("Operator-grade judgement for complex decisions.", "Review the advisory focus and the operating experience behind it.", "/advisory", "Explore advisory work")}
    `
  },
  {
    path: "/advisory",
    type: "WebPage",
    title: "GCC Commerce Advisory | Muhammad Haris Aslam",
    description: "Strategic advisory for GCC retail, marketplace and e-commerce leaders facing growth, turnaround, operating-model or governance decisions.",
    eyebrow: "Strategic advisory",
    h1: "Operator-grade judgement for consequential commerce decisions.",
    intro: "Advisory work is most useful when a board, owner or executive team needs a clear commercial diagnosis and a practical route from decision to execution.",
    body: `
      ${section("Advisory focus", "Experience runs deepest across four connected areas.", cards([
        { title: "Board and governance", text: "Clarify the value-creation thesis, decision rights, operating cadence and the measures that should govern the next phase." },
        { title: "Growth and scale", text: "Pressure-test proposition, market entry, organisation, fulfilment and the commercial engine before adding complexity." },
        { title: "Turnaround", text: "Find where margin, cost, inventory or execution broke—and sequence the reset around cash and contribution." },
        { title: "Venture building", text: "Shape a 0-to-1 thesis, operating model and launch plan for marketplaces, D2C and AI-enabled commerce." }
      ]))}
      ${splitSection("A useful engagement starts with the brief", `<p>The strongest mandates have a real decision attached: enter a market, repair a business, redesign an operating model, validate a venture or strengthen executive governance.</p><p>Haris brings the perspective of someone who has founded, launched, scaled and turned around commerce businesses—not a framework detached from implementation.</p><p>The work is grounded in operating experience across Qatar, Oman, Saudi Arabia, the UAE and the wider GCC.</p>`)}
      ${section("Related expertise", "", pillLinks([["Retail turnaround", "/retail-turnaround"], ["Marketplace strategy", "/marketplace-strategy"], ["E-commerce transformation", "/ecommerce-transformation"], ["GCC markets", "/markets"]]))}
      ${cta("Share the decision in front of you.", "A short note on the business, the constraint and the decision is enough to begin.", "/contact", "Contact Haris")}
    `
  },
  {
    path: "/retail-turnaround",
    type: "WebPage",
    title: "Retail Turnaround Leadership in the GCC | Haris Aslam",
    description: "Retail and family-business turnaround leadership across the GCC, focused on economics, governance, operating cadence and a credible path to profit.",
    eyebrow: "Retail turnaround leadership",
    h1: "Turnaround begins with the economics—not the theatre.",
    intro: "When growth, margin and cash stop moving together, the job is to expose the real operating problem, align ownership and management, then rebuild momentum in the right order.",
    body: `
      ${section("The turnaround agenda", "A disciplined reset across the commercial and operating system.", numbered([
        ["Diagnose the value leak", "Separate proposition problems from pricing, margin, inventory, fulfilment, cost and governance failures."],
        ["Protect cash and contribution", "Prioritise the decisions that restore control while preserving the parts of the business customers still value."],
        ["Reset the operating cadence", "Create visible measures, clear owners and a decision rhythm that connects the boardroom to weekly trading."],
        ["Build the next engine", "Translate the repaired core into a credible growth, distribution or digital-commerce model."]
      ]))}
      ${splitSection("Experience behind the approach", `<p>At Salman Corporation, Haris led a board-mandated group turnaround spanning retail economics, cost and inventory discipline. The work developed into Miraq Lifestyle, a new venture shaped around a regional distribution mandate and Saudi Arabia's growth potential.</p><p>That experience informs work with owner-led and family businesses where transformation must respect the existing enterprise while changing how it creates value.</p>`)}
      ${section("Common situations", "", cards([
        { title: "Growth without profit", text: "Revenue is moving, but contribution, working capital or overhead makes the trajectory unsustainable." },
        { title: "Family-business transition", text: "Owners need stronger governance, a modern commercial model or a clear boundary between ownership and execution." },
        { title: "Digital underperformance", text: "E-commerce exists, but remains a channel rather than a connected operating model." },
        { title: "New-market pressure", text: "Expansion is adding complexity faster than the organisation can absorb it." }
      ]))}
      ${cta("Need a clear turnaround thesis?", "Share the current economics, operating constraint and ownership context.", "/contact", "Discuss the mandate")}
    `
  },
  {
    path: "/marketplace-strategy",
    type: "WebPage",
    title: "Marketplace Strategy & Growth in the GCC | Haris Aslam",
    description: "Marketplace strategy for GCC businesses: proposition, seller ecosystem, assortment, unit economics, fulfilment and the trading cadence required to scale.",
    eyebrow: "Marketplace strategy",
    h1: "A marketplace is an operating system, not a catalogue.",
    intro: "Winning supply, demand and economics at the same time requires more than technology. The proposition, seller model, assortment, fulfilment and trading rhythm have to reinforce one another.",
    body: `
      ${section("The marketplace system", "Six connected decisions shape the outcome.", cards([
        { title: "Proposition", text: "Define the customer problem and the reason both buyers and sellers should participate." },
        { title: "Seller ecosystem", text: "Design acquisition, onboarding, standards, incentives and account management as one supply engine." },
        { title: "Assortment", text: "Build depth and availability around real demand rather than chasing catalogue size." },
        { title: "Economics", text: "Model take rate, margin, fulfilment, returns, CAC and service costs before subsidising growth." },
        { title: "Delivery layer", text: "Treat fulfilment and the customer promise as growth assets, not back-office functions." },
        { title: "Trading cadence", text: "Run categories with accountable owners, live measures and a repeatable commercial rhythm." }
      ]))}
      ${splitSection("Built from first-hand experience", `<p>Haris founded Roumaan.com, Oman's first multi-category online marketplace, and built its proposition, seller network and operating model from a blank sheet.</p><p>Later roles added country-launch, regional distribution, D2C and turnaround experience—the adjacent disciplines that determine whether a marketplace can scale beyond its first transactions.</p>`)}
      ${section("Marketplace questions worth answering early", "", numbered([
        ["Why this market?", "What structural gap makes the marketplace more useful than an established retailer or direct channel?"],
        ["Why will sellers stay?", "What demand, tooling, service or economics improves their business?"],
        ["Who owns the customer promise?", "Where do delivery, returns, quality and support responsibilities sit?"],
        ["What becomes defensible?", "Which part of supply, data, operations or customer habit strengthens with scale?"]
      ]))}
      ${cta("Building or repairing a marketplace?", "Bring the thesis, current economics and market context.", "/contact", "Start the conversation")}
    `
  },
  {
    path: "/ecommerce-transformation",
    type: "WebPage",
    title: "E-commerce Transformation in the GCC | Haris Aslam",
    description: "E-commerce and digital-commerce transformation for GCC retailers: proposition, omnichannel operations, unit economics, AI and accountable execution.",
    eyebrow: "E-commerce transformation",
    h1: "Digital commerce works when the whole business changes with it.",
    intro: "A website redesign is not a transformation. The commercial proposition, operating model, technology, fulfilment, organisation and economics must move together.",
    body: `
      ${section("Transformation priorities", "From strategy to an operating model that can trade every week.", cards([
        { title: "Commercial proposition", text: "Choose the customer, category and service promise the business can win profitably." },
        { title: "Omnichannel design", text: "Connect stores, inventory, fulfilment, service and customer data around one experience." },
        { title: "Economics and measurement", text: "Make contribution, CAC/LTV, inventory and fulfilment costs visible in the trading rhythm." },
        { title: "Organisation", text: "Set decision rights and accountable owners across commercial, digital, operations and technology." },
        { title: "AI-enabled operations", text: "Use automation where it can materially improve catalogue, seller, care and executive-reporting work." },
        { title: "Market localisation", text: "Adapt payments, assortment, fulfilment and acquisition to the realities of each GCC market." }
      ]))}
      ${splitSection("Experience across the model", `<p>The perspective combines marketplace founding, D2C country launch, B2B SaaS, retail turnaround, regional distribution and strategic digital-commerce work.</p><p>That breadth matters because transformation failures rarely belong to one function. The visible digital channel is often where deeper commercial or operating weaknesses surface.</p>`)}
      ${section("Related work", "", pillLinks([["Marketplace strategy", "/marketplace-strategy"], ["Retail turnaround", "/retail-turnaround"], ["AI Lab", "/ai-lab"], ["GCC markets", "/markets"]]))}
      ${cta("Moving from channel to operating model?", "Share the current business model and the outcome the transformation must produce.", "/contact", "Discuss the transformation")}
    `
  },
  {
    path: "/ventures-eir",
    type: "CollectionPage",
    title: "Ventures & AI | Muhammad Haris Aslam",
    description: "Verified ventures and applied-AI work from Muhammad Haris Aslam across marketplaces, D2C, B2B SaaS, regional distribution and commerce operations.",
    eyebrow: "Ventures · applied AI",
    h1: "Build from zero—with the operating model in view.",
    intro: "The venture record spans marketplaces, D2C, B2B SaaS and regional distribution, alongside practical experiments in applied AI for commerce and operations.",
    body: `
      ${section("Selected ventures", "Verified operating experience behind the venture-building approach.", `
        <div class="case-grid">
          ${caseStudy("Roumaan.com", "Founded Oman's first multi-category online marketplace and built the proposition, seller ecosystem and operating model.", "/markets/oman", "Oman market experience")}
          ${caseStudy("Floward Oman", "Launched the country operation and built a locally relevant D2C model to more than 75% category share.", "/ecommerce-transformation", "E-commerce transformation")}
          ${caseStudy("UpApp Factory", "Co-founded a B2B SaaS platform, grew it across six markets and exited the venture.", "/about", "Executive profile")}
          ${caseStudy("Miraq Lifestyle", "Shaped a new venture after a group turnaround, regional distribution mandate and capital raise, with Saudi Arabia central to the opportunity.", "/markets/saudi-arabia", "Saudi Arabia")}
        </div>`) }
      ${section("Building and experimenting", "The work connects commercial advantage with an operating model that can be tested in the market.", cards([
        { title: "Corporate venture", text: "Use existing assets, access or distribution to support a focused new commerce model." },
        { title: "Market development", text: "Translate a proven proposition into a locally executable route across GCC markets." },
        { title: "Marketplace or platform", text: "Coordinate supply, demand and operations as one commercial system—not software alone." },
        { title: "Applied AI", text: "Use AI to create leaner workflows, stronger decisions and better customer outcomes." }
      ]))}
      ${splitSection("How ideas become operating models", `<p>Venture building starts with a defined customer problem, a real strategic advantage and clear evidence gates from validation to launch.</p><p>The work connects thesis development, unit economics, proposition, market entry, initial team and the governance required to decide whether to scale.</p><p>The AI Lab applies the same discipline to practical commerce and operating workflows.</p>`)}
      ${cta("From thesis to practical experiment.", "Explore the AI Lab and the operating problems behind each project.", "/ai-lab", "Visit the AI Lab")}
    `
  },
  {
    path: "/ai-lab",
    type: "CollectionPage",
    title: "AI Commerce Lab | Muhammad Haris Aslam",
    description: "AI commerce products and operating workflows explored by Muhammad Haris Aslam, grounded in practical retail, marketplace and executive use cases.",
    eyebrow: "AI Lab",
    h1: "AI is useful when it changes the operating model.",
    intro: "The lab applies AI to real commerce and executive workflows rather than treating it as a presentation layer.",
    body: `
      ${section("Current projects", "Existing projects are preserved here as complete portfolio items, without links to missing external pages.", `
        <div class="case-grid">
          <article class="case"><p class="eyebrow">In development</p><h3>AI Commerce Command Center</h3><p>An operating concept for bringing commercial, seller, catalogue and executive signals into a more responsive commerce cadence under human approval.</p><p><strong>Business problem:</strong> Commerce teams often coordinate fragmented operational signals manually, slowing decisions and obscuring accountability.</p></article>
          <article class="case"><p class="eyebrow">Live</p><h3>Career Runway AI</h3><p>A career-decision product grounded in an individual's financial runway and the practical trade-offs behind a major professional move.</p><p><strong>Business problem:</strong> Major career decisions are often made without a clear view of personal financial runway, risk and real-world trade-offs.</p></article>
        </div>`)}
      ${section("Where AI can earn its place", "", cards([
        { title: "Catalogue operations", text: "Reduce repetitive enrichment and quality work while preserving commercial standards." },
        { title: "Seller onboarding", text: "Shorten the path from recruitment to a trade-ready assortment." },
        { title: "Customer care", text: "Resolve routine needs quickly and route exceptions with better context." },
        { title: "Executive reporting", text: "Turn fragmented operating signals into a clearer decision cadence." }
      ]))}
      ${cta("Building an AI-enabled commerce model?", "The useful starting point is the operating constraint, not the technology.", "/contact", "Compare notes")}
    `
  },
  {
    path: "/markets",
    type: "CollectionPage",
    title: "GCC Digital Commerce Markets | Muhammad Haris Aslam",
    description: "Explore Muhammad Haris Aslam's digital-commerce experience and market perspective across Qatar, Oman, Saudi Arabia and the UAE.",
    eyebrow: "GCC markets",
    h1: "Four markets. Different operating realities.",
    intro: "The Gulf shares capital, ambition and consumer momentum, but each market has a different route to relevance, scale and profitable execution.",
    body: `
      ${section("Market perspective", "On-the-ground experience and differentiated context across the GCC.", cards(marketLinks))}
      ${splitSection("A regional model must still be local", `<p>Assortment, price architecture, payments, fulfilment, customer expectations, talent and the pace of decision-making vary across the GCC.</p><p>Haris's experience includes marketplace founding and group turnaround in Oman, current strategic digital-commerce work in Qatar, regional operations and distribution relevant to the UAE, and venture building focused on Saudi Arabia.</p><p>The site does not claim physical offices or legal entities in these markets. It documents operating experience and practical market perspective.</p>`)}
      ${section("Capabilities across the region", "", pillLinks([["Retail turnaround", "/retail-turnaround"], ["Marketplace strategy", "/marketplace-strategy"], ["E-commerce transformation", "/ecommerce-transformation"], ["Strategic advisory", "/advisory"]]))}
      ${cta("A GCC growth decision?", "Share the market, operating model and commercial objective.", "/contact", "Discuss the market")}
    `
  },
  marketPage("/markets/qatar", "Qatar", "Doha", "Qatar Digital Commerce Strategy | Muhammad Haris Aslam", "A Doha-based perspective on Qatar digital commerce, marketplace growth, retail transformation and the operating choices behind sustainable scale.", "A compact market where relevance matters more than noise.", [
    ["High-value demand", "A concentrated, digitally connected customer base raises expectations for proposition, service and convenience."],
    ["Omnichannel advantage", "Retail presence, inventory and customer relationships can become meaningful digital advantages when connected well."],
    ["Selective marketplace plays", "The strongest opportunities solve a specific supply, service or discovery problem rather than copying a regional model."],
    ["Operating discipline", "In a compact market, unit economics and repeat behaviour become visible quickly; weak assumptions have fewer places to hide."]
  ], `<p>Haris is based in Doha and focused on strategic digital-commerce initiatives at Vodafone Qatar. His broader GCC experience spans marketplace founding, D2C launch, turnaround and venture building.</p><p>That combination informs a practical view of Qatar as a primary market and as part of a wider GCC operating model.</p>`),
  marketPage("/markets/oman", "Oman", "Muscat", "Oman Digital Commerce & Retail Leadership | Haris Aslam", "Marketplace, D2C and retail-turnaround experience in Oman, including Roumaan.com, Floward Oman and the Salman Corporation transformation.", "The market where the operating record runs deepest.", [
    ["Marketplace building", "Founded Roumaan.com, Oman's first multi-category online marketplace, from proposition through seller ecosystem and operations."],
    ["D2C country launch", "Built Floward's Oman operation and local commercial engine to more than 75% category share."],
    ["Retail turnaround", "Led a board-mandated transformation of Salman Corporation, addressing economics, cost, inventory and the future model."],
    ["Venture formation", "Converted turnaround work and a regional distribution mandate into the foundations of Miraq Lifestyle."]
  ], `<p>Oman is where Haris moved from enterprise technology into e-commerce and built several chapters of his operating career.</p><p>The record covers marketplace strategy, country launch, family-business transformation and executive leadership in Muscat and across the Sultanate.</p>`),
  marketPage("/markets/saudi-arabia", "Saudi Arabia", "Riyadh", "Saudi Digital Commerce & Venture Growth | Haris Aslam", "Digital-commerce, marketplace and venture-building perspective for Saudi Arabia, grounded in GCC operations, distribution and turnaround experience.", "Build for the Kingdom's scale—with the economics intact.", [
    ["Scale with focus", "Saudi Arabia can support significant category depth, but the operating model must be designed for the specific customer and channel."],
    ["Venture building", "Miraq Lifestyle was shaped around a regional distribution mandate, capital discipline and a Saudi-focused growth opportunity."],
    ["Marketplace economics", "Seller, fulfilment, service and acquisition choices must hold together as the business moves beyond early demand."],
    ["Leadership and governance", "A clear sponsor, decision model and accountable local execution are essential when ambition and complexity rise together."]
  ], `<p>Haris raised capital and secured a regional distribution mandate while shaping Miraq Lifestyle, with Saudi Arabia central to the venture thesis.</p><p>The experience connects venture building, marketplace strategy, e-commerce transformation and commercial governance. No local office or legal entity is claimed.</p>`),
  marketPage("/markets/uae", "United Arab Emirates", "Dubai", "UAE Digital Commerce & Marketplace Strategy | Haris Aslam", "GCC digital-commerce operating experience applied to UAE marketplace strategy, e-commerce transformation, regional growth and commercial operations.", "Compete through the operating model, not market noise.", [
    ["Competitive proposition", "The customer has abundant choice; the reason to switch or stay must be explicit and consistently delivered."],
    ["Regional platform", "The UAE can support regional teams and partnerships, but market-level economics still need to remain visible."],
    ["Marketplace quality", "Assortment, seller standards, fulfilment and service are more defensible than catalogue volume alone."],
    ["Capital discipline", "A sophisticated market rewards growth, but exposes weak contribution and acquisition assumptions quickly."]
  ], `<p>Haris's operating record combines regional distribution, marketplace founding, D2C launch and turnaround leadership relevant to the UAE.</p><p>That experience informs marketplace strategy, digital transformation, GCC growth and consequential commercial resets. No UAE office or legal entity is claimed.</p>`),
  {
    path: "/insights",
    type: "CollectionPage",
    title: "GCC Digital Commerce Insights | Muhammad Haris Aslam",
    description: "Field notes from Muhammad Haris Aslam on e-commerce profitability, marketplace operations, AI-enabled commerce and GCC growth strategy.",
    eyebrow: "Insights",
    h1: "Field notes from building GCC commerce.",
    intro: "The repository contained four article concepts but not the article bodies. They are preserved here as a transparent research agenda rather than published as thin or fabricated articles.",
    body: `
      ${section("Research agenda", "Long-form notes will be published only when the operating evidence and complete argument are ready.", cards([
        { title: "E-commerce profitability", text: "Why digital-commerce strategies fail when growth, fulfilment, acquisition and contribution are measured in separate rooms." },
        { title: "Agentic commerce", text: "What a lean, AI-enabled commerce operating model could change across catalogue, sellers, care and reporting." },
        { title: "The delivery layer", text: "Why fulfilment can be a proposition and growth asset rather than only a cost to contain." },
        { title: "From zero to scale in the GCC", text: "How proposition, localisation, operating cadence and economics combine in a regional launch." }
      ]))}
      ${section("Explore the operating themes now", "", pillLinks([["Retail turnaround", "/retail-turnaround"], ["Marketplace strategy", "/marketplace-strategy"], ["E-commerce transformation", "/ecommerce-transformation"], ["GCC markets", "/markets"]]))}
      ${cta("A topic worth comparing notes on?", "Share the operating question or market context.", "/contact", "Contact Haris")}
    `
  },
  {
    path: "/contact",
    type: "ContactPage",
    title: "Contact Muhammad Haris Aslam | GCC Commerce",
    description: "Contact Muhammad Haris Aslam to exchange practical perspectives on GCC digital commerce, retail turnaround, marketplace strategy, venture building and applied AI.",
    eyebrow: "Contact",
    h1: "Compare notes on the operating problem.",
    intro: "A place to share practical questions about building, operating and transforming commerce across the GCC.",
    body: `
      <section class="section contact-grid">
        <div class="contact-card"><span>Email</span><a href="mailto:${site.email}">${site.email}</a><p>Best for an initial brief or introduction.</p></div>
        <div class="contact-card"><span>LinkedIn</span><a href="${site.linkedin}" rel="me noopener">Muhammad Haris Aslam</a><p>Professional background and direct messages.</p></div>
        <div class="contact-card"><span>Phone</span><a href="tel:${site.phone}">+968 9811 0669</a><p>For established conversations and time-sensitive matters.</p></div>
      </section>
      ${splitSection("A useful first note", `<p>Include the business context, the market, the decision in front of you and the timeframe.</p><p>No confidential data is needed at the first step. A clear description of the constraint is more useful than a long deck.</p><p>Haris is based in Doha; the operating record and market perspectives on this site span Qatar, Oman, Saudi Arabia, the UAE and the wider GCC.</p>`)}
      ${section("Explore the work", "", pillLinks([["Operating record", "/about"], ["Strategic advisory", "/advisory"], ["Retail turnaround", "/retail-turnaround"], ["Ventures and AI", "/ventures-eir"], ["AI Lab", "/ai-lab"]]))}
    `
  }
];

function marketPage(path, market, city, title, description, h1, points, experience) {
  return {
    path, type: "WebPage", title, description,
    eyebrow: `${market} · GCC markets`, h1,
    intro: `A market-specific view of digital commerce, retail transformation and growth—grounded in verified operating experience, without claiming a local office or legal entity.`,
    body: `
      ${section(`What matters in ${market}`, `${city} is a useful reference point, but the opportunity is national and operating-model specific.`, cards(points.map(([title, text]) => ({ title, text }))))}
      ${splitSection(`Experience relevant to ${market}`, experience)}
      ${section("Capabilities", "", pillLinks([["Retail turnaround", "/retail-turnaround"], ["Marketplace strategy", "/marketplace-strategy"], ["E-commerce transformation", "/ecommerce-transformation"], ["Strategic advisory", "/advisory"]]))}
      ${cta(`Building, scaling or transforming in ${market}?`, "Share the commercial objective, operating constraint and decision horizon.", "/contact", "Start a conversation")}
    `
  };
}

function section(label, heading, content) {
  return `<section class="section"><div class="section-head"><p class="eyebrow">${label}</p>${heading ? `<h2>${heading}</h2>` : ""}</div>${content}</section>`;
}
function splitSection(title, content) {
  return `<section class="section split"><div><p class="eyebrow">Perspective</p><h2>${title}</h2></div><div class="prose">${content}</div></section>`;
}
function cards(items) {
  return `<div class="card-grid">${items.map(({ href, title, text }) => `<article class="card"><h3>${href ? `<a href="${href}">${title}</a>` : title}</h3><p>${text}</p>${href ? `<a class="text-link" href="${href}">Explore ${title.toLowerCase()} <span aria-hidden="true">→</span></a>` : ""}</article>`).join("")}</div>`;
}
function caseStudy(title, text, href, label) {
  return `<article class="case"><p class="eyebrow">Case</p><h3>${title}</h3><p>${text}</p><a class="text-link" href="${href}">${label} <span aria-hidden="true">→</span></a></article>`;
}
function numbered(items) {
  return `<ol class="numbered">${items.map(([title, text]) => `<li><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol>`;
}
function pillLinks(items) {
  return `<div class="pill-links">${items.map(([label, href]) => `<a href="${href}">${label}<span aria-hidden="true">→</span></a>`).join("")}</div>`;
}
function cta(title, text, href, label) {
  return `<section class="section cta"><div><p class="eyebrow">Next conversation</p><h2>${title}</h2><p>${text}</p></div><a class="button button-light" href="${href}">${label}<span aria-hidden="true">→</span></a></section>`;
}
