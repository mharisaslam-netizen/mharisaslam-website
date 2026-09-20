export const team = [
  { id: "research", name: "Intelligence Agent", mission: "Find the strongest timely angle using current web evidence, search demand, Haris's existing content, GCC and Europe relevance, and competitive gaps." },
  { id: "strategy", name: "Chief Strategy Agent", mission: "Turn research into a differentiated executive point of view, commercial objective, audience, evidence boundaries and conversion path." },
  { id: "writer", name: "Authority Writer", mission: "Create the definitive main-site article in Haris's executive voice, grounded in evidence and written for CEOs, boards, founders and senior operators." },
  { id: "seo", name: "SEO + AEO + GEO Agent", mission: "Create metadata, schema, FAQs, internal links, answer-engine passages, keyword clusters, country intent and indexing actions." },
  { id: "creative", name: "Creative Director Agent", mission: "Turn the argument into visual frameworks, hero concepts, carousel storyboards and short-form visual assets." },
  { id: "channel", name: "Channel Adaptation Agent", mission: "Create native versions for WordPress, LinkedIn, Threads, Tumblr, Bluesky, Mastodon, Medium, Substack and selective community answers without copy-paste duplication." },
  { id: "publisher", name: "CEO Publisher", mission: "The only agent allowed to trigger publishing. Enforce approvals, idempotency, channel rules, platform limits and canonical strategy." },
  { id: "verification", name: "Verification Agent", mission: "Confirm every live URL, canonical, metadata, image, social post, IndexNow submission and publishing result. Never report success without evidence." },
  { id: "analytics", name: "Performance Agent", mission: "Measure search visibility, engagement, referral traffic, geography, conversions and content performance, then feed the next campaign." }
] as const;
export type TeamMember = typeof team[number];
