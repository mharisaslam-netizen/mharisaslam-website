async function googleAccessToken() {
  const clientId = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google OAuth credentials are not configured.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error("Google token refresh failed (" + response.status + ").");
  }

  return String(data.access_token);
}

export async function searchConsolePerformance(input: {
  startDate: string;
  endDate: string;
  dimensions?: string[];
  rowLimit?: number;
  startRow?: number;
}) {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE || "https://www.mharisaslam.com/";
  const token = await googleAccessToken();

  const response = await fetch(
    "https://searchconsole.googleapis.com/webmasters/v3/sites/" +
      encodeURIComponent(siteUrl) +
      "/searchAnalytics/query",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        startDate: input.startDate,
        endDate: input.endDate,
        dimensions: input.dimensions || ["query", "page", "country"],
        rowLimit: Math.min(input.rowLimit || 250, 25000),
        startRow: input.startRow || 0
      })
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error("Search Console query failed (" + response.status + "): " + JSON.stringify(data).slice(0, 500));
  }
  return data;
}

export async function ga4Report(input: {
  startDate: string;
  endDate: string;
  dimensions?: string[];
  metrics?: string[];
  limit?: number;
}) {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) throw new Error("GA4_PROPERTY_ID is not configured.");

  const token = await googleAccessToken();

  const response = await fetch(
    "https://analyticsdata.googleapis.com/v1beta/properties/" +
      encodeURIComponent(propertyId) +
      ":runReport",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: input.startDate, endDate: input.endDate }],
        dimensions: (input.dimensions || ["country", "sessionDefaultChannelGroup"]).map((name) => ({ name })),
        metrics: (input.metrics || ["sessions", "activeUsers", "screenPageViews"]).map((name) => ({ name })),
        limit: Math.min(input.limit || 250, 10000)
      })
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error("GA4 report failed (" + response.status + "): " + JSON.stringify(data).slice(0, 500));
  }
  return data;
}


export async function inspectSearchConsoleUrl(url: string) {
  const siteUrl =
    process.env.GOOGLE_SEARCH_CONSOLE_SITE || "sc-domain:mharisaslam.com";
  const token = await googleAccessToken();

  const response = await fetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl,
        languageCode: "en-US"
      }),
      cache: "no-store"
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "Search Console URL inspection failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 700)
    );
  }

  const result = data?.inspectionResult?.indexStatusResult || {};
  return {
    verdict: result.verdict || null,
    coverageState: result.coverageState || null,
    indexingState: result.indexingState || null,
    robotsTxtState: result.robotsTxtState || null,
    pageFetchState: result.pageFetchState || null,
    lastCrawlTime: result.lastCrawlTime || null,
    googleCanonical: result.googleCanonical || null,
    userCanonical: result.userCanonical || null,
    raw: data
  };
}

export async function submitSearchConsoleSitemap(
  sitemapUrl = "https://www.mharisaslam.com/sitemap.xml"
) {
  const siteUrl =
    process.env.GOOGLE_SEARCH_CONSOLE_SITE || "sc-domain:mharisaslam.com";
  const token = await googleAccessToken();

  const response = await fetch(
    "https://www.googleapis.com/webmasters/v3/sites/" +
      encodeURIComponent(siteUrl) +
      "/sitemaps/" +
      encodeURIComponent(sitemapUrl),
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token
      },
      cache: "no-store"
    }
  );

  if (response.status === 403) {
    const detail = await response.text().catch(() => "");
    return {
      status: "NEEDS_REAUTHORIZE",
      submitted: false,
      reason:
        "Google Search Console write scope is not present. Reauthorize Authority OS once with the webmasters scope.",
      detail: detail.slice(0, 500)
    };
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      "Search Console sitemap submission failed (" +
        response.status +
        "): " +
        detail.slice(0, 600)
    );
  }

  return {
    status: "SUBMITTED",
    submitted: true,
    sitemapUrl
  };
}
