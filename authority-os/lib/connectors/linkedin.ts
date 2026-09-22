import crypto from "node:crypto";

export type LinkedInReviewInput = {
  text: string;
  articleUrl: string;
  title?: string;
  description?: string;
  visualUrl?: string;
  visualAlt?: string;
  visualTitle?: string;
  label?: string;
};

function validateArticleUrl(value: string) {
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    url.hostname === "www.mharisaslam.com" &&
    url.pathname.startsWith("/insights/")
  );
}

function validateVisualUrl(value?: string) {
  if (!value) return true;
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    url.hostname === "www.mharisaslam.com" &&
    url.pathname.startsWith("/assets/linkedin/") &&
    /\.(png|jpe?g)$/i.test(url.pathname)
  );
}

export function createLinkedInReviewHandoff(input: LinkedInReviewInput) {
  const publisherUrl = process.env.LINKEDIN_PUBLISHER_URL;
  const secret = process.env.LINKEDIN_PUBLISHER_SECRET;

  if (!publisherUrl || !secret) {
    throw new Error("LinkedIn Publisher handoff is not configured.");
  }

  const text = String(input.text || "").trim();
  if (!text || text.length > 3000) {
    throw new Error("LinkedIn draft text must be between 1 and 3000 characters.");
  }
  if (!validateArticleUrl(input.articleUrl)) {
    throw new Error("LinkedIn handoff only accepts mharisaslam.com/insights/ URLs.");
  }
  if (!validateVisualUrl(input.visualUrl)) {
    throw new Error("LinkedIn visual must be an approved mharisaslam.com/assets/linkedin image.");
  }

  const payload = {
    exp: Date.now() + 30 * 60 * 1000,
    draft: {
      text,
      url: input.articleUrl,
      title: input.title || "",
      description: input.description || "",
      visualUrl: input.visualUrl || "",
      visualAlt: input.visualAlt || "",
      visualTitle: input.visualTitle || "",
      label: input.label || "Authority OS draft"
    }
  };

  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  const url = new URL(publisherUrl);
  url.searchParams.set("handoff", encoded);
  url.searchParams.set("sig", sig);

  return {
    mode: "review_handoff",
    reviewUrl: url.toString(),
    expiresAt: new Date(payload.exp).toISOString(),
    published: false,
    approvalRequired: true
  };
}
