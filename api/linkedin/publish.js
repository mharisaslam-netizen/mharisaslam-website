import {
  SESSION_COOKIE,
  decryptSession,
  parseCookies,
  verifyApprovalToken
} from "../../lib/linkedin-session.js";

const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function resultPage(title, message, postUrl = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>${esc(title)}</title><style>body{font-family:Arial,sans-serif;background:#f4f0e7;color:#173039;margin:0;padding:48px}main{max-width:720px;margin:auto;background:#fff;border:1px solid #d7dfdc;padding:36px}h1{color:#0c2630;margin-top:0}a{color:#0b857d;font-weight:700}</style></head><body><main><h1>${esc(title)}</h1><p>${esc(message)}</p>${postUrl ? `<p><a href="${esc(postUrl)}" target="_blank" rel="noopener noreferrer">Open the LinkedIn post</a></p>` : ""}<p><a href="/api/linkedin/publisher">Return to publisher</a></p></main></body></html>`;
}

function allowedArticleUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "www.mharisaslam.com" && url.pathname.startsWith("/insights/");
  } catch {
    return false;
  }
}

function allowedVisualUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    const liveAsset =
      url.protocol === "https:" &&
      url.hostname === "www.mharisaslam.com" &&
      (url.pathname.startsWith("/assets/linkedin/") ||
        url.pathname.startsWith("/assets/authority-os/")) &&
      /\.(png|jpe?g)$/i.test(url.pathname);
    const authorityPreview =
      url.protocol === "https:" &&
      url.hostname === "haris-authority-os.vercel.app" &&
      url.pathname === "/api/preview/asset";
    return liveAsset || authorityPreview;
  } catch {
    return false;
  }
}

async function resolveMemberId(session) {
  try {
    const response = await fetch("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0"
      }
    });
    if (response.ok) {
      const profile = await response.json();
      if (profile?.id) return String(profile.id);
    }
  } catch {}
  return String(session.memberSub || "");
}

async function uploadImage(session, visualUrl, memberId) {
  const owner = `urn:li:person:${memberId}`;
  const register = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "Linkedin-Version": "202609",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner
      }
    })
  });

  const registerDetail = await register.text();
  if (!register.ok) {
    throw new Error(
      "LinkedIn image initialization failed (" +
        register.status +
        "): " +
        registerDetail.slice(0, 500)
    );
  }

  let data = {};
  try {
    data = JSON.parse(registerDetail);
  } catch {}

  const uploadUrl = data?.value?.uploadUrl;
  const imageUrn = data?.value?.image;
  if (!uploadUrl || !imageUrn) {
    throw new Error("LinkedIn did not return current Images API upload details.");
  }

  const image = await fetch(visualUrl, {
    headers: { "User-Agent": "Haris-Content-Publisher/1.0" }
  });
  if (!image.ok) throw new Error(`Visual fetch failed (${image.status})`);
  const type = String(image.headers.get("content-type") || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (!["image/png", "image/jpeg"].includes(type)) {
    throw new Error(`Unsupported visual type: ${type || "unknown"}`);
  }

  const bytes = await image.arrayBuffer();
  if (!bytes.byteLength || bytes.byteLength > 10 * 1024 * 1024) {
    throw new Error("Visual is empty or too large.");
  }

  const uploaded = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": type
    },
    body: bytes
  });
  if (!uploaded.ok) {
    const detail = await uploaded.text().catch(() => "");
    throw new Error(
      "LinkedIn image upload failed (" +
        uploaded.status +
        "): " +
        detail.slice(0, 500)
    );
  }

  return imageUrn;
}

export async function POST(request) {
  const secret = process.env.LINKEDIN_SESSION_SECRET;
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const session = secret ? decryptSession(cookies[SESSION_COOKIE], secret) : null;
  const connected = Boolean(session?.accessToken && session?.expiresAt > Date.now());

  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow, noarchive"
  };

  if (!connected) return new Response(resultPage("LinkedIn connection required", "Reconnect LinkedIn before publishing."), { status: 401, headers });

  const form = await request.formData();
  const csrf = String(form.get("csrf") || "");
  const approved = String(form.get("approve") || "") === "yes";
  const text = String(form.get("text") || "").trim();
  const articleUrl = String(form.get("articleUrl") || "").trim();
  const articleTitle = String(form.get("articleTitle") || "").trim().slice(0, 200);
  const articleDescription = String(form.get("articleDescription") || "").trim().slice(0, 300);
  const visualUrl = String(form.get("visualUrl") || "").trim();
  const visualAlt = String(form.get("visualAlt") || "").trim().slice(0, 300);
  const visualTitle = String(form.get("visualTitle") || "").trim().slice(0, 200);
  const visibility = String(form.get("visibility") || "PUBLIC") === "CONNECTIONS" ? "CONNECTIONS" : "PUBLIC";

  if (!verifyApprovalToken(csrf, session, secret) || !approved) {
    return new Response(resultPage("Approval required", "The post was not published because explicit approval could not be verified."), { status: 403, headers });
  }
  if (!text || text.length > 3000) {
    return new Response(resultPage("Post not published", "LinkedIn post copy must be between 1 and 3000 characters."), { status: 400, headers });
  }
  if (!allowedArticleUrl(articleUrl)) {
    return new Response(resultPage("Post not published", "For safety, this publisher currently allows article links only from mharisaslam.com/insights/."), { status: 400, headers });
  }
  if (!allowedVisualUrl(visualUrl)) {
    return new Response(resultPage("Post not published", "The selected visual is not an approved Haris Authority visual asset."), { status: 400, headers });
  }
  if (!session.memberSub) {
    return new Response(resultPage("Post not published", "The connected LinkedIn member identifier is missing. Reconnect LinkedIn and try again."), { status: 400, headers });
  }

  try {
    const memberId = await resolveMemberId(session);
    if (!memberId) {
      return new Response(
        resultPage(
          "LinkedIn publish failed",
          "LinkedIn did not return a usable member identifier. Reconnect LinkedIn and try again."
        ),
        { status: 502, headers }
      );
    }

    const author = `urn:li:person:${memberId}`;
    const finalText = text.includes(articleUrl)
      ? text
      : text + "\n\n" + articleUrl;

    if (finalText.length > 3000) {
      return new Response(
        resultPage(
          "Post not published",
          "The approved copy plus the required article URL exceeds LinkedIn's 3000-character limit."
        ),
        { status: 400, headers }
      );
    }

    const diagnostics = [];
    let imageUrn = "";

    if (visualUrl) {
      try {
        imageUrn = await uploadImage(session, visualUrl, memberId);
      } catch (error) {
        diagnostics.push(
          "Image step: " +
            (error instanceof Error ? error.message : String(error))
        );
      }
    }

    const article = {
      source: articleUrl,
      ...(imageUrn ? { thumbnail: imageUrn } : {}),
      title: articleTitle || visualTitle || "Read the full article",
      ...(articleDescription ? { description: articleDescription } : {})
    };

    const baseBody = {
      author,
      commentary: finalText,
      visibility,
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: []
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false
    };

    let response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "Linkedin-Version": "202609",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...baseBody,
        content: { article }
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      diagnostics.push(
        "Posts API article: HTTP " +
          response.status +
          " " +
          detail.slice(0, 500)
      );

      response = await fetch("https://api.linkedin.com/rest/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Linkedin-Version": "202609",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(baseBody)
      });

      if (!response.ok) {
        const textDetail = await response.text();
        diagnostics.push(
          "Posts API text-only: HTTP " +
            response.status +
            " " +
            textDetail.slice(0, 500)
        );

        const legacyBody = {
          author,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: { text: finalText },
              shareMediaCategory: "NONE"
            }
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": visibility
          }
        };

        response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(legacyBody)
        });

        if (!response.ok) {
          const legacyDetail = await response.text();
          diagnostics.push(
            "Legacy UGC fallback: HTTP " +
              response.status +
              " " +
              legacyDetail.slice(0, 500)
          );

          console.error("LinkedIn publish diagnostics", diagnostics.join(" | "));
          return new Response(
            resultPage(
              "LinkedIn publish failed",
              diagnostics.join(" | ") +
                " No successful publication was recorded."
            ),
            { status: 502, headers }
          );
        }
      }
    }

    const postId =
      response.headers.get("x-restli-id") ||
      response.headers.get("x-linkedin-id") ||
      "";
    const postUrl = postId
      ? `https://www.linkedin.com/feed/update/${postId}`
      : "";
    return new Response(
      resultPage(
        "Published to LinkedIn",
        imageUrn
          ? "The approved post has been published to your personal LinkedIn profile with the campaign visual."
          : "The approved post has been published to your personal LinkedIn profile. LinkedIn rejected the image step, so the publisher used the approved article/text fallback.",
        postUrl
      ),
      { status: 201, headers }
    );
  } catch (error) {
    console.error("LinkedIn publish exception", error);
    const detail =
      error instanceof Error ? error.message : "Unknown LinkedIn publishing error.";
    return new Response(
      resultPage(
        "LinkedIn publish failed",
        detail + " No successful publication was recorded."
      ),
      { status: 502, headers }
    );
  }}
