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

function ReportBody({ body }: { body: string }) {
  return (
    <div className="report-body">
      {body.split("\n").map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div className="report-spacer" key={index} />;

        const handoffMatch = trimmed.match(/"signed_review_url"\s*:\s*"([^"]+)"/);
        if (handoffMatch) {
          const rawUrl = handoffMatch[1].replace(/\\u0026/g, "&").replace(/\\&/g, "&");
          return (
            <div className="handoff-cta" key={index}>
              <strong>LinkedIn review is ready</strong>
              <span>Open the existing Haris Content Publisher with this draft prefilled. Nothing publishes until you approve it there.</span>
              <a href={rawUrl} target="_blank" rel="noreferrer">Open LinkedIn Review</a>
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

  useEffect(() => {
    fetch("/api/integrations")
      .then((r) => r.json())
      .then((d) => setIntegrations(d.integrations || []))
      .catch(() => {});

    const urlSession = new URLSearchParams(window.location.search).get("session");
    const savedSession = window.localStorage.getItem("authority-os-active-session");
    const sessionToResume = urlSession || savedSession;

    if (sessionToResume) {
      setSessionId(sessionToResume);
      window.localStorage.setItem("authority-os-active-session", sessionToResume);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const savedDecision = window.localStorage.getItem("authority-os-decision-" + sessionId);
    if (savedDecision === "approved" || savedDecision === "revision" || savedDecision === "rejected") {
      setDecision(savedDecision);
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

  function recordDecision(next: "approved" | "revision" | "rejected") {
    if (!sessionId) return;
    setDecision(next);
    window.localStorage.setItem("authority-os-decision-" + sessionId, next);
  }

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
                        ? "Research, challenge and synthesis are running."
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

              <div className="report-sections">
                {sections.map((section, index) => (
                  <article className={"report-section " + (index === 0 ? "hero-section" : "")} key={section.title + index}>
                    <h3>{section.title}</h3>
                    <ReportBody body={section.body} />
                  </article>
                ))}
              </div>

              <div className="decision-panel">
                <div>
                  <strong>Your decision</strong>
                  <span>These controls record your review only. Publishing remains disabled until live connectors are enabled.</span>
                </div>
                <div className="decision-actions">
                  <button className={decision === "approved" ? "selected" : ""} onClick={() => recordDecision("approved")}>Approve package</button>
                  <button className={decision === "revision" ? "selected" : ""} onClick={() => recordDecision("revision")}>Request revision</button>
                  <button className={decision === "rejected" ? "selected danger" : ""} onClick={() => recordDecision("rejected")}>Reject</button>
                </div>
                {decision && <div className="decision-note">Decision recorded: <b>{decision}</b>. No external action was triggered.</div>}
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
