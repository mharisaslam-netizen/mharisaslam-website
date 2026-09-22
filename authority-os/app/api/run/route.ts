
import { NextResponse } from "next/server";
import { start } from "workflow/api";
import { runAuthorityCampaign } from "../../../workflows/campaign";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.topic || typeof body.topic !== "string") {
    return NextResponse.json(
      { error: "A campaign topic or instruction is required." },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY still needs to be added in the Vercel environment." },
      { status: 503 }
    );
  }

  try {
    const campaignId = crypto.randomUUID();
    const run = await start(runAuthorityCampaign, [{
      campaignId,
      topic: body.topic,
      market: body.market || "GCC + Europe",
      objective: body.objective || "Authority + advisory leads",
      mode: body.mode || "CEO MODE"
    }]);

    return NextResponse.json({
      session_id: run.runId,
      campaign_id: campaignId,
      engine: "vercel-workflow",
      status: "started"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authority workflow could not start.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
