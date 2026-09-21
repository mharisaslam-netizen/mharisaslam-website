export type IntegrationStatus = "connected" | "needs_setup" | "browser_worker" | "optional";

export type Integration = {
  id: string;
  name: string;
  role: string;
  env: string[];
  mode: "api" | "existing-workflow" | "jetpack" | "browser";
  phase: 1 | 2 | 3;
};

export const integrations: Integration[] = [
  { id: "openai", name: "OpenAI Agents API", role: "CEO orchestration, research, subagents and long-running work", env: ["OPENAI_API_KEY"], mode: "api", phase: 1 },
  { id: "github", name: "GitHub", role: "Main-site source, version control and draft-PR publishing gate", env: ["GITHUB_TOKEN", "GITHUB_REPO"], mode: "api", phase: 1 },
  { id: "wordpress", name: "WordPress.com", role: "Derivative authority article and Jetpack distribution trigger", env: ["WORDPRESS_ACCESS_TOKEN", "WORDPRESS_SITE"], mode: "api", phase: 1 },
  { id: "jetpack", name: "Jetpack Social", role: "Threads, Tumblr, Bluesky and Mastodon distribution", env: [], mode: "jetpack", phase: 1 },
  { id: "linkedin", name: "LinkedIn Publisher", role: "Existing dedicated LinkedIn automation", env: ["LINKEDIN_PUBLISHER_URL", "LINKEDIN_PUBLISHER_SECRET"], mode: "existing-workflow", phase: 1 },
  { id: "gsc", name: "Google Search Console", role: "Search queries, pages, countries, impressions, clicks and indexing feedback", env: ["GOOGLE_SEARCH_CONSOLE_CLIENT_ID", "GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET", "GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN"], mode: "api", phase: 2 },
  { id: "ga4", name: "Google Analytics 4", role: "Traffic, referral, geography and conversion measurement", env: ["GA4_PROPERTY_ID"], mode: "api", phase: 2 },
  { id: "bing", name: "Bing + IndexNow", role: "Bing webmaster data and rapid URL submission", env: ["BING_WEBMASTER_API_KEY", "INDEXNOW_KEY"], mode: "api", phase: 1 },
  { id: "canva", name: "Canva", role: "Brand-safe visual assets and reusable templates", env: ["CANVA_CLIENT_ID", "CANVA_CLIENT_SECRET"], mode: "api", phase: 2 },
  { id: "medium", name: "Medium", role: "Canonical syndication and external authority", env: ["MEDIUM_PROFILE_URL"], mode: "browser", phase: 2 },
  { id: "substack", name: "Substack", role: "Executive newsletter and Europe/global subscriber channel", env: ["SUBSTACK_PROFILE_URL"], mode: "browser", phase: 2 },
  { id: "reddit", name: "Reddit", role: "Selective expert participation only when a relevant discussion exists", env: ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET"], mode: "api", phase: 3 },
  { id: "youtube", name: "YouTube", role: "Short-form executive video distribution", env: ["YOUTUBE_API_KEY"], mode: "api", phase: 3 },
  { id: "clay", name: "Clay", role: "Optional prospect research and distribution intelligence", env: ["CLAY_API_KEY"], mode: "api", phase: 3 }
];

export function integrationSnapshot() {
  return integrations.map((item) => {
    const configured = item.env.length === 0 ? item.id === "jetpack" : item.env.every((key) => Boolean(process.env[key]));
    return {
      ...item,
      configured,
      status: configured ? "connected" : item.mode === "browser" ? "browser_worker" : item.phase === 3 ? "optional" : "needs_setup"
    };
  });
}
