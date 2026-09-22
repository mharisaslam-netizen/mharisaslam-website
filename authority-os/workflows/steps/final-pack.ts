
import type {
  CampaignInput,
  Decision,
  AnalyticsSnapshot,
  SpecialistOutput,
  AuthorityArticle,
  ChannelPackage,
  VisualBrief,
  VerificationResult,
  StageResult
} from "../types";

function articleMarkdown(article: AuthorityArticle) {
  const sections = article.sections
    .map((section) => {
      const paragraphs = section.paragraphs.map((p) => p + "\n").join("\n");
      const bullets = section.bullets.length
        ? "\n" + section.bullets.map((b) => "- " + b).join("\n") + "\n"
        : "";
      return "### " + section.heading + "\n\n" + paragraphs + bullets;
    })
    .join("\n");

  const faq = article.faq
    .map((item) => "**" + item.question + "**\n\n" + item.answer)
    .join("\n\n");

  const sources = article.sources
    .map((source) => "- [" + source.title + "](" + source.url + ") — " + source.publisher)
    .join("\n");

  return [
    "# " + article.title,
    article.lead,
    sections,
    "### Key takeaways\n\n" + article.takeaways.map((x) => "- " + x).join("\n"),
    "### FAQ\n\n" + faq,
    "### Sources\n\n" + sources
  ].join("\n\n");
}

export async function finalPackStep(
  input: CampaignInput,
  decision: Decision,
  analytics: AnalyticsSnapshot,
  specialists: SpecialistOutput[],
  article: AuthorityArticle,
  channels: ChannelPackage,
  visual: VisualBrief,
  verification: VerificationResult,
  staged: StageResult
) {
  "use step";

  const evidence = decision.evidenceToUse
    .map((item) => "- " + item.claim + " — [" + item.source + "](" + item.url + ")")
    .join("\n");

  const statusRows = [
    ["Main website / GitHub", String(staged.github.status || "NOT EXECUTED")],
    ["WordPress", String(staged.wordpress.status || "NOT EXECUTED")],
    ["LinkedIn", String(staged.linkedin.status || "NOT EXECUTED")],
    ["Campaign visual", String(staged.visual.status || "NOT EXECUTED")],
    ["X", "READY FOR REVIEW"],
    ["Medium", "READY FOR REVIEW"],
    ["Substack", "READY FOR REVIEW"],
    ["IndexNow", "NOT EXECUTED"],
    ["Jetpack Social", "NOT EXECUTED"]
  ];

  const matrix = statusRows.map(([a,b]) => "- **" + a + ":** " + b).join("\n");
  const githubDetails = JSON.stringify(staged.github, null, 2);
  const wordpressDetails = JSON.stringify(staged.wordpress, null, 2);
  const linkedinDetails = JSON.stringify(staged.linkedin, null, 2);
  const visualDetails = JSON.stringify(staged.visual, null, 2);

  const finalAnswer = [
    "## CEO Recommendation",
    "**Recommended topic:** " + decision.topic,
    "",
    "**Thesis:** " + decision.thesis,
    "",
    "**Why this topic won**",
    decision.differentiators.map((x) => "- " + x).join("\n"),
    "",
    "## Why it matters now",
    decision.whyNow.map((x) => "- " + x).join("\n"),
    "",
    "## Search & analytics evidence",
    "Period: " + analytics.period.startDate + " to " + analytics.period.endDate,
    "",
    "The Search & Analytics Agent was instructed to treat sparse evidence conservatively. Connector notes: " +
      (analytics.notes.length ? analytics.notes.join(" | ") : "none"),
    "",
    "## External evidence",
    evidence || "- No external evidence was accepted by the CEO Agent.",
    "",
    "## Flagship article",
    articleMarkdown(article),
    "",
    "## SEO / AEO / GEO package",
    "- **SEO title:** " + article.seoTitle,
    "- **Meta description:** " + article.metaDescription,
    "- **Slug:** " + article.slug,
    "- **FAQ targets:** " + article.faq.map((x) => x.question).join(" | "),
    "- **Operating lens:** " + article.operatingLens,
    "",
    "## Visual concept",
    "- **Concept:** " + visual.conceptName,
    "- **Objective:** " + visual.objective,
    "- **Format:** " + visual.format,
    "- **Composition:** " + visual.composition,
    "- **Text overlay:** " + visual.textOverlay,
    "- **Image prompt:** " + visual.imagePrompt,
    "- **Alt text:** " + visual.altText,
    "",
    "**Generated visual staging:**",
    visualDetails,
    "",
    "## LinkedIn",
    channels.linkedinPost,
    "",
    "Review handoff JSON:",
    linkedinDetails,
    "",
    "## X",
    channels.xPost,
    "",
    channels.xThread.length
      ? "**Optional thread**\n\n" + channels.xThread.map((x, i) => (i + 1) + ". " + x).join("\n\n")
      : "**Optional thread:** not recommended",
    "",
    "## WordPress draft",
    wordpressDetails,
    "",
    "## Medium package",
    "**Title:** " + channels.mediumTitle,
    "",
    "**Subtitle:** " + channels.mediumSubtitle,
    "",
    channels.mediumBody,
    "",
    "Canonical source after main-site approval: https://www.mharisaslam.com/insights/" + article.slug,
    "",
    "## Substack package",
    "**Subject:** " + channels.substackSubject,
    "",
    "**Subtitle:** " + channels.substackSubtitle,
    "",
    channels.substackOpeningNote,
    "",
    channels.substackBody,
    "",
    "**CTA:** " + channels.substackCTA,
    "",
    "## GitHub draft PR",
    githubDetails,
    "",
    "## Commercial conversion path",
    decision.commercialObjective,
    "",
    "Primary audience: " + decision.primaryAudience,
    "",
    "## Verification",
    verification.safeToStage ? "**Verification result:** safe to stage." : "**Verification result:** BLOCKED.",
    "",
    verification.blockingIssues.length
      ? "**Blocking issues**\n" + verification.blockingIssues.map((x) => "- " + x).join("\n")
      : "**Blocking issues:** none.",
    "",
    verification.cautions.length
      ? "**Cautions**\n" + verification.cautions.map((x) => "- " + x).join("\n")
      : "**Cautions:** none.",
    "",
    "## Channel status",
    matrix,
    "",
    "**REVIEW MODE:** Nothing has been merged, published to WordPress, posted to LinkedIn or X, sent through Substack, published on Medium, distributed by Jetpack, or submitted to IndexNow."
  ].join("\n");

  return {
    status: "completed",
    finalAnswer,
    activity: [
      "Wave 1 complete: independent Research, Search & Analytics, Challenge and Strategy agents finished.",
      "CEO synthesis complete: one topic selected.",
      "Wave 2 complete: flagship article, channel package and visual brief created.",
      verification.safeToStage
        ? "Verification passed for draft staging."
        : "Verification blocked staging due to material issues.",
      "Wave 3 complete: safe connectors attempted independently; connector failures did not stop the campaign."
    ],
    toolCallCount: specialists.length + 6,
    artifacts: { article, channels, visual, verification, staged, input }
  };
}
