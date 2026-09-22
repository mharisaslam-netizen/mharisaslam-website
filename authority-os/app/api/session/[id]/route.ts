
import { NextResponse } from "next/server";
import { getRun } from "workflow/api";

export const runtime = "nodejs";

function toIso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const run = await getRun(id);
    const [status, workflowName, createdAt, startedAt, completedAt] = await Promise.all([
      run.status,
      run.workflowName,
      run.createdAt,
      run.startedAt,
      run.completedAt
    ]);

    const rawStatus = String(status || "running").toLowerCase();
    const terminalStatuses = new Set(["completed", "failed", "cancelled", "canceled"]);
    const terminal = terminalStatuses.has(rawStatus);

    let result: any = null;
    if (rawStatus === "completed") {
      result = await run.returnValue.catch(() => null);
    }

    return NextResponse.json({
      id,
      status: rawStatus,
      raw_status: rawStatus,
      terminal,
      engine: "vercel-workflow",
      workflow_name: workflowName,
      created_at: toIso(createdAt),
      started_at: toIso(startedAt),
      completed_at: toIso(completedAt),
      error: rawStatus === "failed" ? "The durable workflow failed. Open Vercel Workflows for the failed step." : null,
      final_answer: result?.finalAnswer || null,
      activity: Array.isArray(result?.activity)
        ? result.activity.map((text: string, index: number) => ({
            id: "workflow-" + index,
            phase: "workflow",
            text
          }))
        : [],
      tool_call_count: Number(result?.toolCallCount || 0),
      artifacts: result?.artifacts || null
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not retrieve durable workflow run.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
