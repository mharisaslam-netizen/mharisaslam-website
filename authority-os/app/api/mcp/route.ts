import { z } from "zod";
import { createMcpHandler } from "mcp-handler";
import { integrationSnapshot } from "../../../lib/integrations";
import { publishMainSiteArticle } from "../../../lib/connectors/github";
import { publishWordPressPost } from "../../../lib/connectors/wordpress";
import { createLinkedInReviewHandoff } from "../../../lib/connectors/linkedin";
import { submitIndexNow } from "../../../lib/connectors/indexnow";
import { verifyLiveUrl } from "../../../lib/connectors/verify";
import { ga4Report, searchConsolePerformance } from "../../../lib/connectors/google";
import { canvaProfile } from "../../../lib/connectors/canva";

const handler = createMcpHandler((server) => {
  server.registerTool(
    "integration_status",
    {
      description: "Returns configured and missing Authority OS integrations. Read-only.",
      inputSchema: z.object({})
    },
    async () => ({
      content: [{ type: "text", text: JSON.stringify(integrationSnapshot(), null, 2) }]
    })
  );

  server.registerTool(
    "search_console_performance",
    {
      description:
        "Read Google Search Console performance data for the canonical website. Use for topic selection, geography, query discovery and post-publication learning.",
      inputSchema: z.object({
        startDate: z.string(),
        endDate: z.string(),
        dimensions: z.array(z.string()).optional(),
        rowLimit: z.number().int().min(1).max(25000).optional(),
        startRow: z.number().int().min(0).optional()
      })
    },
    async (input) => {
      const result = await searchConsolePerformance(input);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.registerTool(
    "ga4_report",
    {
      description: "Read GA4 traffic, geography and acquisition data for campaign performance analysis.",
      inputSchema: z.object({
        startDate: z.string(),
        endDate: z.string(),
        dimensions: z.array(z.string()).optional(),
        metrics: z.array(z.string()).optional(),
        limit: z.number().int().min(1).max(10000).optional()
      })
    },
    async (input) => {
      const result = await ga4Report(input);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.registerTool(
    "publish_main_site",
    {
      description:
        "Stage a validated authority article as a draft GitHub pull request for mharisaslam.com. Nothing becomes live until the pull request is reviewed and merged.",
      inputSchema: z.object({ article: z.any() })
    },
    async ({ article }) => {
      const result = await publishMainSiteArticle(article);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.registerTool(
    "publish_wordpress",
    {
      description:
        "Stage the derivative WordPress article. Authority OS forces draft status unless AUTHORITY_OS_LIVE_PUBLISH_ENABLED=true. Jetpack Social distribution must remain blocked during connector testing.",
      inputSchema: z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        slug: z.string().optional(),
        status: z.enum(["draft", "publish", "future"]).optional(),
        date: z.string().optional(),
        categories: z.array(z.number().int()).optional(),
        tags: z.array(z.number().int()).optional(),
        featured_media: z.number().int().optional(),
        meta: z.record(z.string(), z.any()).optional()
      })
    },
    async (input) => {
      const result = await publishWordPressPost(input);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.registerTool(
    "prepare_linkedin_review",
    {
      description:
        "Prepare a signed handoff URL that opens the existing Haris LinkedIn Publisher with the exact Authority OS draft prefilled for human review. This never publishes automatically.",
      inputSchema: z.object({
        text: z.string().min(1).max(3000),
        articleUrl: z.string().url(),
        title: z.string().max(200).optional(),
        description: z.string().max(300).optional(),
        visualUrl: z.string().url().optional(),
        visualAlt: z.string().max(300).optional(),
        visualTitle: z.string().max(200).optional(),
        label: z.string().max(120).optional()
      })
    },
    async (input) => {
      const result = createLinkedInReviewHandoff(input);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.registerTool(
    "canva_connection_check",
    {
      description:
        "Read-only Canva connection check. Returns the connected Canva profile, granted scopes and token-expiry information. Does not create or modify designs.",
      inputSchema: z.object({})
    },
    async () => {
      const result = await canvaProfile();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.registerTool(
    "submit_indexnow",
    {
      description: "Submit canonical URLs to IndexNow after a successful verified publication.",
      inputSchema: z.object({
        urls: z.array(z.string().url()).min(1).max(100)
      })
    },
    async ({ urls }) => {
      const result = await submitIndexNow(urls);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.registerTool(
    "verify_url",
    {
      description: "Verify that a URL is live and inspect its final URL, title and canonical tag.",
      inputSchema: z.object({
        url: z.string().url(),
        expectedTitle: z.string().optional()
      })
    },
    async ({ url, expectedTitle }) => {
      const result = await verifyLiveUrl(url, expectedTitle);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
});

function auth(request: Request) {
  const token = process.env.AUTHORITY_OS_MCP_TOKEN;
  if (!token) return false;
  return request.headers.get("authorization") === "Bearer " + token;
}

function unauthorized() {
  return new Response("Unauthorized", { status: 401 });
}

export async function GET(request: Request) {
  if (!auth(request)) return unauthorized();
  return handler(request);
}

export async function POST(request: Request) {
  if (!auth(request)) return unauthorized();
  return handler(request);
}

export async function DELETE(request: Request) {
  if (!auth(request)) return unauthorized();
  return handler(request);
}
