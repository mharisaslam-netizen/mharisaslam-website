import { sleep } from "workflow";
import { inspectSearchConsoleUrl } from "../lib/connectors/google";

async function inspectStep(url: string, label: string) {
  "use step";

  try {
    const result = await inspectSearchConsoleUrl(url);
    return {
      checkedAt: new Date().toISOString(),
      label,
      status: result.verdict === "PASS" ? "INDEXED" : "PENDING",
      ...result
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

export async function monitorAuthorityIndexing(url: string) {
  "use workflow";

  const checks: any[] = [];

  await sleep("1 hour");
  checks.push(await inspectStep(url, "1h"));
  if (checks.at(-1)?.status === "INDEXED") {
    return { status: "INDEXED", url, checks };
  }

  await sleep("5 hours");
  checks.push(await inspectStep(url, "6h"));
  if (checks.at(-1)?.status === "INDEXED") {
    return { status: "INDEXED", url, checks };
  }

  await sleep("18 hours");
  checks.push(await inspectStep(url, "24h"));
  if (checks.at(-1)?.status === "INDEXED") {
    return { status: "INDEXED", url, checks };
  }

  await sleep("48 hours");
  checks.push(await inspectStep(url, "72h"));

  return {
    status:
      checks.at(-1)?.status === "INDEXED"
        ? "INDEXED"
        : "MONITORING_COMPLETE",
    url,
    checks,
    note:
      "Google indexing is ultimately controlled by Google. Authority OS submits the sitemap, uses IndexNow for participating engines, and monitors Search Console index status."
  };
}
