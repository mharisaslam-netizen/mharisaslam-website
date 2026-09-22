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

function safeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export async function publishMainSiteArticle(article: AuthorityArticle) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const baseBranch = process.env.GITHUB_DEFAULT_BRANCH || "main";

  if (!token || !repo) throw new Error("GitHub publishing is not configured.");
  if (!article.slug || !article.title || !article.lead || !article.sections?.length) {
    throw new Error("Article is missing required fields.");
  }

  const api = "https://api.github.com/repos/" + repo;
  const endpoint = api + "/contents/" + registryPath;
  const currentResponse = await fetch(endpoint + "?ref=" + encodeURIComponent(baseBranch), {
    headers: authHeaders(token),
    cache: "no-store"
  });

  if (!currentResponse.ok) {
    throw new Error(
      "Could not read main-site article registry (" + currentResponse.status + ")."
    );
  }

  const current = await currentResponse.json();
  const source = Buffer.from(
    String(current.content || "").replace(/\n/g, ""),
    "base64"
  ).toString("utf8");
  const match = source.match(/export const authorityArticles = ([\s\S]*);\s*$/);

  if (!match) throw new Error("Article registry format is invalid.");

  const articles = JSON.parse(match[1]) as AuthorityArticle[];
  const existingIndex = articles.findIndex((item) => item.slug === article.slug);

  if (existingIndex >= 0) articles[existingIndex] = article;
  else articles.unshift(article);

  const nextSource =
    "// Generated and maintained by Haris Authority OS.\n" +
    "// Keep this file machine-safe: JSON-compatible objects only.\n" +
    "export const authorityArticles = " +
    JSON.stringify(articles, null, 2) +
    ";\n";

  const baseCommitResponse = await fetch(
    api + "/commits/" + encodeURIComponent(baseBranch),
    {
      headers: authHeaders(token),
      cache: "no-store"
    }
  );

  if (!baseCommitResponse.ok) {
    throw new Error(
      "Could not resolve GitHub base branch (" + baseCommitResponse.status + ")."
    );
  }

  const baseCommit = await baseCommitResponse.json();
  const draftBranch =
    "authority-os/" +
    safeSlug(article.slug) +
    "-" +
    Date.now().toString(36);

  const branchResponse = await fetch(api + "/git/refs", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      ref: "refs/heads/" + draftBranch,
      sha: baseCommit.sha
    })
  });

  const branchResult = await branchResponse.json().catch(() => ({}));
  if (!branchResponse.ok) {
    throw new Error(
      "Could not create Authority OS draft branch (" +
        branchResponse.status +
        "): " +
        JSON.stringify(branchResult).slice(0, 800)
    );
  }

  const updateResponse = await fetch(endpoint, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({
      message:
        (existingIndex >= 0 ? "Update" : "Stage") +
        " authority article: " +
        article.title,
      content: Buffer.from(nextSource, "utf8").toString("base64"),
      sha: current.sha,
      branch: draftBranch
    })
  });

  const updated = await updateResponse.json().catch(() => ({}));
  if (!updateResponse.ok) {
    throw new Error(
      "GitHub article staging failed (" +
        updateResponse.status +
        "): " +
        JSON.stringify(updated).slice(0, 800)
    );
  }

  const prResponse = await fetch(api + "/pulls", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      title:
        (existingIndex >= 0 ? "Update" : "Draft") +
        " authority article: " +
        article.title,
      head: draftBranch,
      base: baseBranch,
      draft: true,
      body:
        "Created by Haris Authority OS.\n\n" +
        "Expected canonical URL after approval and merge:\n" +
        "https://www.mharisaslam.com/insights/" +
        article.slug +
        "\n\n" +
        "This pull request is intentionally created as a draft. Nothing is published until it is reviewed and merged."
    })
  });

  const prResult = await prResponse.json().catch(() => ({}));

  return {
    mode: "draft_pr",
    slug: article.slug,
    draftBranch,
    commitSha: updated?.commit?.sha || null,
    commitUrl: updated?.commit?.html_url || null,
    prCreated: prResponse.ok,
    prUrl: prResponse.ok ? prResult?.html_url || null : null,
    prNumber: prResponse.ok ? prResult?.number || null : null,
    prError: prResponse.ok
      ? null
      : "PR creation failed (" +
        prResponse.status +
        "): " +
        JSON.stringify(prResult).slice(0, 800),
    expectedUrl: "https://www.mharisaslam.com/insights/" + article.slug,
    published: false
  };
}


export async function uploadDraftAsset(input: {
  branch: string;
  path: string;
  base64: string;
  message: string;
}) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token || !repo) throw new Error("GitHub publishing is not configured.");
  if (!input.branch || !input.path || !input.base64) {
    throw new Error("Draft asset upload is missing required fields.");
  }
  if (!input.path.startsWith("public/assets/authority-os/")) {
    throw new Error("Authority OS assets must stay under public/assets/authority-os/.");
  }

  const api = "https://api.github.com/repos/" + repo;
  const endpoint = api + "/contents/" + input.path;

  let existingSha: string | undefined;
  const existing = await fetch(endpoint + "?ref=" + encodeURIComponent(input.branch), {
    headers: authHeaders(token),
    cache: "no-store"
  });
  if (existing.ok) {
    const data = await existing.json();
    existingSha = data?.sha;
  }

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({
      message: input.message,
      content: input.base64,
      branch: input.branch,
      ...(existingSha ? { sha: existingSha } : {})
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "GitHub asset staging failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 800)
    );
  }

  return {
    path: input.path,
    branch: input.branch,
    commitSha: data?.commit?.sha || null,
    commitUrl: data?.commit?.html_url || null
  };
}
