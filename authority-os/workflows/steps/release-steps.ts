import type { AuthorityArticle, ChannelPackage, StageResult } from "../types";

export type ReleaseSelections = {
  website: boolean;
  wordpressJetpack: boolean;
  x: boolean;
  indexing: boolean;
};

export type ReleaseInput = {
  campaignRunId: string;
  article: AuthorityArticle;
  channels: ChannelPackage;
  staged: StageResult;
  selections: ReleaseSelections;
};

export async function releaseWebsiteStep(input: ReleaseInput) {
  "use step";

  if (!input.selections.website) {
    return { status: "NOT_SELECTED" };
  }

  const prNumber = Number(input.staged.github?.prNumber || 0);
  const expectedHeadSha = String(
    input.staged.github?.commitSha ||
      input.staged.visual?.ref ||
      ""
  );

  if (!prNumber) {
    return {
      status: "BLOCKED",
      error: "No staged GitHub pull request is attached to this campaign."
    };
  }

  try {
    const { mergeAuthorityPullRequest } = await import("../../lib/connectors/github");
    return await mergeAuthorityPullRequest({
      prNumber,
      ...(expectedHeadSha ? { expectedHeadSha } : {})
    });
  } catch (error) {
    return {
      status: "BLOCKED",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function verifyWebsiteStep(article: AuthorityArticle) {
  "use step";

  const url =
    "https://www.mharisaslam.com/insights/" +
    article.slug;

  try {
    const { verifyLiveUrl } = await import("../../lib/connectors/verify");
    const result = await verifyLiveUrl(url);
    const canonicalOk =
      !result.canonical ||
      result.canonical === url ||
      result.canonical === url + "/";

    return {
      status:
        result.ok &&
        result.status === 200 &&
        canonicalOk
          ? "LIVE"
          : "PENDING",
      url,
      ...result,
      canonicalOk
    };
  } catch (error) {
    return {
      status: "PENDING",
      url,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function releaseWordPressStep(input: ReleaseInput) {
  "use step";

  if (!input.selections.wordpressJetpack) {
    return { status: "NOT_SELECTED" };
  }

  const postId = Number(input.staged.wordpress?.id || 0);
  if (!postId) {
    return {
      status: "BLOCKED",
      error: "No staged WordPress draft is attached to this campaign."
    };
  }

  const canonicalUrl =
    "https://www.mharisaslam.com/insights/" +
    input.article.slug;

  const publicizeMessage = String(input.channels.linkedinPost || "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 480);

  try {
    const { publishStagedWordPressPost } = await import(
      "../../lib/connectors/wordpress"
    );

    return await publishStagedWordPressPost({
      postId,
      publicizeMessage:
        publicizeMessage.includes(canonicalUrl)
          ? publicizeMessage
          : publicizeMessage + "\n\n" + canonicalUrl,
      keepSearchCanonicalOnMainSite: true
    });
  } catch (error) {
    return {
      status: "BLOCKED",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function releaseXStep(input: ReleaseInput) {
  "use step";

  if (!input.selections.x) {
    return { status: "NOT_SELECTED" };
  }

  const canonicalUrl =
    "https://www.mharisaslam.com/insights/" +
    input.article.slug;

  const draft = String(input.channels.xPost || "").trim();
  const text = draft.includes(canonicalUrl)
    ? draft
    : draft + "\n\n" + canonicalUrl;

  try {
    const { publishXPost } = await import("../../lib/connectors/x");
    return await publishXPost({ text });
  } catch (error) {
    return {
      status: "BLOCKED",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function indexingStep(input: ReleaseInput) {
  "use step";

  if (!input.selections.indexing) {
    return { status: "NOT_SELECTED" };
  }

  const url =
    "https://www.mharisaslam.com/insights/" +
    input.article.slug;

  let indexNow: Record<string, unknown> = { status: "NOT_EXECUTED" };
  let googleSitemap: Record<string, unknown> = { status: "NOT_EXECUTED" };
  let googleInspection: Record<string, unknown> = { status: "NOT_EXECUTED" };

  try {
    const { submitIndexNow } = await import("../../lib/connectors/indexnow");
    const result = await submitIndexNow([url]);
    indexNow = {
      ...result,
      releaseStatus: "SUBMITTED"
    };
  } catch (error) {
    indexNow = {
      status: "BLOCKED",
      error: error instanceof Error ? error.message : String(error)
    };
  }

  try {
    const {
      submitSearchConsoleSitemap,
      inspectSearchConsoleUrl
    } = await import("../../lib/connectors/google");

    googleSitemap = await submitSearchConsoleSitemap(
      "https://www.mharisaslam.com/sitemap.xml"
    );

    const inspected = await inspectSearchConsoleUrl(url);
    googleInspection = {
      ...inspected,
      status:
        inspected.verdict === "PASS"
          ? "INDEXED"
          : "MONITORING"
    };
  } catch (error) {
    googleInspection = {
      status: "MONITORING",
      error: error instanceof Error ? error.message : String(error)
    };
  }

  return {
    status: "ACTIVE",
    url,
    indexNow,
    googleSitemap,
    googleInspection,
    note:
      "IndexNow and sitemap submission request discovery/crawl. Google does not provide a general-purpose API that guarantees immediate indexing for ordinary articles."
  };
}
