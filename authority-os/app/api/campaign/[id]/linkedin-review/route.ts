import { NextResponse } from "next/server";
import { getRun } from "workflow/api";
import { createLinkedInReviewHandoff } from "../../../../../lib/connectors/linkedin";
import { getDraftAssetPreview } from "../../../../../lib/connectors/github";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const run = await getRun(id);
    const status = String(await run.status || "").toLowerCase();
    if (status !== "completed") {
      return NextResponse.json(
        { error: "Campaign must be completed before opening LinkedIn review." },
        { status: 409 }
      );
    }

    const result: any = await run.returnValue;
    const artifacts = result?.artifacts || {};
    const article = artifacts.article || {};
    const channels = artifacts.channels || {};
    const visualBrief = artifacts.visual || {};
    const staged = artifacts.staged || {};

    if (!article.slug || !channels.linkedinPost) {
      return NextResponse.json(
        { error: "Campaign is missing LinkedIn review artifacts." },
        { status: 422 }
      );
    }

    let visualUrl: string | undefined;
    const liveVisualUrl =
      "https://www.mharisaslam.com/assets/authority-os/" +
      article.slug +
      "-hero.jpg";

    try {
      const liveVisual = await fetch(liveVisualUrl, {
        method: "HEAD",
        cache: "no-store"
      });
      const liveType = String(liveVisual.headers.get("content-type") || "").toLowerCase();
      if (liveVisual.ok && liveType.startsWith("image/")) {
        visualUrl = liveVisualUrl;
      }
    } catch {}

    if (!visualUrl) {
      const existingVisualUrl = String(staged?.visual?.absolutePreviewUrl || "");
      if (existingVisualUrl) {
        visualUrl = existingVisualUrl;
      } else {
        const draftBranch = String(staged?.github?.draftBranch || "");
        if (draftBranch) {
          const assetPath =
            "public/assets/authority-os/" +
            article.slug +
            "-hero.jpg";
          const resolved = await getDraftAssetPreview({
            branch: draftBranch,
            path: assetPath
          });
          if (resolved.exists && resolved.ref) {
            const base = String(process.env.AUTHORITY_OS_BASE_URL || "").replace(/\/$/, "");
            const previewPath =
              "/api/preview/asset?ref=" +
              encodeURIComponent(String(resolved.ref)) +
              "&path=" +
              encodeURIComponent(assetPath);
            visualUrl = base ? base + previewPath : undefined;
          }
        }
      }
    }

    const canonicalUrl = "https://www.mharisaslam.com/insights/" + article.slug;
    const linkedinText = String(channels.linkedinPost || "").includes(canonicalUrl)
      ? String(channels.linkedinPost || "")
      : String(channels.linkedinPost || "").trim() + "\n\nRead the full framework:\n" + canonicalUrl;

    const handoff = createLinkedInReviewHandoff({
      text: linkedinText,
      articleUrl: canonicalUrl,
      title: article.title,
      description: article.metaDescription,
      visualUrl,
      visualAlt: visualBrief.altText || "",
      visualTitle: article.title,
      label: "Authority OS — " + String(article.title || "").slice(0, 80)
    });

    return NextResponse.json(handoff);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not prepare LinkedIn review.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
