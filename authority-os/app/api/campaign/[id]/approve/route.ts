import { NextResponse } from "next/server";
import { getRun } from "workflow/api";
import { createReleaseApprovalToken } from "../../../../../lib/release-auth";

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
        { error: "Campaign must be completed before approval." },
        { status: 409 }
      );
    }

    const result: any = await run.returnValue;
    if (!result?.artifacts?.verification?.safeToStage) {
      return NextResponse.json(
        { error: "Campaign verification did not clear this package for release." },
        { status: 409 }
      );
    }

    const approval = createReleaseApprovalToken(id);
    return NextResponse.json({
      approved: true,
      runId: id,
      releaseToken: approval.token,
      expiresAt: approval.expiresAt
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not approve campaign release.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
