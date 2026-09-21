export type AuthorityArticle = {
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  lead: string;
  category?: string;
  readMinutes?: number;
  datePublished?: string;
  visual?: string[];
  operatingLens?: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  takeaways?: string[];
  faq?: Array<{ question: string; answer: string }>;
  sources?: Array<{ title: string; publisher?: string; url: string }>;
};

const registryPath = "lib/authority-articles.js";

function authHeaders(token: string) {
  return {
    Authorization: "Bearer " + token,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json"
  };
}

export async function publishMainSiteArticle(article: AuthorityArticle) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_DEFAULT_BRANCH || "main";

  if (!token || !repo) throw new Error("GitHub publishing is not configured.");
  if (!article.slug || !article.title || !article.lead || !article.sections?.length) {
    throw new Error("Article is missing required fields.");
  }

  const endpoint = "https://api.github.com/repos/" + repo + "/contents/" + registryPath;
  const currentResponse = await fetch(endpoint + "?ref=" + encodeURIComponent(branch), {
    headers: authHeaders(token),
    cache: "no-store"
  });

  if (!currentResponse.ok) {
    throw new Error("Could not read main-site article registry (" + currentResponse.status + ").");
  }

  const current = await currentResponse.json();
  const source = Buffer.from(String(current.content || "").replace(/\n/g, ""), "base64").toString("utf8");
  const match = source.match(/export const authorityArticles = ([\s\S]*);\s*$/);

  if (!match) throw new Error("Article registry format is invalid.");

  const articles = JSON.parse(match[1]) as AuthorityArticle[];
  const existingIndex = articles.findIndex((item) => item.slug === article.slug);

  if (existingIndex >= 0) articles[existingIndex] = article;
  else articles.unshift(article);

  const nextSource =
    "// Generated and maintained by Haris Authority OS.\n" +
    "// Keep this file machine-safe: JSON-compatible objects only.\n" +
    "export const authorityArticles = " + JSON.stringify(articles, null, 2) + ";\n";

  const updateResponse = await fetch(endpoint, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({
      message: (existingIndex >= 0 ? "Update" : "Publish") + " authority article: " + article.title,
      content: Buffer.from(nextSource, "utf8").toString("base64"),
      sha: current.sha,
      branch
    })
  });

  const updated = await updateResponse.json().catch(() => ({}));
  if (!updateResponse.ok) {
    throw new Error("GitHub article publish failed (" + updateResponse.status + "): " + JSON.stringify(updated).slice(0, 800));
  }

  return {
    slug: article.slug,
    commitSha: updated?.commit?.sha || null,
    commitUrl: updated?.commit?.html_url || null,
    expectedUrl: "https://www.mharisaslam.com/insights/" + article.slug
  };
}
