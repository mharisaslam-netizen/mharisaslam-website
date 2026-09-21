export async function submitIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) throw new Error("INDEXNOW_KEY is not configured.");
  if (!urls.length) return { submitted: 0 };

  const valid = urls.map((value) => new URL(value));
  const host = valid[0].hostname;
  if (!valid.every((url) => url.hostname === host)) {
    throw new Error("IndexNow batch must use a single host.");
  }

  const body = {
    host,
    key,
    keyLocation: "https://" + host + "/" + key + ".txt",
    urlList: valid.map((url) => url.toString())
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body)
  });

  if (!response.ok && response.status !== 202) {
    const detail = await response.text();
    throw new Error("IndexNow failed (" + response.status + "): " + detail.slice(0, 500));
  }

  return { submitted: urls.length, status: response.status };
}
