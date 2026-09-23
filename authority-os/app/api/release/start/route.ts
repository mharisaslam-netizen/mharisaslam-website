import { NextResponse } from "next/server";
import { getRun, start } from "workflow/api";
import { verifyReleaseApprovalToken } from "../../../../lib/release-auth";
import { runAuthorityRelease } from "../../../../workflows/release";
import { monitorAuthorityIndexing } from "../../../../workflows/indexing-monitor";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const campaignRunId = String(body?.campaignRunId || "");
  const releaseToken = String(body?.releaseToken || "");
  const confirmation = String(body?.confirmation || "");
  const selections = body?.selections || {};

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

    const result: any = await campaignRun.returnValue;
    const artifacts = result?.artifacts || {};

    if (!artifacts?.verification?.safeToStage) {
      return NextResponse.json(
        { error: "Campaign verification did not clear the package for release." },
        { status: 409 }
      );
    }

    if (!artifacts?.article?.slug || !artifacts?.channels || !artifacts?.staged) {
      return NextResponse.json(
        { error: "Campaign release artifacts are incomplete." },
        { status: 422 }
      );
    }

    const releaseSelections = {
      website: selections.website !== false,
      wordpressJetpack: selections.wordpressJetpack !== false,
      x: selections.x !== false,
      indexing: selections.indexing !== false
    };

    const releaseInput = {
      campaignRunId,
      article: artifacts.article,
      channels: artifacts.channels,
      staged: artifacts.staged,
      selections: releaseSelections
    };

    const releaseRun = await start(runAuthorityRelease, [releaseInput]);

    let indexingMonitorRunId: string | null = null;
    if (releaseSelections.indexing) {
      const canonicalUrl =
        "https://www.mharisaslam.com/insights/" +
        artifacts.article.slug;
      const monitorRun = await start(monitorAuthorityIndexing, [canonicalUrl]);
      indexingMonitorRunId = monitorRun.runId;
    }

    return NextResponse.json({
      started: true,
      campaignRunId,
      releaseRunId: releaseRun.runId,
      indexingMonitorRunId,
      selections: releaseSelections
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start live release.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
