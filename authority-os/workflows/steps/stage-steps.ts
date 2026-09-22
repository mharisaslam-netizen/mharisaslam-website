
import type {
  CampaignInput,
  AuthorityArticle,
  ChannelPackage,
  VerificationResult,
  VisualBrief,
  StageResult
} from "../types";

export async function stageCampaignStep(
  input: CampaignInput,
  article: AuthorityArticle,
  channels: ChannelPackage,
  visualBrief: VisualBrief,
  verification: VerificationResult
): Promise<StageResult> {
  "use step";

  if (!verification.safeToStage) {
    const reason = verification.blockingIssues.join("; ") || "Verification did not clear the package for staging.";
    return {
      github: { status: "BLOCKED", reason },
      wordpress: { status: "BLOCKED", reason },
      linkedin: { status: "BLOCKED", reason },
      visual: { status: "BLOCKED", reason }
    };
  }

  let github: Record<string, unknown>;
  let wordpress: Record<string, unknown>;
  let linkedin: Record<string, unknown>;
  let visual: Record<string, unknown>;

  try {
    const { publishMainSiteArticle } = await import("../../lib/connectors/github");
    const visualPublicPath = "/assets/authority-os/" + article.slug + "-hero.jpg";
    github = await publishMainSiteArticle({
      ...article,
      visual: [visualPublicPath]
    } as any);
    github.status = "STAGED";
  } catch (error) {
    github = { status: "BLOCKED", error: error instanceof Error ? error.message : String(error) };
  }

  try {
    const { publishWordPressPost } = await import("../../lib/connectors/wordpress");
    wordpress = await publishWordPressPost({
      title: channels.wordpressTitle,
      content: channels.wordpressHtml,
      excerpt: channels.wordpressExcerpt,
      slug: article.slug,
      status: "draft"
    });
    wordpress.status = "STAGED";
  } catch (error) {
    wordpress = { status: "BLOCKED", error: error instanceof Error ? error.message : String(error) };
  }

  try {
    const draftBranch = String(github?.draftBranch || "");
    if (!draftBranch) throw new Error("GitHub draft branch is unavailable for visual staging.");

    const { generateAuthorityVisual } = await import("../../lib/connectors/openai-image");
    const { uploadDraftAsset } = await import("../../lib/connectors/github");
    const generated = await generateAuthorityVisual(visualBrief);
    const assetPath = "public/assets/authority-os/" + article.slug + "-hero." + generated.extension;
    const uploaded = await uploadDraftAsset({
      branch: draftBranch,
      path: assetPath,
      base64: generated.base64,
      message: "Stage authority visual: " + article.title
    });

    const ref = String(uploaded.commitSha || "");
    visual = {
      status: "STAGED",
      assetPath,
      ref,
      mimeType: generated.mimeType,
      width: 1536,
      height: 864,
      previewUrl:
        "/api/preview/asset?ref=" +
        encodeURIComponent(ref) +
        "&path=" +
        encodeURIComponent(assetPath)
    };
  } catch (error) {
    visual = { status: "BLOCKED", error: error instanceof Error ? error.message : String(error) };
  }

  try {
    const { createLinkedInReviewHandoff } = await import("../../lib/connectors/linkedin");
    linkedin = createLinkedInReviewHandoff({
      text: channels.linkedinPost,
      articleUrl: "https://www.mharisaslam.com/insights/" + article.slug,
      title: article.title,
      description: article.metaDescription,
      label: "Authority OS — " + article.title.slice(0, 80)
    });
    linkedin.status = "READY FOR REVIEW";
  } catch (error) {
    linkedin = { status: "BLOCKED", error: error instanceof Error ? error.message : String(error) };
  }

  return { github, wordpress, linkedin, visual };
}
