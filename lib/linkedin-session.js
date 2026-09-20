import crypto from "node:crypto";

const SESSION_COOKIE = "linkedin_session";
const STATE_COOKIE = "linkedin_oauth_state";

function keyFromSecret(secret) {
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

export function encryptSession(payload, secret) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", keyFromSecret(secret), iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptSession(value, secret) {
  if (!value || !secret) return null;
  try {
    const raw = Buffer.from(value, "base64url");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const encrypted = raw.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", keyFromSecret(secret), iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(plaintext.toString("utf8"));
  } catch {
    return null;
  }
}

export function randomState() {
  return crypto.randomBytes(32).toString("base64url");
}

export function parseCookies(header = "") {
  return Object.fromEntries(
    header.split(";").map(part => part.trim()).filter(Boolean).map(part => {
      const index = part.indexOf("=");
      return index === -1 ? [part, ""] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
    })
  );
}

export function stateCookie(value) {
  return `${STATE_COOKIE}=${encodeURIComponent(value)}; Path=/api/linkedin; HttpOnly; Secure; SameSite=Lax; Max-Age=600`;
}

export function clearStateCookie() {
  return `${STATE_COOKIE}=; Path=/api/linkedin; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function sessionCookie(value, maxAge) {
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/api/linkedin; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.max(60, Math.floor(maxAge))}`;
}

export { SESSION_COOKIE, STATE_COOKIE };
