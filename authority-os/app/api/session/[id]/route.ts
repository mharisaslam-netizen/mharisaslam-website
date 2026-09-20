import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const session = await (client as any).beta.agents.sessions.retrieve(id);
    const itemsPage = await (client as any).beta.agents.sessions.items.list(id, { limit: 20, order: "desc" });
    const items = Array.isArray(itemsPage?.data) ? itemsPage.data : [];

    const messages = items
      .filter((item: any) => item?.object === "agent.session.message" || item?.type === "message" || item?.content)
      .slice(0, 8)
      .map((item: any) => ({
        id: item.id,
        phase: item.phase || null,
        content: item.content || item.summary || null
      }));

    return NextResponse.json({
      id: session.id,
      status: session.status || "running",
      error: session.error || null,
      last_active_at: session.last_active_at || null,
      messages
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not retrieve agent session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
