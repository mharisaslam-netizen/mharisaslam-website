import { NextResponse } from "next/server";
import { publishWordPressPost } from "../../../../lib/connectors/wordpress";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = await request.json();
    const result = await publishWordPressPost(input);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "WordPress publish failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
