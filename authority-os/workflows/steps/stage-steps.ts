import type {
  CampaignInput,
  AuthorityArticle,
  ChannelPackage,
  VerificationResult,
  VisualBrief,
  StageResult
} from "../types";

type GeneratedVisual = {
  base64: string;
  mimeType: string;
  extension: string;
  size?: string;
  quality?: string;
};

export async function stageCampaignStep(
  input: CampaignInput,
  article: AuthorityArticle,
  channels: ChannelPackage,
  visualBrief: VisualBrief,
  verification: VerificationResult
): Promise<StageResult> {
  "use step";

  if (!verification.safeToStage) {
    const reason =
      verification.blockingIssues.join("; ") ||
      "Verification did not clear the package for staging.";
    return {
      github: { status: "BLOCKED", reason },
      wordpress: { status: "BLOCKED", reason },
      linkedin: { status: "BLOCKED", reason },
      visual: { status: "BLOCKED", reason }
    };
  }

  const authorityBase = String(process.env.AUTHORITY_OS_BASE_URL || "").replace(/\/$/, "");
  const canonicalUrl = "https://www.mharisaslam.com/insights/" + article.slug;

  let generatedVisual: GeneratedVisual | null = null;
  let github: Record<string, unknown> = { status: "NOT EXECUTED" };
  let wordpress: Record<string, unknown> = { status: "NOT EXECUTED" };
  let linkedin: Record<string, unknown> = { status: "NOT EXECUTED" };
  let visual: Record<string, unknown> = { status: "NOT EXECUTED" };

  // Generate the creative once. Each channel can then use the same approved campaign asset.
  try {
    const { generateAuthorityVisual } = await import("../../lib/connectors/openai-image");
    generatedVisual = await generateAuthorityVisual(visualBrief);
    visual = {
      status: "GENERATED",
      mimeType: generatedVisual.mimeType,
      extension: generatedVisual.extension,
      size: generatedVisual.size || null,
      quality: generatedVisual.quality || null
    };
  } catch (error) {
    visual = {
      status: "BLOCKED",
      error: error instanceof Error ? error.message : String(error)
    };
  }

  // Stage the canonical website article and, when available, its hero image in the same draft PR branch.
  try {
    const { publishMainSiteArticle, uploadDraftAsset } = await import("../../lib/connectors/github");
    const visualPublicPath = "/assets/authority-os/" + article.slug + "-hero.jpg";
    github = await publishMainSiteArticle({
      ...article,
      visual: generatedVisual ? [visualPublicPath] : article.visual
    } as any);
    github.status = "STAGED";

    if (generatedVisual) {
      const draftBranch = String(github?.draftBranch || "");
      if (!draftBranch) throw new Error("GitHub draft branch is unavailable for visual staging.");

      const assetPath = "public/assets/authority-os/" + article.slug + "-hero." + generatedVisual.extension;
      const uploaded = await uploadDraftAsset({
        branch: draftBranch,
        path: assetPath,
        base64: generatedVisual.base64,
        message: "Stage authority visual: " + article.title
      });

      const ref = String(uploaded.commitSha || "");
      const previewPath =
        "/api/preview/asset?ref=" +
        encodeURIComponent(ref) +
        "&path=" +
        encodeURIComponent(assetPath);

      visual = {
        ...visual,
        status: "STAGED",
        assetPath,
        publicPath: visualPublicPath,
        ref,
        commitUrl: uploaded.commitUrl || null,
        width: 1536,
        height: 864,
        previewUrl: previewPath,
        absolutePreviewUrl: authorityBase ? authorityBase + previewPath : previewPath
      };
    }
  } catch (error) {
    github = {
      status: "BLOCKED",
      error: error instanceof Error ? error.message : String(error)
    };
  }

  // WordPress gets the same image as featured media so Jetpack/social cards can inherit it later.
  try {
    const {
      publishWordPressPost,
      uploadWordPressMedia
    } = await import("../../lib/connectors/wordpress");

    let featuredMedia: number | undefined;
    let wordpressMedia: Record<string, unknown> | null = null;

    if (generatedVisual) {
      try {
        wordpressMedia = await uploadWordPressMedia({
          base64: generatedVisual.base64,
          filename: article.slug + "-hero." + generatedVisual.extension,
          mimeType: generatedVisual.mimeType,
          altText: visualBrief.altText,
          title: article.title
        });
        featuredMedia = Number(wordpressMedia.id || 0) || undefined;
      } catch (error) {
        wordpressMedia = {
          status: "BLOCKED",
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }

    wordpress = await publishWordPressPost({
      title: channels.wordpressTitle,
      content: channels.wordpressHtml,
      excerpt: channels.wordpressExcerpt,
      slug: article.slug,
      status: "draft",
      ...(featuredMedia ? { featured_media: featuredMedia } : {})
    });
    wordpress.status = "STAGED";
    wordpress.media = wordpressMedia;
  } catch (error) {
    wordpress = {
      status: "BLOCKED",
      error: error instanceof Error ? error.message : String(error)
    };
  }

  // Generate an initial review handoff. The UI can always mint a fresh one later because these links expire.
  try {
    const { createLinkedInReviewHandoff } = await import("../../lib/connectors/linkedin");
    const visualUrl =
      typeof visual.absolutePreviewUrl === "string" ? visual.absolutePreviewUrl : undefined;

    linkedin = createLinkedInReviewHandoff({
      text: channels.linkedinPost,
      articleUrl: canonicalUrl,
      title: article.title,
      description: article.metaDescription,
      visualUrl,
      visualAlt: visualBrief.altText,
      visualTitle: article.title,
      label: "Authority OS — " + article.title.slice(0, 80)
    });
    linkedin.status = "READY FOR REVIEW";
  } catch (error) {
    linkedin = {
      status: "BLOCKED",
      error: error instanceof Error ? error.message : String(error)
    };
  }

  return { github, wordpress, linkedin, visual };
}
