import { z } from "zod";
import { createMcpHandler } from "mcp-handler";
import { integrationSnapshot } from "../../../lib/integrations";
import { publishMainSiteArticle } from "../../../lib/connectors/github";
import { publishWordPressPost } from "../../../lib/connectors/wordpress";
import { submitIndexNow } from "../../../lib/connectors/indexnow";
import { verifyLiveUrl } from "../../../lib/connectors/verify";

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "integration_status",
      "Returns configured and missing Authority OS integrations. Read-only.",
      {},
      async () => ({
        content: [{ type: "text", text: JSON.stringify(integrationSnapshot(), null, 2) }]
      })
    );

    server.tool(
      "publish_main_site",
      "Publish or update a validated authority article in the canonical mharisaslam.com insight registry. Use only after strategy, evidence and final copy are complete.",
      { article: z.any() },
      async ({ article }) => {
        const result = await publishMainSiteArticle(article);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    server.tool(
      "publish_wordpress",
      "Publish the derivative WordPress article. Jetpack Social may distribute it to the connected social channels when enabled.",
      {
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
      },
      async (input) => {
        const result = await publishWordPressPost(input);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    server.tool(
      "submit_indexnow",
      "Submit canonical URLs to IndexNow after a successful verified publication.",
      { urls: z.array(z.string().url()).min(1).max(100) },
      async ({ urls }) => {
        const result = await submitIndexNow(urls);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    server.tool(
      "verify_url",
      "Verify that a URL is live and inspect its final URL, title and canonical tag.",
      {
        url: z.string().url(),
        expectedTitle: z.string().optional()
      },
      async ({ url, expectedTitle }) => {
        const result = await verifyLiveUrl(url, expectedTitle);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
  },
  {},
  { basePath: "/api" }
);

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
