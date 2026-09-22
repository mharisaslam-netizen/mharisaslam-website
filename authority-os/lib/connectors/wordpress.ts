type WordPressPostInput = {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  status?: "draft" | "publish" | "future";
  date?: string;
  categories?: number[];
  tags?: number[];
  featured_media?: number;
  meta?: Record<string, unknown>;
};

function normalizeSite(site: string) {
  const trimmed = site.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  return trimmed;
}

export async function publishWordPressPost(input: WordPressPostInput) {
  const site = process.env.WORDPRESS_SITE;
  const token = process.env.WORDPRESS_ACCESS_TOKEN;
  const username = process.env.WORDPRESS_USERNAME;
  const appPassword = process.env.WORDPRESS_APP_PASSWORD;

  if (!site) throw new Error("WORDPRESS_SITE is not configured.");

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  let endpoint: string;

  if (username && appPassword) {
    endpoint =
      "https://" +
      normalizeSite(site) +
      "/wp-json/wp/v2/posts";
    headers.Authorization =
      "Basic " +
      Buffer.from(username + ":" + appPassword).toString("base64");
  } else if (token) {
    endpoint =
      "https://public-api.wordpress.com/wp/v2/sites/" +
      encodeURIComponent(site) +
      "/posts";
    headers.Authorization = "Bearer " + token;
  } else {
    throw new Error(
      "WordPress credentials are not configured. Add WORDPRESS_USERNAME + WORDPRESS_APP_PASSWORD or WORDPRESS_ACCESS_TOKEN."
    );
  }

  const requestedStatus = input.status || "draft";
  const livePublishingEnabled =
    String(process.env.AUTHORITY_OS_LIVE_PUBLISH_ENABLED || "").toLowerCase() === "true";
  const effectiveStatus =
    livePublishingEnabled && (requestedStatus === "publish" || requestedStatus === "future")
      ? requestedStatus
      : "draft";

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ...input,
      status: effectiveStatus
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "WordPress publish failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 800)
    );
  }

  return {
    id: data.id,
    requestedStatus,
    status: data.status,
    link: data.link,
    slug: data.slug,
    published: data.status === "publish",
    livePublishingEnabled
  };
}
