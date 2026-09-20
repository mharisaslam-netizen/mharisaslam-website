import { NextResponse } from "next/server";
import { verifyLiveUrl } from "../../../../lib/connectors/verify";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.url) return NextResponse.json({ error: "url is required" }, { status: 400 });
    const result = await verifyLiveUrl(body.url, body.expectedTitle);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
