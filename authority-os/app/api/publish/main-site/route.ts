import { NextResponse } from "next/server";
import { publishMainSiteArticle } from "../../../../lib/connectors/github";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const article = await request.json();
    const result = await publishMainSiteArticle(article);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Main-site publish failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
