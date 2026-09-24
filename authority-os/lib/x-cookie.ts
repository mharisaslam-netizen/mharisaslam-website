import crypto from "node:crypto";

export const X_REFRESH_COOKIE = "authority_os_x_refresh";

function encryptionKey() {
  const secret =
    process.env.AUTHORITY_OS_RELEASE_SECRET ||
    process.env.X_CLIENT_SECRET ||
    process.env.AUTHORITY_OS_MCP_TOKEN;
  if (!secret) throw new Error("X token cookie secret is not configured.");
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

export function encryptXRefreshToken(token: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptXRefreshToken(value?: string | null) {
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
