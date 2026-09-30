import crypto from "node:crypto";

export const X_REFRESH_COOKIE = "authority_os_x_refresh";

export type XTokenSession = {
  version: number;
  accessToken?: string;
  refreshToken: string;
  expiresAt?: number;
  scope?: string;
  obtainedAt?: number;
};

function encryptionKey() {
  const secret =
    process.env.AUTHORITY_OS_RELEASE_SECRET ||
    process.env.X_CLIENT_SECRET ||
    process.env.AUTHORITY_OS_MCP_TOKEN;
  if (!secret) throw new Error("X token cookie secret is not configured.");
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

function encryptPayload(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

function decryptPayload(value?: string | null) {
  if (!value) return null;
  try {
    const raw = Buffer.from(value, "base64url");
    if (raw.length < 29) return null;
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const encrypted = raw.subarray(28);
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      encryptionKey(),
      iv
    );
    decipher.setAuthTag(tag);
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]).toString("utf8");
  } catch {
    return null;
  }
}

export function encryptXTokenSession(session: XTokenSession) {
  if (!session?.refreshToken) {
    throw new Error("X token session is missing a refresh token.");
  }

  return encryptPayload(
    JSON.stringify({
      version: 2,
      accessToken: session.accessToken || undefined,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt || undefined,
      scope: session.scope || undefined,
      obtainedAt: session.obtainedAt || Date.now()
    })
  );
}

export function decryptXTokenSession(
  value?: string | null
): XTokenSession | null {
  const plain = decryptPayload(value);
  if (!plain) return null;

  try {
    const parsed = JSON.parse(plain);
    const refreshToken = String(parsed?.refreshToken || "").trim();
    if (!refreshToken) return null;

    return {
      version: Number(parsed?.version || 2),
      accessToken: String(parsed?.accessToken || "").trim() || undefined,
      refreshToken,
      expiresAt: Number(parsed?.expiresAt || 0) || undefined,
      scope: String(parsed?.scope || "").trim() || undefined,
      obtainedAt: Number(parsed?.obtainedAt || 0) || undefined
    };
  } catch {
    // Backward compatibility: older Authority OS versions encrypted the raw
    // refresh token directly. Treat it as a legacy session and upgrade it on
    // the next successful OAuth refresh.
    const refreshToken = plain.trim();
    if (!refreshToken) return null;
    return {
      version: 1,
      refreshToken
    };
  }
}

// Backward-compatible wrappers retained while older routes are phased out.
export function encryptXRefreshToken(token: string) {
  return encryptXTokenSession({
    version: 1,
    refreshToken: token
  });
}

export function decryptXRefreshToken(value?: string | null) {
  return decryptXTokenSession(value)?.refreshToken || null;
}
