import { NextResponse } from "next/server";
import { getRun } from "workflow/api";
import { verifyReleaseApprovalToken } from "../../../lib/release-auth";
import { mergeAuthorityPullRequest } from "../../../lib/connectors/github";
import { verifyLiveUrl } from "../../../lib/connectors/verify";
import { publishStagedWordPressPost } from "../../../lib/connectors/wordpress";
import { publishXPost } from "../../../lib/connectors/x";
import { submitIndexNow } from "../../../lib/connectors/indexnow";
import {
  inspectSearchConsoleUrl,
  submitSearchConsoleSitemap
} from "../../../lib/connectors/google";

export const runtime = "nodejs";
export const maxDuration = 300;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const campaignRunId = String(body?.campaignRunId || "");
  const releaseToken = String(body?.releaseToken || "");
  const confirmation = String(body?.confirmation || "");
  const selections = {
    website: body?.selections?.website !== false,
    wordpressJetpack: body?.selections?.wordpressJetpack !== false,
    x: body?.selections?.x !== false,
    indexing: body?.selections?.indexing !== false
  };

  if (!campaignRunId || !releaseToken) {
    return NextResponse.json(
      { error: "Campaign approval token is required." },
      { status: 400 }
    );
  }

  if (confirmation !== "PUBLISH APPROVED CHANNELS") {
    return NextResponse.json(
      { error: "Final live-publishing confirmation was not supplied." },
      { status: 400 }
    );
  }

  if (!verifyReleaseApprovalToken(releaseToken, campaignRunId)) {
    return NextResponse.json(
      { error: "Campaign approval expired or is invalid. Approve the package again." },
      { status: 403 }
    );
  }

  try {
    const campaignRun = await getRun(campaignRunId);
    const campaignStatus = String(await campaignRun.status || "").toLowerCase();

    if (campaignStatus !== "completed") {
      return NextResponse.json(
        { error: "Campaign is not complete and cannot be released." },
        { status: 409 }
      );
    }

    const campaign: any = await campaignRun.returnValue;
    const artifacts = campaign?.artifacts || {};
    const article = artifacts?.article || {};
    const channels = artifacts?.channels || {};
    const staged = artifacts?.staged || {};
    const verification = artifacts?.verification || {};

    if (!verification?.safeToStage) {
      return NextResponse.json(
        { error: "Campaign verification did not clear the package for release." },
        { status: 409 }
      );
    }

    if (!article?.slug || !channels || !staged) {
      return NextResponse.json(
        { error: "Campaign release artifacts are incomplete." },
        { status: 422 }
      );
    }

    const canonicalUrl =
      "https://www.mharisaslam.com/insights/" +
      article.slug;

    const result: Record<string, any> = {
      campaignRunId,
      canonicalUrl,
      selections,
      website: { status: selections.website ? "PENDING" : "NOT_SELECTED" },
      websiteVerification: { status: "PENDING" },
      wordpressJetpack: {
        status: selections.wordpressJetpack ? "PENDING" : "NOT_SELECTED"
      },
      x: { status: selections.x ? "PENDING" : "NOT_SELECTED" },
      indexing: { status: selections.indexing ? "PENDING" : "NOT_SELECTED" },
      manualGates: {
        linkedin: "FINAL HUMAN APPROVAL REQUIRED",
        medium: "HANDOFF ONLY",
        substack: "HANDOFF ONLY"
      }
    };

    if (selections.website) {
      const prNumber = Number(staged?.github?.prNumber || 0);
      const expectedHeadSha = String(
        staged?.visual?.ref ||
          staged?.github?.commitSha ||
          ""
      );

      if (!prNumber) {
        result.website = {
          status: "BLOCKED",
          error: "No staged GitHub pull request is attached to this campaign."
        };
      } else {
        try {
          result.website = await mergeAuthorityPullRequest({
            prNumber,
            ...(expectedHeadSha ? { expectedHeadSha } : {})
          });
        } catch (error) {
          result.website = {
            status: "BLOCKED",
            error: error instanceof Error ? error.message : String(error)
          };
        }
      }
    }

    // Always verify the canonical URL before sending traffic to it.
    for (let attempt = 0; attempt < 18; attempt += 1) {
      try {
        const check = await verifyLiveUrl(canonicalUrl);
        const canonicalOk =
          !check.canonical ||
          check.canonical === canonicalUrl ||
          check.canonical === canonicalUrl + "/";

        result.websiteVerification = {
          ...check,
          canonicalOk,
          status:
            check.ok &&
            check.status === 200 &&
            canonicalOk
              ? "LIVE"
              : "PENDING"
        };

        if (result.websiteVerification.status === "LIVE") break;
      } catch (error) {
        result.websiteVerification = {
          status: "PENDING",
          error: error instanceof Error ? error.message : String(error)
        };
      }

      await sleep(5000);
    }

    const canonicalLive = result.websiteVerification.status === "LIVE";

    if (!canonicalLive) {
      if (selections.wordpressJetpack) {
        result.wordpressJetpack = {
          status: "BLOCKED",
          error: "Canonical website URL did not become live within the release window."
        };
      }
      if (selections.x) {
        result.x = {
          status: "BLOCKED",
          error: "Canonical website URL did not become live within the release window."
        };
      }
      if (selections.indexing) {
        result.indexing = {
          status: "BLOCKED",
          error: "Canonical website URL did not become live within the release window."
        };
      }

      return NextResponse.json({
        ...result,
        status: "PARTIAL",
        completedAt: new Date().toISOString()
      });
    }

    const parallelTasks: Promise<void>[] = [];

    if (selections.wordpressJetpack) {
      parallelTasks.push(
        (async () => {
          const postId = Number(staged?.wordpress?.id || 0);
          if (!postId) {
            result.wordpressJetpack = {
              status: "BLOCKED",
              error: "No staged WordPress draft is attached to this campaign."
            };
            return;
          }

          const publicizeMessage = String(channels.linkedinPost || "")
            .replace(/\n{3,}/g, "\n\n")
            .trim()
            .slice(0, 440);

          try {
            result.wordpressJetpack = await publishStagedWordPressPost({
              postId,
              publicizeMessage:
                publicizeMessage.includes(canonicalUrl)
                  ? publicizeMessage
                  : publicizeMessage + "\n\n" + canonicalUrl,
              keepSearchCanonicalOnMainSite: true
            });
          } catch (error) {
            result.wordpressJetpack = {
              status: "BLOCKED",
              error: error instanceof Error ? error.message : String(error)
            };
          }
        })()
      );
    }

    if (selections.x) {
      parallelTasks.push(
        (async () => {
          const draft = String(channels.xPost || "").trim();
          const text = draft.includes(canonicalUrl)
            ? draft
            : draft + "\n\n" + canonicalUrl;

          try {
            result.x = await publishXPost({ text });
          } catch (error) {
            result.x = {
              status: "BLOCKED",
              error: error instanceof Error ? error.message : String(error)
            };
          }
        })()
      );
    }

    await Promise.all(parallelTasks);

    if (selections.indexing) {
      const indexing: Record<string, any> = {
        status: "ACTIVE",
        indexNow: { status: "PENDING" },
        googleSitemap: { status: "PENDING" },
        googleInspection: { status: "PENDING" }
      };

      try {
        const submission = await submitIndexNow([canonicalUrl]);
        indexing.indexNow = {
          ...submission,
          status: "SUBMITTED"
        };
      } catch (error) {
        indexing.indexNow = {
          status: "BLOCKED",
          error: error instanceof Error ? error.message : String(error)
        };
      }

      try {
        indexing.googleSitemap = await submitSearchConsoleSitemap(
          "https://www.mharisaslam.com/sitemap.xml"
        );
      } catch (error) {
        indexing.googleSitemap = {
          status: "BLOCKED",
          error: error instanceof Error ? error.message : String(error)
        };
      }

      try {
        const inspection = await inspectSearchConsoleUrl(canonicalUrl);
        indexing.googleInspection = {
          ...inspection,
          status:
            inspection.verdict === "PASS"
              ? "INDEXED"
              : "MONITORING"
        };
      } catch (error) {
        indexing.googleInspection = {
          status: "MONITORING",
          error: error instanceof Error ? error.message : String(error)
        };
      }

      indexing.note =
        "Authority OS submitted the canonical URL to IndexNow, re-submitted the Google sitemap when authorized, and inspected Google index status. Google controls crawl/index timing for ordinary articles and does not provide a general-purpose instant-index API.";

      result.indexing = indexing;
    }

    return NextResponse.json({
      ...result,
      status: "COMPLETED",
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Live release failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
