import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function extractText(item: any) {
  const content = Array.isArray(item?.content) ? item.content : [];
  return content
    .map((part: any) => {
      if (typeof part?.text === "string") return part.text;
      if (typeof part?.content === "string") return part.content;
      return "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

function cleanFinalAnswer(text: string) {
  return text
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/^(\d+)\\\.[ \t]*\n(?:[ \t]*\n)*[ \t]*(.+)$/gm, "$1. $2")
    .replace(/^•[ \t]*\n(?:[ \t]*\n)*[ \t]*(.+)$/gm, "- $1")
    .replace(
      /\n*The complete evidence-backed campaign package is available here:\s*\n+\[Download[^\]]*\]\(\/workspace\/outputs\/[^)]+\)\s*$/i,
      ""
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const session = await (client as any).beta.agents.sessions.retrieve(id);
    const itemsPage = await (client as any).beta.agents.sessions.items.list(id, {
      limit: 50,
      order: "desc"
    });
    const items = Array.isArray(itemsPage?.data) ? itemsPage.data : [];

    const finalItem = items.find(
      (item: any) => item?.phase === "final_answer" && extractText(item)
    );
    const finalAnswer = finalItem ? cleanFinalAnswer(extractText(finalItem)) : null;

    const activity = items
      .filter((item: any) => item?.phase === "commentary" && extractText(item))
      .slice(0, 6)
      .map((item: any) => ({
        id: item.id,
        phase: item.phase,
        text: extractText(item)
      }));

    const rawStatus = String(session.status || "running").toLowerCase();
    const terminalStatuses = new Set(["completed", "failed", "cancelled", "canceled"]);
    const terminal = Boolean(finalAnswer) || terminalStatuses.has(rawStatus);
    const status = finalAnswer && rawStatus === "idle" ? "completed" : rawStatus;

    return NextResponse.json({
      id: session.id,
      status,
      raw_status: rawStatus,
      terminal,
      error: session.error || null,
      last_active_at: session.last_active_at || null,
      final_answer: finalAnswer,
      activity,
      tool_call_count: items.filter((item: any) => String(item?.id || "").startsWith("call_")).length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not retrieve agent session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
