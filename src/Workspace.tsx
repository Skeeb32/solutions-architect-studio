import { useState } from "react";
import { Search, Download, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { adrs, initiatives, controls, technologies, cases } from "./data";
export function downloadJson(name: string, data: unknown) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Decisions() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const results = adrs.filter(
    (a) =>
      (status === "All statuses" || a.status === status) &&
      `${a.title} ${a.id} ${a.context}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section>
      <div className="section-intro">
        <span className="eyebrow">THE REASONING BEHIND THE SYSTEM</span>
        <h2>Architecture decision records</h2>
        <p>
          Context, alternatives and consequences. Every decision leaves a trail.
        </p>
      </div>
      <div className="filters">
        <label className="search">
          <Search size={16} />
          <input
            aria-label="Search decisions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decisions…"
          />
        </label>
        <select
          aria-label="Decision status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {[
            "All statuses",
            "Accepted",
            "Proposed",
            "Deprecated",
            "Superseded",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {results.length === 0 && (
        <p role="status">
          No decisions match your search. Try another title or status.
        </p>
      )}
      {results.map((a) => (
        <details className="record" key={a.id}>
          <summary>
            <span className="mono">{a.id}</span>
            <strong>{a.title}</strong>
            <span className="badge">{a.status}</span>
            <span className="record-date">{a.date}</span>
          </summary>
          <dl className="record-content">
            {Object.entries({
              Context: a.context,
              "Decision drivers": a.drivers,
              "Options considered": a.options,
              Decision: a.decision,
              "Positive consequences": a.positive,
              "Negative consequences": a.negative,
              Operations: a.operations,
              Security: a.security,
              "Related systems": a.systems,
            }).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </details>
      ))}
    </section>
  );
}
export function Technologies() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const results = technologies.filter(
    (t) =>
      (category === "All" || t[0] === category) &&
      t.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section>
      <div className="section-intro">
        <span className="eyebrow">FIT FOR PURPOSE, BY DESIGN</span>
        <h2>Technology portfolio</h2>
        <p>
          Choose tools by requirements, operating constraints and long-term
          ownership.
        </p>
      </div>
      <div className="filters">
        <label className="search">
          <Search size={16} />
          <input
            aria-label="Search technologies"
            placeholder="Search technologies…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Technology category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {["All", ...new Set(technologies.map((t) => t[0]))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="technology-grid">
        {results.map((t) => (
          <article className="technology-card" key={t[1]}>
            <span className="eyebrow">{t[0]}</span>
            <h3>{t[1]}</h3>
            <p>{t[2]}</p>
            <dl>
              <dt>Strength</dt>
              <dd>{t[3]}</dd>
              <dt>Trade-off</dt>
              <dd>{t[4]}</dd>
            </dl>
          </article>
        ))}
      </div>
      {!results.length && (
        <p role="status">No technologies match your filters.</p>
      )}
    </section>
  );
}
export function Roadmap() {
  const [phase, setPhase] = useState("All phases");
  const [priority, setPriority] = useState("All priorities");
  const [domain, setDomain] = useState("All domains");
  const results = initiatives.filter(
    (i) =>
      (phase === "All phases" || i.phase === phase) &&
      (priority === "All priorities" || i.priority === priority) &&
      (domain === "All domains" || i.domain === domain),
  );
  return (
    <section>
      <div className="section-intro">
        <span className="eyebrow">FROM CURRENT STATE TO TARGET STATE</span>
        <h2>A deliberate path to modernization</h2>
        <p>
          Illustrative delivery sequence. Exit criteria determine progress, not
          arbitrary dates.
        </p>
      </div>
      <div className="filters">
        {[
          [
            phase,
            setPhase,
            ["All phases", "Assess", "Modernize", "Optimize"],
            "Roadmap phase",
          ],
          [
            priority,
            setPriority,
            ["All priorities", "High", "Medium"],
            "Roadmap priority",
          ],
          [
            domain,
            setDomain,
            [
              "All domains",
              "Application",
              "Security",
              "Integration",
              "Platform",
            ],
            "Roadmap domain",
          ],
        ].map(([value, setter, options, label]) => (
          <select
            key={label as string}
            aria-label={label as string}
            value={value as string}
            onChange={(e) => (setter as (v: string) => void)(e.target.value)}
          >
            {(options as string[]).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ))}
      </div>
      <div className="roadmap-grid">
        {["Assess", "Modernize", "Optimize"].map((p, index) => (
          <div key={p} className="phase">
            <span className="eyebrow">PHASE 0{index + 1}</span>
            <h3>{p}</h3>
            {results
              .filter((i) => i.phase === p)
              .map((i) => (
                <details className="initiative" key={i.name}>
                  <summary>
                    <span className="badge">
                      {i.priority} priority · {i.domain}
                    </span>
                    <h4>{i.name}</h4>
                    <p>{i.value}</p>
                    <span className="text-link">View delivery criteria ↗</span>
                  </summary>
                  <dl>
                    <dt>Complexity / risk</dt>
                    <dd>
                      {i.complexity} / {i.risk}
                    </dd>
                    <dt>Dependencies</dt>
                    <dd>{i.dependencies}</dd>
                    <dt>Success measure</dt>
                    <dd>{i.measure}</dd>
                  </dl>
                </details>
              ))}
          </div>
        ))}
      </div>
      {!results.length && (
        <p role="status">No initiatives match these filters.</p>
      )}
    </section>
  );
}
export const reviewStatuses = [
  "Not Started",
  "In Review",
  "Compliant",
  "Needs Attention",
];
export function readReview(): Record<string, string> {
  try {
    const value = JSON.parse(localStorage.getItem("studio-review-v1") || "{}");
    return Object.fromEntries(
      Object.entries(value ?? {}).filter(
        ([k, v]) =>
          controls.includes(k) &&
          typeof v === "string" &&
          reviewStatuses.includes(v),
      ),
    ) as Record<string, string>;
  } catch {
    return {};
  }
}
export function Governance() {
  const [review, setReview] = useState(readReview);
  const [notice, setNotice] = useState("");
  const compliant = controls.filter((c) => review[c] === "Compliant").length;
  function update(c: string, status: string) {
    const next = { ...review, [c]: status };
    setReview(next);
    try {
      localStorage.setItem("studio-review-v1", JSON.stringify(next));
      setNotice("Review saved in this browser.");
    } catch {
      setNotice("Browser storage unavailable. Export to keep your review.");
    }
  }
  return (
    <section>
      <div className="section-intro">
        <span className="eyebrow">ASSURANCE IS PART OF THE ARCHITECTURE</span>
        <h2>Architecture review</h2>
        <p>
          Assess the example design. Statuses are your local review, not a
          compliance certification.
        </p>
      </div>
      <div className="review-banner">
        <CheckCircle2 />
        <div>
          <strong>
            {compliant} / {controls.length} controls marked compliant
          </strong>
          <p>Review evidence before accepting a control.</p>
        </div>
        <button
          className="button"
          onClick={() =>
            downloadJson("architecture-review.json", {
              classification: "Illustrative self-assessment",
              review: Object.fromEntries(
                controls.map((c) => [c, review[c] || "Not Started"]),
              ),
            })
          }
        >
          <Download size={15} /> Export review
        </button>
      </div>
      <div className="control-list">
        {controls.map((c, i) => (
          <label className="control-row" key={c}>
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <strong>{c}</strong>
            <select
              aria-label={c}
              value={review[c] || "Not Started"}
              onChange={(e) => update(c, e.target.value)}
            >
              {reviewStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <p role="status" className="muted">
        {notice ||
          "Saved locally on this device. No review data is sent to a server."}
      </p>
    </section>
  );
}
export function Cases() {
  return (
    <section>
      <div className="section-intro">
        <span className="eyebrow">APPLIED ARCHITECTURAL THINKING</span>
        <h2>From business challenge to solution</h2>
        <p>
          Three illustrative design studies. Proposed outcomes are targets, not
          measured results.
        </p>
      </div>
      <div className="case-grid">
        {cases.map((c, i) => (
          <article className="case-card" key={c.title}>
            <div className={`case-art art-${i}`}>
              <span>0{i + 1}</span>
              <div className="art-path">
                {i === 0
                  ? "LEGACY → API → SERVICES"
                  : i === 1
                    ? "CHANNELS ⇄ CONTRACT ⇄ SYSTEMS"
                    : "CLASSIFY → OWN → GOVERN"}
              </div>
              <ArrowUpRight size={28} />
            </div>
            <div className="case-copy">
              <span className="eyebrow">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.challenge}</p>
              <details>
                <summary className="text-link">
                  Explore the solution <ArrowUpRight size={15} />
                </summary>
                <dl>
                  <dt>Solution</dt>
                  <dd>{c.solution}</dd>
                  <dt>Trade-off</dt>
                  <dd>{c.tradeoff}</dd>
                  <dt>Validation</dt>
                  <dd>{c.outcome}</dd>
                </dl>
              </details>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
