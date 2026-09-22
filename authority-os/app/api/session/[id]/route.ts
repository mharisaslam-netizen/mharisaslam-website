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

    const rawStatus = String(session.status || "idle").toLowerCase();
    const lastActiveAt = Number(session.last_active_at || 0);
    const nowSeconds = Math.floor(Date.now() / 1000);
    const staleSeconds = lastActiveAt ? Math.max(0, nowSeconds - lastActiveAt) : 0;
    const stale = rawStatus === "in_progress" && staleSeconds >= 15 * 60;
    const requiresAction = rawStatus === "requires_action";
    const idleWithoutFinal = rawStatus === "idle" && !finalAnswer;
    const terminal = Boolean(finalAnswer) || rawStatus === "failed" || idleWithoutFinal;
    const status = finalAnswer
      ? "completed"
      : idleWithoutFinal
        ? "idle_incomplete"
        : stale
          ? "stalled"
          : rawStatus;

    return NextResponse.json({
      id: session.id,
      status,
      raw_status: rawStatus,
      terminal,
      stale,
      stale_seconds: staleSeconds,
      requires_action: requiresAction,
      required_actions: session.required_actions || [],
      error: session.error || null,
      last_active_at: lastActiveAt || null,
      final_answer: finalAnswer,
      activity,
      tool_call_count: items.filter((item: any) => String(item?.id || "").startsWith("call_")).length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not retrieve agent session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
