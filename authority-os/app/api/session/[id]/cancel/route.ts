import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    await (client as any).beta.agents.sessions.events.create(id, {
      events: [{ type: "agent.session.input.cancel" }]
    });

    return NextResponse.json({
      id,
      cancel_requested: true,
      message: "Cancellation requested. Saved session work remains available."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not cancel agent session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
