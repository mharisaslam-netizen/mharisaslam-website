
import OpenAI from "openai";
import { harisKnowledge } from "../../lib/knowledge";
import {
  specialistSchema,
  decisionSchema,
  articleSchema,
  channelsSchema,
  visualSchema,
  verificationSchema
} from "../schemas";
import type {
  CampaignInput,
  SpecialistOutput,
  AnalyticsSnapshot,
  Decision,
  AuthorityArticle,
  ChannelPackage,
  VisualBrief,
  VerificationResult
} from "../types";

function client() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  return new OpenAI({ apiKey });
}

function model() {
  return process.env.AUTHORITY_OS_MODEL || "gpt-5.6-sol";
}

async function structured<T>(
  name: string,
  schema: Record<string, unknown>,
  instructions: string,
  input: string,
  useWeb: boolean
): Promise<T> {
  const openai = client();
  const response = await openai.responses.create({
    model: model(),
    reasoning: { effort: "medium" },
    instructions,
    input,
    ...(useWeb ? { tools: [{ type: "web_search" as const }] } : {}),
    text: {
      format: {
        type: "json_schema",
        name,
        strict: true,
        schema
      }
    }
  } as any);

  const output = String((response as any).output_text || "").trim();
  if (!output) throw new Error(name + " returned no output.");
  return JSON.parse(output) as T;
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function analyticsStep(input: CampaignInput): Promise<AnalyticsSnapshot> {
  "use step";

  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 59);

  const startDate = dateOnly(start);
  const endDate = dateOnly(end);
  const notes: string[] = [];

  let searchConsole: unknown = null;
  let ga4: unknown = null;

  try {
    const { searchConsolePerformance } = await import("../../lib/connectors/google");
    searchConsole = await searchConsolePerformance({
      startDate,
      endDate,
      dimensions: ["query", "page", "country"],
      rowLimit: 75
    });
  } catch (error) {
    notes.push("Search Console unavailable: " + (error instanceof Error ? error.message : String(error)));
  }

  try {
    const { ga4Report } = await import("../../lib/connectors/google");
    ga4 = await ga4Report({
      startDate,
      endDate,
      dimensions: ["country", "sessionDefaultChannelGroup"],
      metrics: ["sessions", "activeUsers", "screenPageViews"],
      limit: 75
    });
  } catch (error) {
    notes.push("GA4 unavailable: " + (error instanceof Error ? error.message : String(error)));
  }

  return { period: { startDate, endDate }, searchConsole, ga4, notes };
}

export async function specialistStep(
  role: "research" | "challenge" | "strategy",
  input: CampaignInput,
  analytics: AnalyticsSnapshot
): Promise<SpecialistOutput> {
  "use step";

  const shared = [
    "Campaign command: " + input.topic,
    "Market: " + input.market,
    "Objective: " + input.objective,
    "Public positioning: " + JSON.stringify(harisKnowledge),
    "Analytics snapshot: " + JSON.stringify(analytics).slice(0, 12000),
    "Canonical website: https://www.mharisaslam.com"
  ].join("\n\n");

  const instructions =
    role === "research"
      ? "You are the Research Agent. Find the strongest current, defensible authority opportunities for Haris. Use current web evidence, prefer primary and official sources, and check the canonical site for duplication. Do not invent facts."
      : role === "challenge"
        ? "You are the Challenge Agent. Stress-test obvious topic choices, identify crowded or weak angles, detect duplication with existing Haris content, and find factual or positioning risks. Use current web evidence where needed."
        : "You are the Strategy Agent. Optimize for senior GCC and Europe decision-makers, family-business owners, boards, investors and executive search. Find angles with genuine commercial relevance, not generic thought leadership. Use evidence and analytics but do not overclaim sparse data.";

  return structured<SpecialistOutput>(
    role + "_specialist",
    specialistSchema as any,
    instructions,
    shared,
    role !== "strategy"
  );
}

export async function searchStrategyStep(
  input: CampaignInput,
  analytics: AnalyticsSnapshot
): Promise<SpecialistOutput> {
  "use step";

  const prompt = [
    "You are the Search & Analytics Agent.",
    "Interpret the supplied Search Console and GA4 data conservatively.",
    "Identify query, page and geography signals, content gaps and what the data cannot support.",
    "Cross-check against the canonical website using web search only where necessary.",
    "Campaign: " + JSON.stringify(input),
    "Analytics: " + JSON.stringify(analytics).slice(0, 14000)
  ].join("\n\n");

  return structured<SpecialistOutput>(
    "search_analytics_specialist",
    specialistSchema as any,
    "Return evidence-led search and analytics insight. Sparse data must be labelled sparse, not converted into false demand signals.",
    prompt,
    true
  );
}

export async function ceoDecisionStep(
  input: CampaignInput,
  specialists: SpecialistOutput[]
): Promise<Decision> {
  "use step";

  return structured<Decision>(
    "ceo_decision",
    decisionSchema as any,
    [
      "You are the CEO Agent for Haris Authority OS.",
      "Compare the independent specialist outputs and select exactly ONE authority topic.",
      "Prefer timeliness, differentiated operating insight, commercial relevance and defensible evidence.",
      "Avoid duplicating existing content. Never invent Haris achievements.",
      "This is REVIEW MODE: no publication."
    ].join("\n"),
    "Campaign: " + JSON.stringify(input) + "\n\nSpecialists: " + JSON.stringify(specialists),
    false
  );
}

export async function flagshipStep(
  input: CampaignInput,
  decision: Decision
): Promise<AuthorityArticle> {
  "use step";

  return structured<AuthorityArticle>(
    "flagship_article",
    articleSchema as any,
    [
      "You are the Flagship Writer for Haris Authority OS.",
      "Write a board-level, evidence-grounded article for mharisaslam.com.",
      "Use a practical operator voice: clear, commercial and non-hyped.",
      "The article must be substantial, typically 1,800 to 2,800 words across sections.",
      "Do not invent clients, revenue, implementation results or confidential employer detail.",
      "All dated and factual claims must be supported by the provided evidence URLs.",
      "Include a useful framework, takeaways, FAQs and sources."
    ].join("\n"),
    "Campaign: " + JSON.stringify(input) + "\n\nCEO decision: " + JSON.stringify(decision),
    false
  );
}

export async function channelsStep(
  input: CampaignInput,
  decision: Decision,
  article: AuthorityArticle
): Promise<ChannelPackage> {
  "use step";

  return structured<ChannelPackage>(
    "channel_package",
    channelsSchema as any,
    [
      "You are the Channel Adaptation Agent.",
      "Adapt the flagship idea natively for each channel rather than copying it verbatim.",
      "LinkedIn should be executive and conversational, X concise, Medium editorial, Substack newsletter-like.",
      "The WordPress derivative should be shorter and differently structured from the canonical article.",
      "Never claim that anything is published."
    ].join("\n"),
    "Campaign: " + JSON.stringify(input) + "\n\nDecision: " + JSON.stringify(decision) + "\n\nFlagship article: " + JSON.stringify(article),
    false
  );
}

export async function visualStep(
  input: CampaignInput,
  decision: Decision,
  article: AuthorityArticle
): Promise<VisualBrief> {
  "use step";

  return structured<VisualBrief>(
    "visual_brief",
    visualSchema as any,
    [
      "You are the Creative Director.",
      "Create one premium executive visual concept suitable for the article hero and social distribution.",
      "Avoid generic AI imagery, floating robots, glowing brains and stock-photo cliches.",
      "Prefer a simple information-rich visual, diagram or editorial composition.",
      "The imagePrompt must be directly usable with OpenAI image generation."
    ].join("\n"),
    "Campaign: " + JSON.stringify(input) + "\n\nDecision: " + JSON.stringify(decision) + "\n\nArticle title: " + article.title + "\nLead: " + article.lead,
    false
  );
}

export async function verificationStep(
  decision: Decision,
  article: AuthorityArticle
): Promise<VerificationResult> {
  "use step";

  return structured<VerificationResult>(
    "verification",
    verificationSchema as any,
    [
      "You are the Verification Agent.",
      "Verify consequential factual claims against current authoritative web sources.",
      "Check whether cited URLs support the claims and whether the framing overstates evidence.",
      "Set safeToStage=false only for material unsupported claims, invented results or serious factual errors.",
      "Minor wording cautions should not block draft staging."
    ].join("\n"),
    "CEO decision: " + JSON.stringify(decision) + "\n\nArticle: " + JSON.stringify(article),
    true
  );
}
