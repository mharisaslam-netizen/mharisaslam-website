"use client";

import { useEffect, useState } from "react";

type Integration = {
  id: string;
  name: string;
  role: string;
  configured: boolean;
  status: string;
};

export default function Home() {
  const [topic, setTopic] = useState("Choose the strongest authority topic for today.");
  const [market, setMarket] = useState("GCC + Europe");
  const [objective, setObjective] = useState("Authority + advisory leads");
  const [mode, setMode] = useState("CEO MODE");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("Ready.");
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/integrations")
      .then((r) => r.json())
      .then((d) => setIntegrations(d.integrations || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    const terminal = new Set(["completed", "failed", "cancelled", "canceled"]);

    async function poll() {
      try {
        const response = await fetch("/api/session/" + sessionId, { cache: "no-store" });
        const data = await response.json();
        if (cancelled) return;

        const messagePreview = JSON.stringify(data.messages || [], null, 2);
        setResult(
          "Campaign session: " + sessionId +
          "\nStatus: " + (data.status || "running") +
          (data.error ? "\nError: " + data.error : "") +
          "\n\nRecent CEO activity:\n" + messagePreview
        );

        if (!terminal.has(String(data.status || "").toLowerCase())) {
          window.setTimeout(poll, 5000);
        }
      } catch {
        if (!cancelled) window.setTimeout(poll, 7000);
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function runCampaign() {
    setBusy(true);
    setSessionId(null);
    setResult("CEO Agent is opening the campaign...");

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, market, objective, mode })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Campaign could not start.");

      setSessionId(data.session_id);
      setResult(
        "Campaign session: " + data.session_id +
        "\nStatus: " + (data.status || "started") +
        "\n\nThe CEO Agent has begun research and delegation."
      );
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Unexpected error.");
    } finally {
      setBusy(false);
    }
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
        <div className="card">
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

          <button className="run" onClick={runCampaign} disabled={busy}>
            {busy ? "CEO AGENT WORKING…" : "RUN AUTHORITY ENGINE"}
          </button>

          <div className="status">{result}</div>

          <div className="flow">
            {["Research", "Strategy", "Create", "Publish", "Verify"].map((step) => (
              <div className="step" key={step}>
                <b>{step}</b>
                <span>CEO delegates and controls</span>
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
