import { NextResponse } from "next/server";
import { getRun } from "workflow/api";

export const runtime = "nodejs";

function iso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const run = await getRun(id);
    const [status, createdAt, startedAt, completedAt] = await Promise.all([
      run.status,
      run.createdAt,
      run.startedAt,
      run.completedAt
    ]);

    const raw = String(status || "running").toLowerCase();
    const terminal = ["completed", "failed", "cancelled", "canceled"].includes(raw);

    let result: any = null;
    if (raw === "completed") {
      result = await run.returnValue.catch(() => null);
    }

    return NextResponse.json({
      id,
      status: raw,
      terminal,
      createdAt: iso(createdAt),
      startedAt: iso(startedAt),
      completedAt: iso(completedAt),
      result,
      error:
        raw === "failed"
          ? "The live release workflow failed. No success is implied for unfinished channels."
          : null
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load release status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
