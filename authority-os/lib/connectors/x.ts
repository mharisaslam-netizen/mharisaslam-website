import type { XTokenSession } from "../x-cookie";

export class XTokenLifecycleError extends Error {
  tokenSession?: XTokenSession;
  requiresReconnect: boolean;

  constructor(
    message: string,
    options?: {
      tokenSession?: XTokenSession;
      requiresReconnect?: boolean;
    }
  ) {
    super(message);
    this.name = "XTokenLifecycleError";
    this.tokenSession = options?.tokenSession;
    this.requiresReconnect = Boolean(options?.requiresReconnect);
  }
}

function clientCredentials() {
  const clientId = process.env.X_CLIENT_ID?.trim();
  const clientSecret = process.env.X_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new XTokenLifecycleError(
      "X OAuth client credentials are not configured.",
      { requiresReconnect: false }
    );
  }

  return { clientId, clientSecret };
}

async function refreshWithToken(refreshToken: string) {
  const { clientId, clientSecret } = clientCredentials();
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
  if (!response.ok || !data?.access_token) {
    return {
      ok: false as const,
      status: response.status,
      detail: JSON.stringify(data).slice(0, 500)
    };
  }

  const expiresIn = Number(data.expires_in || 0);
  return {
    ok: true as const,
    session: {
      version: 2,
      accessToken: String(data.access_token),
      refreshToken: data.refresh_token
        ? String(data.refresh_token)
        : refreshToken,
      expiresAt: expiresIn
        ? Date.now() + expiresIn * 1000
        : Date.now() + 60 * 60 * 1000,
      scope: String(data.scope || ""),
      obtainedAt: Date.now()
    } satisfies XTokenSession
  };
}

async function resolveXTokenSession(
  input?: XTokenSession | null
): Promise<XTokenSession> {
  const now = Date.now();
  if (
    input?.accessToken &&
    input?.expiresAt &&
    input.expiresAt > now + 90_000
  ) {
    return input;
  }

  const candidates = [
    input?.refreshToken?.trim(),
    process.env.X_REFRESH_TOKEN?.trim()
  ].filter((value, index, values): value is string =>
    Boolean(value) && values.indexOf(value) === index
  );

  if (!candidates.length) {
    throw new XTokenLifecycleError(
      "X authorization is not available. Reconnect X once to create a fresh durable session.",
      { requiresReconnect: true }
    );
  }

  let lastFailure = "";
  for (const refreshToken of candidates) {
    const refreshed = await refreshWithToken(refreshToken);
    if (refreshed.ok) return refreshed.session;
    lastFailure =
      "X token refresh failed (" +
      refreshed.status +
      "): " +
      refreshed.detail;
  }

  throw new XTokenLifecycleError(
    "X authorization has expired or was invalidated. Reconnect X once; Authority OS will then keep the access and rotated refresh tokens together so this does not recur after a failed publish.",
    { requiresReconnect: true }
  );
}

function normalizeTweetText(value: string) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function findExistingXPost(accessToken: string, text: string) {
  try {
    const meResponse = await fetch("https://api.x.com/2/users/me", {
      headers: { Authorization: "Bearer " + accessToken },
      cache: "no-store"
    });
    const me = await meResponse.json().catch(() => ({}));
    const userId = String(me?.data?.id || "");
    if (!meResponse.ok || !userId) return null;

    const recentResponse = await fetch(
      "https://api.x.com/2/users/" +
        encodeURIComponent(userId) +
        "/tweets?max_results=10&exclude=replies,retweets",
      {
        headers: { Authorization: "Bearer " + accessToken },
        cache: "no-store"
      }
    );
    const recent = await recentResponse.json().catch(() => ({}));
    if (!recentResponse.ok || !Array.isArray(recent?.data)) return null;

    const expected = normalizeTweetText(text);
    const existing = recent.data.find(
      (tweet: any) =>
        normalizeTweetText(String(tweet?.text || "")) === expected
    );
    if (!existing?.id) return null;

    return {
      id: String(existing.id),
      text: String(existing.text || text)
    };
  } catch {
    return null;
  }
}

export async function publishXPost(input: {
  text: string;
  tokenSession?: XTokenSession | null;
  refreshToken?: string;
}) {
  const text = String(input.text || "").trim();
  if (!text) throw new Error("X post text is empty.");

  const tokenSession = await resolveXTokenSession(
    input.tokenSession ||
      (input.refreshToken
        ? { version: 1, refreshToken: input.refreshToken }
        : null)
  );

  const accessToken = String(tokenSession.accessToken || "");
  if (!accessToken) {
    throw new XTokenLifecycleError(
      "X access token could not be resolved.",
      {
        tokenSession,
        requiresReconnect: true
      }
    );
  }

  const existing = await findExistingXPost(accessToken, text);
  if (existing) {
    return {
      status: "LIVE",
      id: existing.id,
      text: existing.text,
      postUrl: "https://x.com/i/web/status/" + existing.id,
      scope: tokenSession.scope || "",
      alreadyPublished: true,
      nextTokenSession: tokenSession
    };
  }

  const response = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text }),
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.data?.id) {
    // Critical lifecycle protection: if a refresh happened immediately before
    // this publish attempt, the rotated refresh token must still be returned
    // to the caller even though the tweet itself failed. Older Authority OS
    // versions lost that token here, which invalidated the browser session.
    throw new XTokenLifecycleError(
      "X publish failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 800),
      {
        tokenSession,
        requiresReconnect: false
      }
    );
  }

  const id = String(data.data.id);
  return {
    status: "LIVE",
    id,
    text: String(data.data.text || text),
    postUrl: "https://x.com/i/web/status/" + id,
    scope: tokenSession.scope || "",
    alreadyPublished: false,
    nextTokenSession: tokenSession
  };
}
