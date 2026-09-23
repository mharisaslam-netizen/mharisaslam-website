import crypto from "node:crypto";

function secret() {
  const value =
    process.env.AUTHORITY_OS_RELEASE_SECRET ||
    process.env.AUTHORITY_OS_MCP_TOKEN;
  if (!value) throw new Error("Authority OS release secret is not configured.");
  return value;
}

export function createReleaseApprovalToken(runId: string) {
  const payload = {
    runId,
    exp: Date.now() + 60 * 60 * 1000,
    scope: "authority-os-release"
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret())
    .update(encoded)
    .digest("base64url");
  return {
    token: encoded + "." + sig,
    expiresAt: new Date(payload.exp).toISOString()
  };
}

export function verifyReleaseApprovalToken(token: string, runId: string) {
  const [encoded, sig] = String(token || "").split(".");
  if (!encoded || !sig) return false;

  const expected = crypto
    .createHmac("sha256", secret())
    .update(encoded)
    .digest("base64url");

  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    return (
      payload?.scope === "authority-os-release" &&
      payload?.runId === runId &&
      Number(payload?.exp || 0) > Date.now()
    );
  } catch {
    return false;
  }
}
