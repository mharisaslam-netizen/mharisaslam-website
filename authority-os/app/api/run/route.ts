import OpenAI from "openai";
import { NextResponse } from "next/server";
import { campaignInput, ceoInstructions } from "../../../lib/ceo";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.topic || typeof body.topic !== "string") {
    return NextResponse.json({ error: "A campaign topic or instruction is required." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Authority OS is built, but OPENAI_API_KEY still needs to be added in the Vercel environment." },
      { status: 503 }
    );
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const session = await (client as any).beta.agents.sessions.create({
      agent: {
        model: "gpt-6-astra",
        instructions: ceoInstructions,
        tools: [{ type: "web_search" }],
        multi_agent: {
          enabled: true,
          max_concurrent_subagents: 6
        }
      },
      environment: {
        type: "openai_hosted"
      },
      input: campaignInput({
        topic: body.topic,
        market: body.market || "GCC + Europe",
        objective: body.objective || "Authority + advisory leads",
        mode: body.mode || "CEO MODE"
      }),
      metadata: {
        product: "haris-authority-os",
        market: body.market || "GCC + Europe"
      }
    });

    return NextResponse.json({
      session_id: session.id,
      status: session.status || "started"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Agents API request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
