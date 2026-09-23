type IndexCheck = {
  checkedAt: string;
  label: string;
  status: string;
  verdict?: string | null;
  coverageState?: string | null;
  indexingState?: string | null;
  lastCrawlTime?: string | null;
  googleCanonical?: string | null;
  userCanonical?: string | null;
  error?: string;
};

async function inspectPublishedUrlStep(url: string, label: string): Promise<IndexCheck> {
  "use step";

  try {
    const { inspectSearchConsoleUrl } = await import("../lib/connectors/google");
    const result = await inspectSearchConsoleUrl(url);
    return {
      checkedAt: new Date().toISOString(),
      label,
      status: result.verdict === "PASS" ? "INDEXED" : "PENDING",
      verdict: result.verdict,
      coverageState: result.coverageState,
      indexingState: result.indexingState,
      lastCrawlTime: result.lastCrawlTime,
      googleCanonical: result.googleCanonical,
      userCanonical: result.userCanonical
    };
  } catch (error) {
    return {
      checkedAt: new Date().toISOString(),
      label,
      status: "ERROR",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function monitorPublishedUrlIndexing(url: string) {
  "use workflow";

  const { sleep } = await import("workflow");
  const checks: IndexCheck[] = [];

  await sleep("1 hour");
  checks.push(await inspectPublishedUrlStep(url, "1h"));
  if (checks[checks.length - 1]?.status === "INDEXED") {
    return { status: "INDEXED", url, checks };
  }

  await sleep("5 hours");
  checks.push(await inspectPublishedUrlStep(url, "6h"));
  if (checks[checks.length - 1]?.status === "INDEXED") {
    return { status: "INDEXED", url, checks };
  }

  await sleep("18 hours");
  checks.push(await inspectPublishedUrlStep(url, "24h"));
  if (checks[checks.length - 1]?.status === "INDEXED") {
    return { status: "INDEXED", url, checks };
  }

  await sleep("48 hours");
  checks.push(await inspectPublishedUrlStep(url, "72h"));

  return {
    status:
      checks[checks.length - 1]?.status === "INDEXED"
        ? "INDEXED"
        : "MONITORING_COMPLETE",
    url,
    checks,
    note:
      "Google controls crawl and indexing timing. Authority OS has already submitted discovery signals and is monitoring Search Console status."
  };
}
