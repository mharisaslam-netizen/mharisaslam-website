import { readFile } from "node:fs/promises";
import { GET as getArticleStudio } from "../api/linkedin/article-studio.js";
import { SESSION_COOKIE, encryptSession } from "../lib/linkedin-session.js";

const secret = "linkedin-build-test-secret";
process.env.LINKEDIN_SESSION_SECRET = secret;

const session = {
  accessToken: "test-token",
  expiresAt: Date.now() + 60 * 60 * 1000,
  memberSub: "test-member",
  name: "Build Test"
};

const cookie = encryptSession(session, secret);
const request = new Request("https://www.mharisaslam.com/api/linkedin/article-studio", {
  headers: { cookie: `${SESSION_COOKIE}=${encodeURIComponent(cookie)}` }
});

const response = getArticleStudio(request);
if (response.status !== 200) {
  throw new Error(`Article Studio runtime check returned HTTP ${response.status}`);
}

const html = await response.text();
for (const required of [
  "Haris LinkedIn Article Studio",
  "Fintech &amp; Agentic Commerce: When AI Agents Start Moving Money",
  "Marketplace Economics in the GCC"
]) {
  if (!html.includes(required)) {
    throw new Error(`Article Studio runtime check is missing: ${required}`);
  }
}

console.log("LinkedIn Article Studio runtime check passed.");

const websiteArticle = await readFile(new URL("../dist/insights/fintech-agentic-commerce-ai-agents-moving-money/index.html", import.meta.url), "utf8");
for (const required of [
  "Fintech &amp; Agentic Commerce: When AI Agents Start Moving Money",
  "The agentic payment stack needs five capabilities",
  "The first 90 days should be an evidence programme",
  "Sources and further reading"
]) {
  if (!websiteArticle.includes(required)) throw new Error(`Deep website article is missing: ${required}`);
}
console.log("Deep Fintech Agentic Commerce website article check passed.");
