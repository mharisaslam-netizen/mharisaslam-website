import { NextResponse } from "next/server";
import { integrationSnapshot } from "../../../lib/integrations";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ integrations: integrationSnapshot() });
}
