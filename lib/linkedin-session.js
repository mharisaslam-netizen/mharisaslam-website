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


export function createApprovalToken(session, secret) {
  const issuedAt = Date.now();
  const nonce = crypto.randomBytes(18).toString("base64url");
  const subject = session?.memberSub || "";
  const payload = `${subject}:${issuedAt}:${nonce}`;
  const signature = crypto.createHmac("sha256", keyFromSecret(secret)).update(payload).digest("base64url");
  return Buffer.from(JSON.stringify({ issuedAt, nonce, signature }), "utf8").toString("base64url");
}

export function verifyApprovalToken(token, session, secret, maxAgeMs = 30 * 60 * 1000) {
  if (!token || !session?.memberSub || !secret) return false;
  try {
    const parsed = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    if (!parsed?.issuedAt || !parsed?.nonce || !parsed?.signature) return false;
    if (Date.now() - Number(parsed.issuedAt) > maxAgeMs || Number(parsed.issuedAt) > Date.now() + 60_000) return false;
    const payload = `${session.memberSub}:${parsed.issuedAt}:${parsed.nonce}`;
    const expected = crypto.createHmac("sha256", keyFromSecret(secret)).update(payload).digest();
    const actual = Buffer.from(parsed.signature, "base64url");
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
