export async function verifyLiveUrl(url: string, expectedTitle?: string) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
    headers: { "User-Agent": "HarisAuthorityOS/1.0" }
  });

  const html = await response.text();
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);

  const title = titleMatch?.[1]?.trim() || "";
  const canonical = canonicalMatch?.[1] || "";

  return {
    ok: response.ok && (!expectedTitle || title.toLowerCase().includes(expectedTitle.toLowerCase())),
    status: response.status,
    finalUrl: response.url,
    title,
    canonical
  };
}
