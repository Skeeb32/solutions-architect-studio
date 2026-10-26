import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Layers3,
  LayoutDashboard,
  Workflow,
  Cpu,
  Route,
  ShieldCheck,
  FileText,
  ArrowUpRight,
  ArrowRight,
  Download,
  Menu,
  X,
  Box,
  ChevronRight,
} from "lucide-react";
import { Architecture } from "./Architecture";
import {
  Decisions,
  Technologies,
  Roadmap,
  Governance,
  Cases,
  downloadJson,
} from "./Workspace";
import { components, adrs, initiatives } from "./data";
import "./style.css";
const navigation = [
  ["overview", "Overview", LayoutDashboard],
  ["architecture", "Reference architecture", Workflow],
  ["technologies", "Technology portfolio", Cpu],
  ["roadmap", "Modernization roadmap", Route],
  ["governance", "Governance & assurance", ShieldCheck],
  ["decisions", "Decision records", FileText],
  ["cases", "Case studies", Layers3],
] as const;
function getPage() {
  const hash = window.location.hash.slice(1);
  return navigation.some((n) => n[0] === hash) ? hash : "overview";
}
function App() {
  const [page, setPage] = useState(getPage);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const listener = () => {
      setPage(getPage());
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  const title = navigation.find((n) => n[0] === page)?.[1];
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <a className="brand" href="#overview">
          <span className="brand-mark">
            <Layers3 size={25} />
          </span>
          <span>
            Architecture<span>STUDIO</span>
          </span>
        </a>
        <button
          className="mobile-close"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        >
          <X />
        </button>
        <div className="workspace-label">
          PORTFOLIO WORKSPACE <span>01</span>
        </div>
        <nav aria-label="Primary navigation">
          {navigation.map(([id, label, Icon]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={page === id ? "page" : undefined}
              className={page === id ? "active" : ""}
            >
              <Icon size={18} />
              {label}
              {page === id && <span className="nav-dot" />}
            </a>
          ))}
        </nav>
        <div className="sidebar-note">
          <div className="small-icon">
            <Box size={19} />
          </div>
          <strong>Built to connect the dots.</strong>
          <p>Business strategy. Technical design. Lasting value.</p>
          <a href="#cases">
            Explore design studies <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="sidebar-bottom">
          <span className="avatar">SA</span>
          <div>
            Solutions Architect<span>PORTFOLIO · 06B3</span>
          </div>
          <span className="dot" />
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenu(true)}
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            Workspace <ChevronRight size={14} /> <strong>{title}</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-label">
              <span className="dot" /> Interactive portfolio
            </span>
            <button
              className="subtle"
              onClick={() =>
                downloadJson("architecture-blueprint.json", {
                  description:
                    "Illustrative reference architecture; not a deployed backend",
                  components,
                  adrs,
                  initiatives,
                })
              }
            >
              <Download size={15} />
              <span>Export blueprint</span>
            </button>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <div className="page-meta">
            <span className="eyebrow">SOLUTIONS ARCHITECTURE / 06B3</span>
            <span className="edition">PORTFOLIO EDITION 2026</span>
          </div>
          {page === "overview" ? (
            <>
              <section className="hero">
                <div>
                  <h1>
                    Designing systems that
                    <br />
                    move business <span>forward.</span>
                  </h1>
                  <p>
                    Turning business complexity into clear, secure and scalable
                    solutions.
                    <br className="desktop-break" /> Explore the
                    architecture—and the thinking behind it.
                  </p>
                  <div className="hero-actions">
                    <a href="#architecture" className="button primary">
                      Explore architecture <ArrowRight size={16} />
                    </a>
                    <a href="#cases" className="button">
                      View case studies <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
                <div className="hero-stamp">
                  <div className="stamp-orbit">
                    <Layers3 size={43} />
                  </div>
                  <span>STRATEGY → SYSTEMS → IMPACT</span>
                </div>
              </section>
              <div className="capabilities">
                {[
                  [Workflow, "Architecture", "Connected, intentional systems"],
                  [
                    ShieldCheck,
                    "Governance",
                    "Standards built into the design",
                  ],
                  [Route, "Modernization", "A practical path to what’s next"],
                ].map(([Icon, title, desc], i) => {
                  const I = Icon as typeof Workflow;
                  return (
                    <a
                      href={["#architecture", "#governance", "#roadmap"][i]}
                      key={String(title)}
                    >
                      <I size={22} />
                      <div>
                        <strong>{String(title)}</strong>
                        <span>{String(desc)}</span>
                      </div>
                      <ArrowUpRight size={16} />
                    </a>
                  );
                })}
              </div>
              <div className="section-top">
                <div>
                  <span className="eyebrow">EXPLORE THE SYSTEM</span>
                  <h2>Architecture, made tangible.</h2>
                </div>
                <span className="muted">
                  One connected blueprint. Every decision explained.
                </span>
              </div>
              <Architecture />
              <div className="lower-section">
                <Cases />
              </div>
              <div className="roadmap-preview">
                <div>
                  <span className="eyebrow">
                    THINK BEYOND THE FIRST RELEASE
                  </span>
                  <h2>Good architecture has a roadmap.</h2>
                  <p>
                    Assess the landscape. Modernize deliberately. Optimize
                    continuously.
                  </p>
                </div>
                <a className="button" href="#roadmap">
                  Explore roadmap <ArrowRight size={16} />
                </a>
              </div>
            </>
          ) : (
            <>
              <h1 className="page-title">{title}</h1>
              {page === "architecture" && (
                <>
                  <p className="page-description">
                    Inspect responsibilities, interfaces and security
                    boundaries. These are conceptual services, not live
                    infrastructure.
                  </p>
                  <Architecture />
                </>
              )}
              {page === "technologies" && <Technologies />}
              {page === "roadmap" && <Roadmap />}
              {page === "governance" && <Governance />}
              {page === "decisions" && <Decisions />}
              {page === "cases" && <Cases />}
            </>
          )}
          <footer>
            <span>© 2026 Solutions Architect Studio</span>
            <span>
              Illustrative portfolio · Independent, not government affiliated
            </span>
            <a
              href="https://www.chicago.gov/city/en/depts/dhr/supp_info/administrative_services0600.html"
              target="_blank"
              rel="noreferrer"
            >
              Role reference <ArrowUpRight size={12} />
            </a>
          </footer>
        </main>
      </div>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
