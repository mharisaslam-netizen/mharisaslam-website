import {
  createApprovalToken,
  decryptSession,
  encryptSession,
  parseCookies,
  verifyApprovalToken
} from "./linkedin-session.js";

export const GLOBAL_GROWTHS_SESSION_COOKIE = "global_growths_linkedin_session";

export function globalGrowthsSessionCookie(value, maxAge) {
  return `${GLOBAL_GROWTHS_SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/api/linkedin/global-growths; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.max(60, Math.floor(maxAge))}`;
}

export function clearGlobalGrowthsSessionCookie() {
  return `${GLOBAL_GROWTHS_SESSION_COOKIE}=; Path=/api/linkedin/global-growths; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export {
  createApprovalToken,
  decryptSession,
  encryptSession,
  parseCookies,
  verifyApprovalToken
};
