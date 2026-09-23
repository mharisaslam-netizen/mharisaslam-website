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


function wordpressAuth() {
  const site = process.env.WORDPRESS_SITE;
  const token = process.env.WORDPRESS_ACCESS_TOKEN;
  const username = process.env.WORDPRESS_USERNAME;
  const appPassword = process.env.WORDPRESS_APP_PASSWORD;

  if (!site) throw new Error("WORDPRESS_SITE is not configured.");

  if (username && appPassword) {
    return {
      base: "https://" + normalizeSite(site) + "/wp-json/wp/v2",
      authorization: "Basic " + Buffer.from(username + ":" + appPassword).toString("base64")
    };
  }

  if (token) {
    return {
      base: "https://public-api.wordpress.com/wp/v2/sites/" + encodeURIComponent(site),
      authorization: "Bearer " + token
    };
  }

  throw new Error(
    "WordPress credentials are not configured. Add WORDPRESS_USERNAME + WORDPRESS_APP_PASSWORD or WORDPRESS_ACCESS_TOKEN."
  );
}

export async function uploadWordPressMedia(input: {
  base64: string;
  filename: string;
  mimeType: string;
  altText?: string;
  caption?: string;
  title?: string;
}) {
  const auth = wordpressAuth();
  const bytes = Buffer.from(input.base64, "base64");
  if (!bytes.byteLength) throw new Error("WordPress media upload received an empty file.");

  const response = await fetch(auth.base + "/media", {
    method: "POST",
    headers: {
      Authorization: auth.authorization,
      "Content-Type": input.mimeType,
      "Content-Disposition": 'attachment; filename="' + input.filename.replace(/"/g, "") + '"'
    },
    body: bytes
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "WordPress media upload failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 800)
    );
  }

  const mediaId = Number(data.id || 0);
  if (!mediaId) throw new Error("WordPress media upload did not return a media ID.");

  if (input.altText || input.caption || input.title) {
    const metaResponse = await fetch(auth.base + "/media/" + mediaId, {
      method: "POST",
      headers: {
        Authorization: auth.authorization,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...(input.altText ? { alt_text: input.altText } : {}),
        ...(input.caption ? { caption: input.caption } : {}),
        ...(input.title ? { title: input.title } : {})
      })
    });
    if (!metaResponse.ok) {
      const detail = await metaResponse.text().catch(() => "");
      throw new Error(
        "WordPress media metadata update failed (" +
          metaResponse.status +
          "): " +
          detail.slice(0, 500)
      );
    }
  }

  return {
    id: mediaId,
    sourceUrl: data.source_url || null,
    link: data.link || null,
    mimeType: data.mime_type || input.mimeType
  };
}

export async function updateWordPressFeaturedMedia(postId: number, mediaId: number) {
  const auth = wordpressAuth();
  const response = await fetch(auth.base + "/posts/" + postId, {
    method: "POST",
    headers: {
      Authorization: auth.authorization,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ featured_media: mediaId })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "WordPress featured image update failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 800)
    );
  }

  return {
    id: data.id,
    featuredMedia: data.featured_media || mediaId,
    link: data.link || null,
    status: data.status || null
  };
}


export async function getWordPressPost(postId: number) {
  const auth = wordpressAuth();
  const response = await fetch(
    auth.base + "/posts/" + postId + "?context=edit",
    {
      headers: { Authorization: auth.authorization },
      cache: "no-store"
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "WordPress post lookup failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 600)
    );
  }
  return data;
}

export async function publishStagedWordPressPost(input: {
  postId: number;
  publicizeMessage?: string;
  keepSearchCanonicalOnMainSite?: boolean;
}) {
  if (!Number.isInteger(input.postId) || input.postId <= 0) {
    throw new Error("A valid WordPress post ID is required.");
  }

  const auth = wordpressAuth();
  const current = await getWordPressPost(input.postId);

  if (current?.status === "publish") {
    return {
      status: "LIVE",
      alreadyPublished: true,
      id: current.id,
      link: current.link || null,
      featuredMedia: current.featured_media || null,
      jetpackSocialAlreadyShared:
        Boolean(current?.meta?.jetpack_social_post_already_shared)
    };
  }

  const meta: Record<string, unknown> = {
    jetpack_publicize_feature_enabled: true,
    ...(input.publicizeMessage
      ? { jetpack_publicize_message: input.publicizeMessage.slice(0, 500) }
      : {}),
    ...(input.keepSearchCanonicalOnMainSite !== false
      ? { jetpack_seo_noindex: true }
      : {})
  };

  const response = await fetch(auth.base + "/posts/" + input.postId, {
    method: "POST",
    headers: {
      Authorization: auth.authorization,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "publish",
      meta
    }),
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "WordPress release failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 800)
    );
  }

  return {
    status: "LIVE",
    alreadyPublished: false,
    id: data.id,
    link: data.link || null,
    featuredMedia: data.featured_media || null,
    jetpackSocialAlreadyShared:
      Boolean(data?.meta?.jetpack_social_post_already_shared),
    publicizeEnabled:
      data?.meta?.jetpack_publicize_feature_enabled !== false
  };
}
