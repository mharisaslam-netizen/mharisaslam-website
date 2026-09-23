
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

function modelFor(tier: "economy" | "flagship") {
  if (tier === "flagship") {
    return process.env.AUTHORITY_OS_FLAGSHIP_MODEL || "gpt-6-sol";
  }
  return process.env.AUTHORITY_OS_ECONOMY_MODEL || "gpt-6-luna";
}

async function structured<T>(
  name: string,
  schema: Record<string, unknown>,
  instructions: string,
  input: string,
  useWeb: boolean,
  tier: "economy" | "flagship" = "economy",
  effort: "low" | "medium" = "low"
): Promise<T> {
  const openai = client();
  const response = await openai.responses.create({
    model: modelFor(tier),
    reasoning: { effort },
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
      ? "You are the Research Agent. Find the strongest genuinely current, defensible authority opportunities for Haris. When the command says today, latest, current or strongest topic for today, prioritize developments from the last 72 hours and require at least one material source from the last 7 days. Prefer primary and official sources plus high-quality current reporting, and check the canonical site for duplication. Do not choose an evergreen refresh merely because it is easy. Do not invent facts."
      : role === "challenge"
        ? "You are the Challenge Agent. Stress-test obvious topic choices, identify crowded or weak angles, detect duplication with existing Haris content, and find factual or positioning risks. Use current web evidence where needed."
        : "You are the Strategy Agent. Optimize for senior GCC and Europe decision-makers, family-business owners, boards, investors and executive search. Find angles with genuine commercial relevance, not generic thought leadership. When the command asks for today or the strongest current topic, give a strong freshness premium to developments from the last 72 hours and penalize existing evergreen topics unless a new external event materially changes the thesis. Use evidence and analytics but do not overclaim sparse data.";

  return structured<SpecialistOutput>(
    role + "_specialist",
    specialistSchema as any,
    instructions,
    shared,
    role !== "strategy",
    "economy",
    "low"
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
    true,
    "economy",
    "low"
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
      "Score candidate topics using this hierarchy: freshness/timeliness 30%, differentiated Haris operating insight 25%, GCC + Europe commercial relevance 20%, strength of evidence 15%, and search/editorial whitespace 10%.",
      "If the command says today, latest or current, do not select a generic evergreen refresh unless it is anchored to a material development from the last 7 days.",
      "Prefer AI, agentic AI, fintech, digital commerce and operating-model topics when they are materially current and commercially relevant.",
      "Avoid duplicating existing content. Never invent Haris achievements.",
      "This is REVIEW MODE: no publication."
    ].join("\n"),
    "Campaign: " + JSON.stringify(input) + "\n\nSpecialists: " + JSON.stringify(specialists),
    false,
    "flagship",
    "medium"
  );
}

export async function flagshipStep(
  input: CampaignInput,
  decision: Decision
): Promise<AuthorityArticle> {
  "use step";

  const article = await structured<AuthorityArticle>(
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
    false,
    "flagship",
    "medium"
  );

  function normalizeForMainSite(value: unknown): unknown {
    if (typeof value === "string") return value.replace(/[—–]/g, "-");
    if (Array.isArray(value)) return value.map(normalizeForMainSite);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, item]) => [
          key,
          normalizeForMainSite(item)
        ])
      );
    }
    return value;
  }

  const normalized = normalizeForMainSite(article) as AuthorityArticle;
  normalized.datePublished = new Date().toISOString().slice(0, 10);
  return normalized;
}

export async function channelsStep(
  input: CampaignInput,
  decision: Decision,
  article: AuthorityArticle
): Promise<ChannelPackage> {
  "use step";

  const result = await structured<ChannelPackage>(
    "channel_package",
    channelsSchema as any,
    [
      "You are the Channel Adaptation Agent.",
      "Adapt the flagship idea natively for each channel rather than copying it verbatim.",
      "LinkedIn should be executive and conversational.",
      "X must be concise enough to leave room for the canonical website URL; keep the standalone copy under roughly 210 characters before the URL.",
      "Medium should read like an editorial adaptation and Substack like an executive newsletter.",
      "The WordPress derivative should be shorter and differently structured from the canonical article.",
      "Every outward-facing channel should contain a clear route back to the canonical mharisaslam.com article.",
      "Never claim that anything is published."
    ].join("\n"),
    "Campaign: " + JSON.stringify(input) + "\n\nDecision: " + JSON.stringify(decision) + "\n\nFlagship article: " + JSON.stringify(article),
    false,
    "economy",
    "low"
  );

  const canonicalUrl = "https://www.mharisaslam.com/insights/" + article.slug;
  const hasCanonical = (value: string) =>
    value.includes(canonicalUrl) || value.includes("mharisaslam.com/insights/" + article.slug);

  if (!hasCanonical(result.linkedinPost)) {
    result.linkedinPost = result.linkedinPost.trim() + "\n\nRead the full framework:\n" + canonicalUrl;
  }

  if (!hasCanonical(result.xPost)) {
    result.xPost = result.xPost.trim() + "\n\n" + canonicalUrl;
  }

  if (result.xThread.length && !result.xThread.some(hasCanonical)) {
    const last = result.xThread[result.xThread.length - 1].trim();
    const addition = "\n\nFull framework: " + canonicalUrl;
    if ((last + addition).length <= 280) result.xThread[result.xThread.length - 1] = last + addition;
    else result.xThread.push("Full framework:\n" + canonicalUrl);
  }

  if (!hasCanonical(result.mediumBody)) {
    result.mediumBody =
      result.mediumBody.trim() +
      "\n\n---\n\nOriginally published on mharisaslam.com: " +
      canonicalUrl;
  }

  if (!hasCanonical(result.substackBody)) {
    result.substackBody =
      result.substackBody.trim() +
      "\n\nRead the full framework on mharisaslam.com:\n" +
      canonicalUrl;
  }

  if (!result.wordpressHtml.includes(canonicalUrl)) {
    result.wordpressHtml =
      result.wordpressHtml.trim() +
      '<p><a href="' + canonicalUrl + '">Read the full framework on mharisaslam.com</a></p>';
  }

  return result;
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
    false,
    "economy",
    "low"
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
    true,
    "flagship",
    "low"
  );
}
