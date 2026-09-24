export async function xAccessToken(refreshTokenOverride?: string) {
  const clientId = process.env.X_CLIENT_ID?.trim();
  const clientSecret = process.env.X_CLIENT_SECRET?.trim();
  const refreshToken =
    String(refreshTokenOverride || "").trim() ||
    process.env.X_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("X OAuth credentials are not configured.");
  }

  const basic = Buffer.from(clientId + ":" + clientSecret).toString("base64");
  const response = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + basic,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId
    }),
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error("X token refresh failed (" + response.status + "): " + JSON.stringify(data).slice(0, 500));
  }

  return {
    accessToken: String(data.access_token),
    refreshToken: data.refresh_token ? String(data.refresh_token) : refreshToken,
    expiresIn: Number(data.expires_in || 0),
    scope: String(data.scope || "")
  };
}


export async function publishXPost(input: {
  text: string;
  refreshToken?: string;
}) {
  const text = String(input.text || "").trim();
  if (!text) throw new Error("X post text is empty.");

  const token = await xAccessToken(input.refreshToken);

  const response = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token.accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text }),
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.data?.id) {
    throw new Error(
      "X publish failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 800)
    );
  }

  const id = String(data.data.id);
  return {
    status: "LIVE",
    id,
    text: String(data.data.text || text),
    postUrl: "https://x.com/i/web/status/" + id,
    scope: token.scope,
    refreshTokenRotated:
      Boolean(token.refreshToken) &&
      token.refreshToken !== String(input.refreshToken || process.env.X_REFRESH_TOKEN || ""),
    nextRefreshToken: token.refreshToken
  };
}
