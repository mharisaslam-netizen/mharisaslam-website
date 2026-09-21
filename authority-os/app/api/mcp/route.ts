import { z } from "zod";
import { createMcpHandler } from "mcp-handler";
import { integrationSnapshot } from "../../../lib/integrations";
import { publishMainSiteArticle } from "../../../lib/connectors/github";
import { publishWordPressPost } from "../../../lib/connectors/wordpress";
import { submitIndexNow } from "../../../lib/connectors/indexnow";
import { verifyLiveUrl } from "../../../lib/connectors/verify";
import { ga4Report, searchConsolePerformance } from "../../../lib/connectors/google";

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
        "Publish or update a validated authority article in the canonical mharisaslam.com insight registry. Use only after strategy, evidence and final copy are complete.",
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
        "Publish the derivative WordPress article. Jetpack Social may distribute it to the connected social channels when enabled.",
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
