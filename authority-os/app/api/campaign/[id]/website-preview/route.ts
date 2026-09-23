import { getRun } from "workflow/api";
import { getDraftAssetPreview } from "../../../../../lib/connectors/github";

export const runtime = "nodejs";

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const run = await getRun(id);
    const result: any = await run.returnValue;
    const artifacts = result?.artifacts || {};
    const article = artifacts.article || {};
    const staged = artifacts.staged || {};

    if (!article?.title || !article?.slug) {
      return new Response("Campaign article preview is unavailable.", { status: 404 });
    }

    let visualUrl = String(staged?.visual?.absolutePreviewUrl || "");
    if (!visualUrl) {
      const draftBranch = String(staged?.github?.draftBranch || "");
      if (draftBranch) {
        const assetPath = "public/assets/authority-os/" + article.slug + "-hero.jpg";
        const resolved = await getDraftAssetPreview({ branch: draftBranch, path: assetPath });
        if (resolved.exists && resolved.ref) {
          const base = String(process.env.AUTHORITY_OS_BASE_URL || "").replace(/\/$/, "");
          visualUrl =
            base +
            "/api/preview/asset?ref=" +
            encodeURIComponent(String(resolved.ref)) +
            "&path=" +
            encodeURIComponent(assetPath);
        }
      }
    }

    const sections = Array.isArray(article.sections)
      ? article.sections
          .map(
            (section: any) =>
              '<section><h2>' +
              esc(section.heading) +
              "</h2>" +
              (Array.isArray(section.paragraphs)
                ? section.paragraphs.map((p: string) => "<p>" + esc(p) + "</p>").join("")
                : "") +
              (Array.isArray(section.bullets) && section.bullets.length
                ? "<ul>" +
                  section.bullets.map((b: string) => "<li>" + esc(b) + "</li>").join("") +
                  "</ul>"
                : "") +
              "</section>"
          )
          .join("")
      : "";

    const faqs = Array.isArray(article.faq)
      ? '<section><h2>FAQ</h2>' +
        article.faq
          .map(
            (item: any) =>
              '<div class="faq"><h3>' +
              esc(item.question) +
              "</h3><p>" +
              esc(item.answer) +
              "</p></div>"
          )
          .join("") +
        "</section>"
      : "";

    const sources = Array.isArray(article.sources)
      ? '<section><h2>Sources</h2><ul>' +
        article.sources
          .map(
            (source: any) =>
              '<li><a href="' +
              esc(source.url) +
              '" target="_blank" rel="noreferrer">' +
              esc(source.title) +
              "</a> — " +
              esc(source.publisher) +
              "</li>"
          )
          .join("") +
        "</ul></section>"
      : "";

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>${esc(article.title)} — Authority OS Preview</title>
<style>
:root{--bg:#f4f0e7;--ink:#102832;--muted:#61737a;--gold:#a87d2b;--line:#d8d0c3;--navy:#0b2530}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Arial,Helvetica,sans-serif}
header{background:var(--navy);color:#fff;padding:18px 24px;position:sticky;top:0;z-index:3}
header .inner{max-width:1040px;margin:auto;display:flex;justify-content:space-between;gap:20px;align-items:center}
header strong{font-size:14px}header span{font-size:12px;color:#b7c8ce}
main{max-width:1040px;margin:52px auto 90px;padding:0 24px}
.eyebrow{text-transform:uppercase;letter-spacing:.14em;color:var(--gold);font-size:12px;font-weight:800}
h1{font-size:clamp(38px,6vw,68px);line-height:1.02;letter-spacing:-.04em;margin:10px 0 18px;max-width:950px}
.lead{font-size:21px;line-height:1.55;color:#415960;max-width:900px}
.hero{width:100%;aspect-ratio:16/9;object-fit:cover;margin:34px 0;border:1px solid var(--line);background:#e4ded3}
.notice{border:1px solid #cdbb90;background:#fff9e9;padding:13px 15px;margin:22px 0;color:#6a5521;font-size:13px}
article{max-width:780px;margin:0 auto}
section{margin:44px 0}h2{font-size:30px;line-height:1.15;margin:0 0 16px}h3{font-size:18px}
p,li{font-size:17px;line-height:1.72}ul{padding-left:24px}.faq{border-top:1px solid var(--line);padding:16px 0}
a{color:#0b6d74}.meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.pill{border:1px solid var(--line);padding:6px 9px;border-radius:999px;font-size:12px;color:var(--muted)}
</style>
</head>
<body>
<header><div class="inner"><strong>Haris Authority OS — Website Preview</strong><span>REVIEW MODE · NOT LIVE</span></div></header>
<main>
<div class="eyebrow">${esc(article.category || "Insight")}</div>
<h1>${esc(article.title)}</h1>
<p class="lead">${esc(article.lead)}</p>
<div class="meta"><span class="pill">${esc(article.readMinutes || "")} min read</span><span class="pill">Draft canonical: /insights/${esc(article.slug)}</span></div>
<div class="notice">This is a private review rendering of the staged article. It is not indexed and is not the public website.</div>
${visualUrl ? '<img class="hero" src="' + esc(visualUrl) + '" alt="' + esc(article.title) + '">' : '<div class="hero"></div>'}
<article>
${sections}
${faqs}
${sources}
</article>
</main>
</body></html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not render website preview.";
    return new Response(message, { status: 500 });
  }
}
