export async function canvaAccessToken() {
  const clientId = process.env.CANVA_CLIENT_ID?.trim();
  const clientSecret = process.env.CANVA_CLIENT_SECRET?.trim();
  const refreshToken = process.env.CANVA_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Canva OAuth credentials are not configured.");
  }

  const basic = Buffer.from(clientId + ":" + clientSecret).toString("base64");
  const response = await fetch("https://api.canva.com/rest/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + basic,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }),
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error("Canva token refresh failed (" + response.status + "): " + JSON.stringify(data).slice(0, 500));
  }

  return {
    accessToken: String(data.access_token),
    refreshToken: data.refresh_token ? String(data.refresh_token) : refreshToken,
    expiresIn: Number(data.expires_in || 0),
    scope: String(data.scope || "")
  };
}

export async function canvaProfile() {
  const token = await canvaAccessToken();
  const response = await fetch("https://api.canva.com/rest/v1/users/me/profile", {
    headers: { Authorization: "Bearer " + token.accessToken },
    cache: "no-store"
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error("Canva profile check failed (" + response.status + "): " + JSON.stringify(data).slice(0, 500));
  }
  return {
    profile: data,
    rotatedRefreshToken: token.refreshToken !== process.env.CANVA_REFRESH_TOKEN ? token.refreshToken : null,
    expiresIn: token.expiresIn,
    scope: token.scope
  };
}
