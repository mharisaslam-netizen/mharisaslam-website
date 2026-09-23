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


export async function setDraftArticleVisual(input: {
  branch: string;
  slug: string;
  visualPath: string;
}) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) throw new Error("GitHub publishing is not configured.");

  const api = "https://api.github.com/repos/" + repo;
  const endpoint = api + "/contents/" + registryPath;
  const currentResponse = await fetch(
    endpoint + "?ref=" + encodeURIComponent(input.branch),
    { headers: authHeaders(token), cache: "no-store" }
  );

  if (!currentResponse.ok) {
    throw new Error("Could not read draft article registry (" + currentResponse.status + ").");
  }

  const current = await currentResponse.json();
  const source = Buffer.from(
    String(current.content || "").replace(/\n/g, ""),
    "base64"
  ).toString("utf8");
  const match = source.match(/export const authorityArticles = ([\s\S]*);\s*$/);
  if (!match) throw new Error("Article registry format is invalid.");

  const articles = JSON.parse(match[1]) as AuthorityArticle[];
  const index = articles.findIndex((item) => item.slug === input.slug);
  if (index < 0) throw new Error("Draft article was not found in the registry.");

  articles[index] = {
    ...articles[index],
    visual: [input.visualPath]
  };

  const nextSource =
    "// Generated and maintained by Haris Authority OS.\n" +
    "// Keep this file machine-safe: JSON-compatible objects only.\n" +
    "export const authorityArticles = " +
    JSON.stringify(articles, null, 2) +
    ";\n";

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({
      message: "Attach authority visual: " + articles[index].title,
      content: Buffer.from(nextSource, "utf8").toString("base64"),
      sha: current.sha,
      branch: input.branch
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "GitHub draft article visual update failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 800)
    );
  }

  return {
    branch: input.branch,
    commitSha: data?.commit?.sha || null,
    commitUrl: data?.commit?.html_url || null,
    visualPath: input.visualPath
  };
}


export async function getDraftAssetPreview(input: {
  branch: string;
  path: string;
}) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) throw new Error("GitHub publishing is not configured.");

  const api = "https://api.github.com/repos/" + repo;
  const contentResponse = await fetch(
    api +
      "/contents/" +
      input.path.split("/").map(encodeURIComponent).join("/") +
      "?ref=" +
      encodeURIComponent(input.branch),
    { headers: authHeaders(token), cache: "no-store" }
  );

  if (!contentResponse.ok) {
    return { exists: false, branch: input.branch, path: input.path, ref: null };
  }

  const branchResponse = await fetch(
    api + "/commits/" + encodeURIComponent(input.branch),
    { headers: authHeaders(token), cache: "no-store" }
  );
  if (!branchResponse.ok) {
    throw new Error("Could not resolve draft branch head (" + branchResponse.status + ").");
  }

  const branchData = await branchResponse.json();
  return {
    exists: true,
    branch: input.branch,
    path: input.path,
    ref: branchData?.sha || null
  };
}


export async function mergeAuthorityPullRequest(input: {
  prNumber: number;
  expectedHeadSha?: string;
}) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) throw new Error("GitHub publishing is not configured.");
  if (!Number.isInteger(input.prNumber) || input.prNumber <= 0) {
    throw new Error("A valid Authority OS pull request number is required.");
  }

  const api = "https://api.github.com/repos/" + repo;
  const prResponse = await fetch(api + "/pulls/" + input.prNumber, {
    headers: authHeaders(token),
    cache: "no-store"
  });
  const pr = await prResponse.json().catch(() => ({}));
  if (!prResponse.ok) {
    throw new Error(
      "Could not read Authority OS pull request (" +
        prResponse.status +
        "): " +
        JSON.stringify(pr).slice(0, 500)
    );
  }

  if (pr.merged) {
    return {
      status: "LIVE",
      alreadyMerged: true,
      prNumber: input.prNumber,
      mergeSha: pr.merge_commit_sha || null,
      prUrl: pr.html_url || null
    };
  }

  const headSha = String(pr?.head?.sha || "");
  if (input.expectedHeadSha && headSha && input.expectedHeadSha !== headSha) {
    throw new Error(
      "Draft PR changed after approval. Expected " +
        input.expectedHeadSha +
        " but current head is " +
        headSha +
        ". Review is required again before publishing."
    );
  }

  if (pr.draft) {
    const graphResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        query:
          "mutation MarkReady($id: ID!) { markPullRequestReadyForReview(input: { pullRequestId: $id }) { pullRequest { id isDraft } } }",
        variables: { id: pr.node_id }
      })
    });
    const graph = await graphResponse.json().catch(() => ({}));
    if (!graphResponse.ok || graph?.errors?.length) {
      throw new Error(
        "Could not mark draft PR ready for release: " +
          JSON.stringify(graph).slice(0, 700)
      );
    }
  }

  const mergeResponse = await fetch(api + "/pulls/" + input.prNumber + "/merge", {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({
      merge_method: "squash",
      ...(headSha ? { sha: headSha } : {})
    })
  });
  const merged = await mergeResponse.json().catch(() => ({}));
  if (!mergeResponse.ok || !merged?.merged) {
    throw new Error(
      "GitHub merge failed (" +
        mergeResponse.status +
        "): " +
        JSON.stringify(merged).slice(0, 800)
    );
  }

  return {
    status: "LIVE",
    alreadyMerged: false,
    prNumber: input.prNumber,
    mergeSha: merged.sha || null,
    prUrl: pr.html_url || null
  };
}
