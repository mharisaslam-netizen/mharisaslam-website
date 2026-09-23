import { NextResponse } from "next/server";
import { getRun } from "workflow/api";
import { generateAuthorityVisual } from "../../../../../lib/connectors/openai-image";
import {
  uploadDraftAsset,
  setDraftArticleVisual
} from "../../../../../lib/connectors/github";
import {
  uploadWordPressMedia,
  updateWordPressFeaturedMedia
} from "../../../../../lib/connectors/wordpress";

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
        { error: "Campaign must be completed before generating its review visual." },
        { status: 409 }
      );
    }

    const result: any = await run.returnValue;
    const artifacts = result?.artifacts || {};
    const article = artifacts.article || {};
    const visualBrief = artifacts.visual || {};
    const staged = artifacts.staged || {};
    const draftBranch = String(staged?.github?.draftBranch || "");
    const wordpressPostId = Number(staged?.wordpress?.id || 0);

    if (!article.slug || !draftBranch || !visualBrief.imagePrompt) {
      return NextResponse.json(
        { error: "Campaign artifacts are missing the article, draft branch or visual brief." },
        { status: 422 }
      );
    }

    const generated = await generateAuthorityVisual(visualBrief);
    const assetPath =
      "public/assets/authority-os/" +
      article.slug +
      "-hero." +
      generated.extension;
    const publicPath =
      "/assets/authority-os/" +
      article.slug +
      "-hero." +
      generated.extension;

    const uploaded = await uploadDraftAsset({
      branch: draftBranch,
      path: assetPath,
      base64: generated.base64,
      message: "Stage authority visual: " + article.title
    });

    const articleUpdate = await setDraftArticleVisual({
      branch: draftBranch,
      slug: article.slug,
      visualPath: publicPath
    });

    let wordpressMedia: any = null;
    let wordpressUpdate: any = null;

    if (wordpressPostId) {
      try {
        wordpressMedia = await uploadWordPressMedia({
          base64: generated.base64,
          filename: article.slug + "-hero." + generated.extension,
          mimeType: generated.mimeType,
          altText: visualBrief.altText || article.title,
          title: article.title
        });

        wordpressUpdate = await updateWordPressFeaturedMedia(
          wordpressPostId,
          Number(wordpressMedia.id)
        );
      } catch (error) {
        wordpressMedia = {
          status: "BLOCKED",
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }

    const ref = String(articleUpdate.commitSha || uploaded.commitSha || "");
    const previewPath =
      "/api/preview/asset?ref=" +
      encodeURIComponent(ref) +
      "&path=" +
      encodeURIComponent(assetPath);

    return NextResponse.json({
      status: "STAGED",
      visual: {
        previewUrl: previewPath,
        ref,
        assetPath,
        publicPath,
        mimeType: generated.mimeType,
        width: 1536,
        height: 864
      },
      github: {
        draftBranch,
        commitSha: ref,
        commitUrl: articleUpdate.commitUrl || uploaded.commitUrl || null
      },
      wordpress: {
        postId: wordpressPostId || null,
        media: wordpressMedia,
        update: wordpressUpdate
      }
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Campaign visual generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
