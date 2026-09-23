import { sleep } from "workflow";
import type { ReleaseInput } from "./steps/release-steps";
import {
  releaseWebsiteStep,
  verifyWebsiteStep,
  releaseWordPressStep,
  releaseXStep,
  indexingStep
} from "./steps/release-steps";

export async function runAuthorityRelease(input: ReleaseInput) {
  "use workflow";

  const website = await releaseWebsiteStep(input);

  let websiteVerification: any = {
    status: input.selections.website ? "PENDING" : "NOT_SELECTED"
  };

  // If the canonical site is selected for release, wait for the deployment to become live.
  if (input.selections.website) {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      websiteVerification = await verifyWebsiteStep(input.article);
      if (websiteVerification.status === "LIVE") break;
      await sleep("8 seconds");
    }
  } else {
    // Even when the site was already live, verify it before sending traffic elsewhere.
    websiteVerification = await verifyWebsiteStep(input.article);
  }

  const canonicalLive = websiteVerification.status === "LIVE";

  let wordpress: any = {
    status: input.selections.wordpressJetpack ? "BLOCKED" : "NOT_SELECTED",
    reason: input.selections.wordpressJetpack && !canonicalLive
      ? "Canonical website URL is not live yet."
      : undefined
  };

  let x: any = {
    status: input.selections.x ? "BLOCKED" : "NOT_SELECTED",
    reason: input.selections.x && !canonicalLive
      ? "Canonical website URL is not live yet."
      : undefined
  };

  let indexing: any = {
    status: input.selections.indexing ? "BLOCKED" : "NOT_SELECTED",
    reason: input.selections.indexing && !canonicalLive
      ? "Canonical website URL is not live yet."
      : undefined
  };

  if (canonicalLive) {
    [wordpress, x] = await Promise.all([
      releaseWordPressStep(input),
      releaseXStep(input)
    ]);

    indexing = await indexingStep(input);
  }

  return {
    status: canonicalLive ? "COMPLETED" : "PARTIAL",
    campaignRunId: input.campaignRunId,
    canonicalUrl:
      "https://www.mharisaslam.com/insights/" +
      input.article.slug,
    website,
    websiteVerification,
    wordpress,
    x,
    indexing,
    manualGates: {
      linkedin: "FINAL HUMAN APPROVAL REQUIRED",
      medium: "HANDOFF ONLY",
      substack: "HANDOFF ONLY"
    },
    completedAt: new Date().toISOString()
  };
}
