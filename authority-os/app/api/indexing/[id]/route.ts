import { NextResponse } from "next/server";
import { getRun } from "workflow/api";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const run = await getRun(id);
    const status = String(await run.status || "running").toLowerCase();

    let result: any = null;
    if (status === "completed") {
      result = await run.returnValue.catch(() => null);
    }

    return NextResponse.json({
      id,
      status,
      terminal: ["completed", "failed", "cancelled", "canceled"].includes(status),
      result,
      note:
        status === "running"
          ? "Authority OS is monitoring Search Console index status in the background."
          : null
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load indexing monitor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
