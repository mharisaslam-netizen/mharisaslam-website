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

export async function publishWordPressPost(input: WordPressPostInput) {
  const site = process.env.WORDPRESS_SITE;
  const token = process.env.WORDPRESS_ACCESS_TOKEN;

  if (!site || !token) throw new Error("WordPress credentials are not configured.");

  const response = await fetch(
    "https://public-api.wordpress.com/wp/v2/sites/" + encodeURIComponent(site) + "/posts",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...input,
        status: input.status || "publish"
      })
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error("WordPress publish failed (" + response.status + "): " + JSON.stringify(data).slice(0, 800));
  }

  return {
    id: data.id,
    status: data.status,
    link: data.link,
    slug: data.slug
  };
}
