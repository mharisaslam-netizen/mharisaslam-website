
import type {
  CampaignInput,
  AuthorityArticle,
  ChannelPackage,
  VerificationResult,
  StageResult
} from "../types";

export async function stageCampaignStep(
  input: CampaignInput,
  article: AuthorityArticle,
  channels: ChannelPackage,
  verification: VerificationResult
): Promise<StageResult> {
  "use step";

  if (!verification.safeToStage) {
    const reason = verification.blockingIssues.join("; ") || "Verification did not clear the package for staging.";
    return {
      github: { status: "BLOCKED", reason },
      wordpress: { status: "BLOCKED", reason },
      linkedin: { status: "BLOCKED", reason }
    };
  }

  let github: Record<string, unknown>;
  let wordpress: Record<string, unknown>;
  let linkedin: Record<string, unknown>;

  try {
    const { publishMainSiteArticle } = await import("../../lib/connectors/github");
    github = await publishMainSiteArticle(article as any);
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

  return { github, wordpress, linkedin };
}
