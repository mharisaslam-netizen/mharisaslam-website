import crypto from "node:crypto";

export const X_REFRESH_COOKIE = "authority_os_x_refresh";

function key() {
  const secret =
    process.env.AUTHORITY_OS_RELEASE_SECRET ||
    process.env.X_CLIENT_SECRET ||
    process.env.AUTHORITY_OS_MCP_TOKEN;
  if (!secret) throw new Error("X cookie encryption secret is not configured.");
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptXRefreshToken(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptXRefreshToken(value?: string | null) {
  if (!value) return null;
  try {
    const bytes = Buffer.from(value, "base64url");
    if (bytes.length < 29) return null;
    const iv = bytes.subarray(0, 12);
    const tag = bytes.subarray(12, 28);
    const encrypted = bytes.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]).toString("utf8");
  } catch {
    return null;
  }
}
