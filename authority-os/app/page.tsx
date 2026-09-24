"use client";

import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";

type Integration = {
  id: string;
  name: string;
  role: string;
  configured: boolean;
  status: string;
};

type Activity = {
  id: string;
  phase: string | null;
  text: string;
};

type CampaignArtifacts = {
  article?: Record<string, any>;
  channels?: Record<string, any>;
  visual?: Record<string, any>;
  verification?: Record<string, any>;
  staged?: {
    github?: Record<string, any>;
    wordpress?: Record<string, any>;
    linkedin?: Record<string, any>;
    visual?: Record<string, any>;
  };
};

type CampaignState = {
  status: string;
  raw_status?: string;
  terminal?: boolean;
  stale?: boolean;
  stale_seconds?: number;
  requires_action?: boolean;
  required_actions?: unknown[];
  error?: string | null;
  final_answer?: string | null;
  activity?: Activity[];
  tool_call_count?: number;
  artifacts?: CampaignArtifacts | null;
};

type ReleaseSelections = {
  website: boolean;
  wordpressJetpack: boolean;
  x: boolean;
  indexing: boolean;
};

type ReleaseResult = {
  status?: string;
  completedAt?: string;
  canonicalUrl?: string;
  website?: Record<string, any>;
  websiteVerification?: Record<string, any>;
  wordpressJetpack?: Record<string, any>;
  x?: Record<string, any>;
  indexing?: Record<string, any>;
  manualGates?: Record<string, string>;
  error?: string;
};

type ReportSection = {
  title: string;
  body: string;
};

function parseReport(text: string): ReportSection[] {
  const lines = text.split("\n");
  const sections: ReportSection[] = [];
  let title = "CEO Recommendation";
  let body: string[] = [];

  const push = () => {
    const content = body.join("\n").trim();
    if (content) sections.push({ title, body: content });
    body = [];
  };

  for (const line of lines) {
    const match = line.match(/^#{2,3}\s+(.+)$/);
    if (match) {
      push();
      title = match[1].trim();
    } else {
      body.push(line);
    }
  }
  push();
  return sections;
}

function renderInline(text: string): ReactNode[] {
  const tokenPattern = /(\*\*[^*]+\*\*|\`[^\`]+\`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;
  const parts = text.split(tokenPattern).filter(Boolean);

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) {
      return (
        <a key={index} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}


function PreviewStudio({
  artifacts,
  sessionId,
  onGenerateVisual,
  onOpenLinkedIn
}: {
  artifacts?: CampaignArtifacts | null;
  sessionId: string | null;
  onGenerateVisual: () => Promise<void>;
  onOpenLinkedIn: () => Promise<void>;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  if (!artifacts) return null;

  const article = artifacts.article || {};
  const channels = artifacts.channels || {};
  const visual = artifacts.visual || {};
  const staged = artifacts.staged || {};
  const visualStage = staged.visual || {};
  const wordpressStage = staged.wordpress || {};
  const githubStage = staged.github || {};

  const visualSrc = typeof visualStage.previewUrl === "string" ? visualStage.previewUrl : "";
  const wordpressUrl = typeof wordpressStage.link === "string" ? wordpressStage.link : "";
  const wordpressPostId = Number(wordpressStage.id || 0);
  const wordpressEditorUrl = wordpressPostId
    ? "https://wordpress.com/post/harisgccgrowth.wordpress.com/" + wordpressPostId
    : "";
  const githubUrl = typeof githubStage.prUrl === "string" ? githubStage.prUrl : "";
  const canonicalUrl = article.slug
    ? "https://www.mharisaslam.com/insights/" + String(article.slug)
    : "https://www.mharisaslam.com";

  const ensureCanonical = (value: string, label?: string) =>
    value.includes(canonicalUrl)
      ? value
      : value.trim() + "\n\n" + (label ? label + "\n" : "") + canonicalUrl;

  const linkedinPost = ensureCanonical(
    String(channels.linkedinPost || ""),
    "Read the full framework:"
  );
  const xPost = ensureCanonical(String(channels.xPost || ""));
  const mediumTitle = String(channels.mediumTitle || "");
  const mediumSubtitle = String(channels.mediumSubtitle || "");
  const mediumBody = ensureCanonical(
    String(channels.mediumBody || ""),
    "Originally published on mharisaslam.com:"
  );
  const substackSubject = String(channels.substackSubject || "");
  const substackSubtitle = String(channels.substackSubtitle || "");
  const substackOpening = String(channels.substackOpeningNote || "");
  const substackBody = ensureCanonical(
    String(channels.substackBody || ""),
    "Read the full framework on mharisaslam.com:"
  );
  const wordpressTitle = String(channels.wordpressTitle || article.title || "");
  const wordpressExcerpt = String(channels.wordpressExcerpt || article.metaDescription || "");

  const mediumProfile = "https://medium.com/new-story";
  const substackDashboard = "https://mharisaslam.substack.com/publish/post";
  const websitePreview = sessionId
    ? "/api/campaign/" + encodeURIComponent(sessionId) + "/website-preview"
    : "";

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <section className="preview-studio">
      <div className="preview-studio-head">
        <div>
          <div className="eyebrow">Campaign preview studio</div>
          <h3>See the campaign before anything goes live</h3>
          <p>These are review previews only. The same canonical URL and visual should flow through the campaign once approved.</p>
        </div>
        <div className="preview-status">REVIEW MODE</div>
      </div>

      <div className="preview-grid">
        <article className="preview-card preview-hero">
          <div className="preview-label">FLAGSHIP VISUAL</div>
          {visualSrc ? (
            <img className="preview-image" src={visualSrc} alt={String(visual.altText || "Campaign visual preview")} />
          ) : (
            <div className="visual-placeholder">
              <strong>{String(visual.conceptName || "Visual concept")}</strong>
              <span>{String(visual.composition || "This completed run contains a creative brief only.")}</span>
              {sessionId ? (
                <button className="preview-action visual-generate" onClick={onGenerateVisual}>
                  Generate visual & attach to drafts
                </button>
              ) : null}
            </div>
          )}
          <div className="preview-copy">
            <strong>{String(article.title || "")}</strong>
            <span>{String(article.lead || "")}</span>
          </div>
        </article>

        <article className="preview-card platform-card linkedin-card">
          <div className="platform-head">
            <div className="avatar">HA</div>
            <div><strong>Muhammad Haris Aslam</strong><span>LinkedIn preview</span></div>
          </div>
          <div className="platform-body">{linkedinPost}</div>
          {visualSrc ? <img className="platform-image" src={visualSrc} alt="" /> : null}
          <div className="platform-actions"><span>Like</span><span>Comment</span><span>Repost</span><span>Send</span></div>
          <div className="preview-button-row">
            <button className="preview-action" onClick={onOpenLinkedIn}>Open fresh LinkedIn Review</button>
            <button className="preview-action secondary-link" onClick={() => copy("linkedin", linkedinPost)}>
              {copied === "linkedin" ? "Copied" : "Copy LinkedIn post"}
            </button>
          </div>
        </article>

        <article className="preview-card platform-card x-card">
          <div className="platform-head">
            <div className="avatar">HA</div>
            <div><strong>Haris Aslam</strong><span>@mharis_aslam · X preview</span></div>
          </div>
          <div className="platform-body">{xPost}</div>
          {visualSrc ? <img className="platform-image" src={visualSrc} alt="" /> : null}
          {Array.isArray(channels.xThread) && channels.xThread.length ? (
            <div className="thread-note">{channels.xThread.length} post thread prepared</div>
          ) : null}
          <div className="canonical-line"><span>Website:</span><a href={canonicalUrl} target="_blank" rel="noreferrer">{canonicalUrl}</a></div>
          <button className="preview-action secondary-link" onClick={() => copy("x", xPost)}>
            {copied === "x" ? "Copied" : "Copy X post"}
          </button>
        </article>

        <article className="preview-card publication-card">
          <div className="publication-brand">mharisaslam.com</div>
          {visualSrc ? <img className="publication-image" src={visualSrc} alt="" /> : null}
          <h4>{String(article.title || "")}</h4>
          <p>{String(article.lead || "")}</p>
          <div className="canonical-line"><span>Proposed canonical:</span><span>{canonicalUrl}</span></div>
          <div className="preview-button-row">
            {websitePreview ? <a className="preview-action" href={websitePreview} target="_blank" rel="noreferrer">Open Full Website Preview</a> : null}
            {githubUrl ? <a className="preview-action secondary-link" href={githubUrl} target="_blank" rel="noreferrer">Open Draft PR</a> : null}
          </div>
        </article>

        <article className="preview-card publication-card">
          <div className="publication-brand">WordPress / Jetpack</div>
          {visualSrc ? <img className="publication-image" src={visualSrc} alt="" /> : null}
          <h4>{wordpressTitle}</h4>
          <p>{wordpressExcerpt}</p>
          <div className="draft-pill">DRAFT</div>
          <div className="canonical-line"><span>Links back to:</span><span>{canonicalUrl}</span></div>
          {wordpressEditorUrl ? (
            <a className="preview-action secondary-link" href={wordpressEditorUrl} target="_blank" rel="noreferrer">
              Open WordPress Draft Editor
            </a>
          ) : wordpressUrl ? (
            <a className="preview-action secondary-link" href={wordpressUrl} target="_blank" rel="noreferrer">
              Open WordPress Draft
            </a>
          ) : null}
        </article>

        <article className="preview-card publication-card medium-preview">
          <div className="publication-brand">Medium</div>
          <h4>{mediumTitle}</h4>
          <p>{mediumSubtitle}</p>
          <div className="canonical-line"><span>Canonical source:</span><span>{canonicalUrl}</span></div>
          <div className="draft-pill">PREPARED HANDOFF · NOT SAVED IN MEDIUM</div>
          <div className="preview-button-row">
            <a className="preview-action secondary-link" href={mediumProfile} target="_blank" rel="noreferrer">Open Medium Editor</a>
            <button className="preview-action secondary-link" onClick={() => copy("medium", mediumBody)}>
              {copied === "medium" ? "Copied" : "Copy Medium draft"}
            </button>
          </div>
        </article>

        <article className="preview-card publication-card substack-preview">
          <div className="publication-brand">Substack</div>
          <div className="email-subject">Subject: {substackSubject}</div>
          <h4>{substackSubtitle}</h4>
          <p>{substackOpening}</p>
          <div className="canonical-line"><span>Full article:</span><span>{canonicalUrl}</span></div>
          <div className="draft-pill">PREPARED HANDOFF · NOT SAVED IN SUBSTACK</div>
          <div className="preview-button-row">
            <a className="preview-action secondary-link" href={substackDashboard} target="_blank" rel="noreferrer">Open Substack Editor</a>
            <button className="preview-action secondary-link" onClick={() => copy("substack", substackOpening + "\n\n" + substackBody)}>
              {copied === "substack" ? "Copied" : "Copy Substack draft"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function ReportBody({ body }: { body: string }) {
  return (
    <div className="report-body">
      {body.split("\n").map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div className="report-spacer" key={index} />;

        const handoffMatch = trimmed.match(/(?:"signed_review_url"|"reviewUrl")\s*:\s*"([^"]+)"/);
        if (handoffMatch) {
          return (
            <div className="handoff-cta" key={index}>
              <strong>LinkedIn review handoff recorded</strong>
              <span>
                Signed review links expire for security. Use the “Open fresh LinkedIn Review” button in the Campaign Preview Studio above.
              </span>
            </div>
          );
        }

        if (trimmed.startsWith(">")) {
          return (
            <blockquote key={index}>{renderInline(trimmed.replace(/^>\s?/, ""))}</blockquote>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <div className="report-list-item" key={index}>
              <span>•</span>
              <div>{renderInline(trimmed.slice(2))}</div>
            </div>
          );
        }

        const numbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numbered) {
          return (
            <div className="report-list-item numbered" key={index}>
              <span>{numbered[1]}.</span>
              <div>{renderInline(numbered[2])}</div>
            </div>
          );
        }

        return <p key={index}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

export default function Home() {
  const [topic, setTopic] = useState("Choose the strongest authority topic for today.");
  const [market, setMarket] = useState("GCC + Europe");
  const [objective, setObjective] = useState("Authority + advisory leads");
  const [mode, setMode] = useState("CEO MODE");
  const [busy, setBusy] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignState | null>(null);
  const [decision, setDecision] = useState<"approved" | "revision" | "rejected" | null>(null);
  const [releaseToken, setReleaseToken] = useState<string | null>(null);
  const [releaseSelections, setReleaseSelections] = useState<ReleaseSelections>({
    website: true,
    wordpressJetpack: true,
    x: true,
    indexing: true
  });
  const [liveConfirmation, setLiveConfirmation] = useState(false);
  const [publishingLive, setPublishingLive] = useState(false);
  const [releaseResult, setReleaseResult] = useState<ReleaseResult | null>(null);
  const [indexingMonitor, setIndexingMonitor] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetch("/api/integrations")
      .then((r) => r.json())
      .then((d) => setIntegrations(d.integrations || []))
      .catch(() => {});

    const urlSession = new URLSearchParams(window.location.search).get("session");
    const savedSession = window.localStorage.getItem("authority-os-active-session");
    const sessionToResume = urlSession || savedSession;

    if (sessionToResume) {
      if (sessionToResume.startsWith("sess_")) {
        window.localStorage.removeItem("authority-os-active-session");
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("session");
        window.history.replaceState({}, "", cleanUrl.toString());
      } else {
        setSessionId(sessionToResume);
        window.localStorage.setItem("authority-os-active-session", sessionToResume);
      }
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const savedDecision = window.localStorage.getItem("authority-os-decision-" + sessionId);
    if (savedDecision === "approved" || savedDecision === "revision" || savedDecision === "rejected") {
      setDecision(savedDecision);
    }

    const savedRelease = window.localStorage.getItem("authority-os-release-result-" + sessionId);
    if (savedRelease) {
      try {
        setReleaseResult(JSON.parse(savedRelease));
      } catch {}
    }

    let cancelled = false;
    let timer: number | undefined;

    async function poll() {
      try {
        const response = await fetch("/api/session/" + sessionId, { cache: "no-store" });
        const data = await response.json();
        if (cancelled) return;

        if (!response.ok) throw new Error(data.error || "Campaign status could not be loaded.");

        setCampaign(data);

        if (data.final_answer) {
          window.localStorage.setItem("authority-os-report-" + sessionId, data.final_answer);
        }

        if (data.terminal) {
          window.localStorage.removeItem("authority-os-active-session");
          return;
        }

        timer = window.setTimeout(poll, 5000);
      } catch (error) {
        if (cancelled) return;
        setCampaign({
          status: "error",
          terminal: true,
          error: error instanceof Error ? error.message : "Campaign status could not be loaded."
        });
        window.localStorage.removeItem("authority-os-active-session");
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [sessionId]);

  const sections = useMemo(
    () => (campaign?.final_answer ? parseReport(campaign.final_answer) : []),
    [campaign?.final_answer]
  );

  const running = busy || Boolean(sessionId && !campaign?.terminal && !campaign?.stale);
  const completed = Boolean(campaign?.final_answer);
  const stalled = Boolean(campaign?.stale);
  const needsAction = Boolean(campaign?.requires_action);

  async function runCampaign() {
    if (running) return;

    setBusy(true);
    setCampaign({ status: "starting" });
    setDecision(null);
    setReleaseToken(null);
    setReleaseResult(null);
    setIndexingMonitor(null);
    setLiveConfirmation(false);
    setPublishingLive(false);
    setSessionId(null);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, market, objective, mode })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Campaign could not start.");

      setSessionId(data.session_id);
      window.localStorage.setItem("authority-os-active-session", data.session_id);
      const url = new URL(window.location.href);
      url.searchParams.set("session", data.session_id);
      window.history.replaceState({}, "", url.toString());
      setCampaign({ status: data.status || "started", terminal: false });
    } catch (error) {
      setCampaign({
        status: "error",
        terminal: true,
        error: error instanceof Error ? error.message : "Unexpected error."
      });
    } finally {
      setBusy(false);
    }
  }

  function downloadReport() {
    if (!campaign?.final_answer || !sessionId) return;
    const blob = new Blob([campaign.final_answer], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "haris-authority-os-" + sessionId.slice(-8) + ".md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function generateVisualForReview() {
    if (!sessionId) return;
    setBusy(true);
    try {
      const response = await fetch(
        "/api/campaign/" + encodeURIComponent(sessionId) + "/visual",
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Visual could not be generated.");

      setCampaign((current) => {
        if (!current) return current;
        const artifacts = { ...(current.artifacts || {}) } as CampaignArtifacts;
        const staged = { ...(artifacts.staged || {}) };
        staged.visual = data.visual || staged.visual;
        if (staged.wordpress) {
          staged.wordpress = {
            ...staged.wordpress,
            media: data.wordpress?.media || staged.wordpress.media,
            featuredMediaUpdate: data.wordpress?.update || null
          };
        }
        artifacts.staged = staged;
        return { ...current, artifacts };
      });
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Visual generation failed.");
    } finally {
      setBusy(false);
    }
  }

  async function openFreshLinkedInReview() {
    if (!sessionId) return;
    const popup = window.open("about:blank", "_blank");
    try {
      const response = await fetch(
        "/api/campaign/" + encodeURIComponent(sessionId) + "/linkedin-review",
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok || !data.reviewUrl) {
        throw new Error(data.error || "LinkedIn review link could not be prepared.");
      }
      if (popup) popup.location.href = data.reviewUrl;
      else window.location.href = data.reviewUrl;
    } catch (error) {
      if (popup) popup.close();
      window.alert(error instanceof Error ? error.message : "LinkedIn review could not be opened.");
    }
  }

  async function cancelCurrentRun() {
    if (!sessionId) return;
    try {
      await fetch("/api/session/" + sessionId + "/cancel", { method: "POST" });
    } catch {}
    clearCurrentSession();
  }

  function clearCurrentSession() {
    if (sessionId) {
      window.localStorage.removeItem("authority-os-active-session");
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("session");
    window.history.replaceState({}, "", url.toString());
    setSessionId(null);
    setCampaign(null);
    setDecision(null);
    setBusy(false);
  }

  async function approvePackage() {
    if (!sessionId) return;
    setBusy(true);
    try {
      const response = await fetch(
        "/api/campaign/" + encodeURIComponent(sessionId) + "/approve",
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok || !data.releaseToken) {
        throw new Error(data.error || "Campaign approval could not be recorded.");
      }

      setDecision("approved");
      setReleaseToken(data.releaseToken);
      setLiveConfirmation(false);
      window.localStorage.setItem("authority-os-decision-" + sessionId, "approved");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Campaign approval failed.");
    } finally {
      setBusy(false);
    }
  }

  function recordDecision(next: "revision" | "rejected") {
    if (!sessionId) return;
    setDecision(next);
    setReleaseToken(null);
    setLiveConfirmation(false);
    window.localStorage.setItem("authority-os-decision-" + sessionId, next);
  }

  function toggleRelease(key: keyof ReleaseSelections) {
    setReleaseSelections((current) => ({
      ...current,
      [key]: !current[key]
    }));
  }

  async function publishApprovedChannels() {
    if (!sessionId || !releaseToken || !liveConfirmation || publishingLive) return;

    setPublishingLive(true);
    try {
      const response = await fetch("/api/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignRunId: sessionId,
          releaseToken,
          confirmation: "PUBLISH APPROVED CHANNELS",
          selections: releaseSelections
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Live release failed.");
      }

      setReleaseResult(data);
      window.localStorage.setItem(
        "authority-os-release-result-" + sessionId,
        JSON.stringify(data)
      );
    } catch (error) {
      const result = {
        status: "ERROR",
        error: error instanceof Error ? error.message : "Live release failed."
      };
      setReleaseResult(result);
    } finally {
      setPublishingLive(false);
    }
  }

  useEffect(() => {
    const monitorRunId = String(releaseResult?.indexing?.monitorRunId || "");
    if (!monitorRunId) return;

    let cancelled = false;
    let timer: number | undefined;

    async function pollIndexingMonitor() {
      try {
        const response = await fetch(
          "/api/indexing/" + encodeURIComponent(monitorRunId),
          { cache: "no-store" }
        );
        const data = await response.json();
        if (cancelled) return;
        if (!response.ok) throw new Error(data.error || "Indexing monitor could not be loaded.");

        setIndexingMonitor(data);
        if (!data.terminal) {
          timer = window.setTimeout(pollIndexingMonitor, 60000);
        }
      } catch (error) {
        if (cancelled) return;
        setIndexingMonitor({
          status: "error",
          terminal: true,
          error: error instanceof Error ? error.message : "Indexing monitor failed."
        });
      }
    }

    pollIndexingMonitor();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [releaseResult?.indexing?.monitorRunId]);

  return (
    <main className="shell">
      <div className="topline">
        <div>
          <div className="eyebrow">Haris Authority OS</div>
          <h1>One command.<br />An entire authority team.</h1>
          <p className="lede">
            The CEO Agent turns a morning idea into research, strategy, flagship content,
            search optimization, visuals, native distribution, verification and performance learning.
          </p>
        </div>
        <div className="badge">CEO-controlled publishing</div>
      </div>

      <section className="grid">
        <div className="card command-card">
          <h2>Morning command</h2>
          <p>Tell the CEO what you want to talk about — or let it choose the strongest topic from the data.</p>

          <label>What do you want to talk about?</label>
          <textarea value={topic} onChange={(e) => setTopic(e.target.value)} />

          <div className="row">
            <div>
              <label>Market</label>
              <select value={market} onChange={(e) => setMarket(e.target.value)}>
                <option>GCC + Europe</option>
                <option>GCC</option>
                <option>Saudi Arabia + UAE</option>
                <option>Europe → GCC</option>
                <option>Global</option>
              </select>
            </div>

            <div>
              <label>Objective</label>
              <select value={objective} onChange={(e) => setObjective(e.target.value)}>
                <option>Authority + advisory leads</option>
                <option>Executive visibility</option>
                <option>Search authority</option>
                <option>Europe → GCC demand</option>
                <option>Fintech positioning</option>
              </select>
            </div>

            <div>
              <label>Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>CEO MODE</option>
                <option>TOPIC MODE</option>
                <option>AUTOPILOT</option>
              </select>
            </div>
          </div>

          <button className="run" onClick={runCampaign} disabled={running}>
            {running ? "CEO AGENT WORKING…" : "RUN AUTHORITY ENGINE"}
          </button>

          <div className={"campaign-state " + (completed ? "done" : stalled ? "stalled" : running ? "working" : "")}>
            <div className="state-dot" />
            <div>
              <strong>
                {completed
                  ? "COMPLETED"
                  : stalled
                    ? "STALLED"
                    : needsAction
                      ? "NEEDS ACTION"
                      : running
                        ? "IN PROGRESS"
                        : campaign?.error
                          ? "ERROR"
                          : campaign?.status === "idle_incomplete"
                            ? "INCOMPLETE"
                            : "READY"}
              </strong>
              <span>
                {completed
                  ? "CEO recommendation is ready for your review."
                  : stalled
                    ? "This cloud run has had no agent activity for at least 15 minutes. It is safe to cancel it and start a fresh campaign."
                    : needsAction
                      ? "The agent is waiting for an external action before it can continue."
                      : running
                        ? "Durable campaign workflow is running. Specialist agents can work in parallel and completed steps are checkpointed automatically."
                        : campaign?.status === "idle_incomplete"
                          ? "The cloud turn ended without a final campaign answer. Start a fresh campaign."
                          : campaign?.error || "Waiting for your command."}
              </span>
            </div>
          </div>

          {(stalled || needsAction || campaign?.status === "idle_incomplete") && (
            <div className="session-recovery">
              <div>
                <strong>Session recovery</strong>
                <span>
                  Refreshing the browser resumes the same cloud session by design. Use the controls here to detach from it instead.
                </span>
              </div>
              <div className="session-recovery-actions">
                <button className="secondary" onClick={clearCurrentSession}>Start fresh without cancelling</button>
                <button className="danger-action" onClick={cancelCurrentRun}>Cancel run &amp; start fresh</button>
              </div>
            </div>
          )}

          {campaign?.error && <div className="error-box">{campaign.error}</div>}

          {completed && campaign?.final_answer && (
            <section className="report">
              <div className="report-head">
                <div>
                  <div className="eyebrow">CEO recommendation</div>
                  <h2>Campaign decision pack</h2>
                </div>
                <button className="secondary" onClick={downloadReport}>Download report</button>
              </div>

              <PreviewStudio
                artifacts={campaign.artifacts}
                sessionId={sessionId}
                onGenerateVisual={generateVisualForReview}
                onOpenLinkedIn={openFreshLinkedInReview}
              />

              <details className="full-report">
                <summary>Open full evidence, article copy and technical details</summary>
                <div className="report-sections">
                  {sections.map((section, index) => (
                    <article className={"report-section " + (index === 0 ? "hero-section" : "")} key={section.title + index}>
                      <h3>{section.title}</h3>
                      <ReportBody body={section.body} />
                    </article>
                  ))}
                </div>
              </details>

              <div className="decision-panel">
                <div>
                  <strong>Your decision</strong>
                  <span>
                    Approving the package unlocks the release console. Approval alone does not publish anything.
                  </span>
                </div>

                <div className="decision-actions">
                  <button
                    className={decision === "approved" ? "selected" : ""}
                    onClick={approvePackage}
                    disabled={busy || publishingLive}
                  >
                    Approve package
                  </button>
                  <button
                    className={decision === "revision" ? "selected" : ""}
                    onClick={() => recordDecision("revision")}
                  >
                    Request revision
                  </button>
                  <button
                    className={decision === "rejected" ? "selected danger" : ""}
                    onClick={() => recordDecision("rejected")}
                  >
                    Reject
                  </button>
                </div>

                {decision === "approved" && !releaseToken && !releaseResult ? (
                  <div className="decision-note">
                    Approval was recorded earlier. Click <b>Approve package</b> once more to mint a fresh one-hour release authorization.
                  </div>
                ) : null}

                {decision === "approved" && (releaseToken || releaseResult) ? (
                  <div className="release-console">
                    <div className="release-console-head">
                      <div>
                        <div className="eyebrow">Final release gate</div>
                        <h3>Ready to go live</h3>
                        <p>
                          Select what Authority OS may publish automatically. LinkedIn remains a separate final human approval. Medium and Substack remain controlled handoffs.
                        </p>
                      </div>
                      <span className="live-warning">PUBLIC ACTION</span>
                    </div>

                    <div className="release-options">
                      <label className="release-option">
                        <input
                          type="checkbox"
                          checked={releaseSelections.website}
                          onChange={() => toggleRelease("website")}
                          disabled={Boolean(releaseResult?.completedAt)}
                        />
                        <span>
                          <strong>Main website</strong>
                          <small>Merge the approved GitHub draft and verify the canonical URL is live before any downstream distribution.</small>
                        </span>
                      </label>

                      <label className="release-option">
                        <input
                          type="checkbox"
                          checked={releaseSelections.wordpressJetpack}
                          onChange={() => toggleRelease("wordpressJetpack")}
                          disabled={Boolean(releaseResult?.completedAt)}
                        />
                        <span>
                          <strong>WordPress + Jetpack Social</strong>
                          <small>Publish the staged derivative with its featured image and trigger Jetpack publicize where connected.</small>
                        </span>
                      </label>

                      <label className="release-option">
                        <input
                          type="checkbox"
                          checked={releaseSelections.x}
                          onChange={() => toggleRelease("x")}
                          disabled={Boolean(releaseResult?.completedAt)}
                        />
                        <span>
                          <strong>X</strong>
                          <small>Publish the approved X post directly through the connected X API account.</small>
                        </span>
                      </label>

                      <label className="release-option">
                        <input
                          type="checkbox"
                          checked={releaseSelections.indexing}
                          onChange={() => toggleRelease("indexing")}
                          disabled={Boolean(releaseResult?.completedAt)}
                        />
                        <span>
                          <strong>Indexing & discovery</strong>
                          <small>Submit IndexNow, re-submit the Google sitemap when authorized, and inspect the live URL in Search Console.</small>
                        </span>
                      </label>
                    </div>

                    <div className="release-manual">
                      <div>
                        <strong>LinkedIn</strong>
                        <span>Final human approval remains mandatory in Haris Content Publisher.</span>
                      </div>
                      <div>
                        <strong>Medium</strong>
                        <span>Prepared editor handoff. No supported new auto-publish API.</span>
                      </div>
                      <div>
                        <strong>Substack</strong>
                        <span>Prepared editor handoff. No general external auto-publish API used.</span>
                      </div>
                    </div>

                    {!releaseResult?.completedAt ? (
                      <>
                        <label className="release-confirm">
                          <input
                            type="checkbox"
                            checked={liveConfirmation}
                            onChange={(event) => setLiveConfirmation(event.target.checked)}
                          />
                          <span>
                            I understand that clicking below will make the selected channels public.
                          </span>
                        </label>

                        <button
                          className="publish-live"
                          disabled={!liveConfirmation || publishingLive || !releaseToken}
                          onClick={publishApprovedChannels}
                        >
                          {publishingLive
                            ? "PUBLISHING APPROVED CHANNELS…"
                            : "PUBLISH APPROVED CHANNELS"}
                        </button>
                      </>
                    ) : null}

                    {releaseResult ? (
                      <div className="release-progress">
                        <strong>
                          Release status: {String(releaseResult.status || "UNKNOWN").toUpperCase()}
                        </strong>
                        {releaseResult.error ? <span>{releaseResult.error}</span> : null}

                        <div className="release-results">
                          <div className="release-result-row">
                            <span>Main website</span>
                            <b>{String(releaseResult.websiteVerification?.status || releaseResult.website?.status || "PENDING")}</b>
                          </div>
                          <div className="release-result-row">
                            <span>WordPress / Jetpack</span>
                            <b>{String(releaseResult.wordpressJetpack?.status || "PENDING")}</b>
                          </div>
                          {releaseResult.wordpressJetpack?.error ? (
                            <div className="release-error-detail">
                              <strong>WordPress / Jetpack error</strong>
                              <span>{String(releaseResult.wordpressJetpack.error)}</span>
                            </div>
                          ) : null}
                          <div className="release-result-row">
                            <span>X</span>
                            <b>{String(releaseResult.x?.status || "PENDING")}</b>
                          </div>
                          {releaseResult.x?.error ? (
                            <div className="release-error-detail">
                              <strong>X error</strong>
                              <span>{String(releaseResult.x.error)}</span>
                              <a
                                className="preview-action secondary-link"
                                href="/api/oauth/x/start"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Reconnect X
                              </a>
                            </div>
                          ) : null}
                          <div className="release-result-row">
                            <span>IndexNow</span>
                            <b>{String(releaseResult.indexing?.indexNow?.status || releaseResult.indexing?.status || "PENDING")}</b>
                          </div>
                          <div className="release-result-row">
                            <span>Google sitemap</span>
                            <b>{String(releaseResult.indexing?.googleSitemap?.status || "PENDING")}</b>
                          </div>
                          <div className="release-result-row">
                            <span>Google index status</span>
                            <b>{String(releaseResult.indexing?.googleInspection?.status || "MONITORING")}</b>
                          </div>
                          <div className="release-result-row">
                            <span>72-hour index monitor</span>
                            <b>
                              {String(
                                indexingMonitor?.result?.status ||
                                indexingMonitor?.status ||
                                releaseResult.indexing?.monitorStatus ||
                                "NOT SCHEDULED"
                              ).toUpperCase()}
                            </b>
                          </div>
                        </div>

                        {releaseResult.x?.postUrl ? (
                          <a className="preview-action secondary-link" href={String(releaseResult.x.postUrl)} target="_blank" rel="noreferrer">
                            Open X post
                          </a>
                        ) : null}

                        {releaseResult.canonicalUrl ? (
                          <a className="preview-action secondary-link" href={String(releaseResult.canonicalUrl)} target="_blank" rel="noreferrer">
                            Open live canonical article
                          </a>
                        ) : null}

                        {releaseResult.indexing?.monitorRunId ? (
                          <span>
                            Search Console monitoring continues automatically at approximately 1h, 6h, 24h and 72h. You can close this browser.
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    {releaseResult?.completedAt ? (
                      <div className="post-release-actions">
                        <button className="preview-action" onClick={openFreshLinkedInReview}>
                          Open LinkedIn final approval
                        </button>
                        <a className="preview-action secondary-link" href="https://medium.com/new-story" target="_blank" rel="noreferrer">
                          Medium handoff
                        </a>
                        <a className="preview-action secondary-link" href="https://mharisaslam.substack.com/publish/post" target="_blank" rel="noreferrer">
                          Substack handoff
                        </a>
                      </div>
                    ) : null}
                  </div>
                ) : decision ? (
                  <div className="decision-note">
                    Decision recorded: <b>{decision}</b>. No external action was triggered.
                  </div>
                ) : null}
              </div>
            </section>
          )}

          {(campaign?.activity?.length || campaign?.tool_call_count) ? (
            <details className="activity">
              <summary>Agent activity</summary>
              <div className="activity-meta">
                {campaign?.tool_call_count ? <span>{campaign.tool_call_count} tool calls observed</span> : null}
                {sessionId ? <span>Session {sessionId.slice(-12)}</span> : null}
              </div>
              {(campaign?.activity || []).map((item) => (
                <div className="activity-item" key={item.id}>{item.text}</div>
              ))}
            </details>
          ) : null}

          <div className="flow">
            {["Research", "Strategy", "Create", "Publish", "Verify"].map((step) => (
              <div className="step" key={step}>
                <b>{step}</b>
                <span>{step === "Publish" ? "CEO-controlled gate" : "CEO delegates and controls"}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="card">
          <h2>Integration control room</h2>
          <p>Green means the runtime has what it needs. Amber means setup is still required.</p>

          <div className="intlist">
            {integrations
              .filter((x) => !["reddit", "youtube", "clay"].includes(x.id))
              .map((item) => (
                <div className="int" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                  <div className={item.configured ? "dot good" : "dot"} />
                </div>
              ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
