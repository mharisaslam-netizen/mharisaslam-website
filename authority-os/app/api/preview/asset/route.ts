
export const runtime = "nodejs";

function githubHeaders(token: string) {
  return {
    Authorization: "Bearer " + token,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

export async function GET(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return new Response("GitHub preview is not configured.", { status: 503 });

  const url = new URL(request.url);
  const ref = String(url.searchParams.get("ref") || "");
  const path = String(url.searchParams.get("path") || "");

  if (!/^[a-f0-9]{40}$/i.test(ref)) {
    return new Response("Invalid asset ref.", { status: 400 });
  }
  if (!path.startsWith("public/assets/authority-os/")) {
    return new Response("Invalid asset path.", { status: 400 });
  }

  const endpoint =
    "https://api.github.com/repos/" +
    repo +
    "/contents/" +
    path.split("/").map(encodeURIComponent).join("/") +
    "?ref=" +
    encodeURIComponent(ref);

  const response = await fetch(endpoint, {
    headers: githubHeaders(token),
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.content) {
    return new Response("Preview asset is unavailable.", { status: response.status || 404 });
  }

  const bytes = Buffer.from(String(data.content).replace(/\n/g, ""), "base64");
  const lower = path.toLowerCase();
  const contentType = lower.endsWith(".png")
    ? "image/png"
    : lower.endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";

  return new Response(bytes, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow"
    }
  });
}
