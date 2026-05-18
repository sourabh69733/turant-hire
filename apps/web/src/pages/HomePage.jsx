function getAppUrls() {
  const isLocalHost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  return {
    candidate:
      import.meta.env.VITE_CANDIDATE_APP_URL ??
      (isLocalHost ? "http://127.0.0.1:4174" : "https://talent.turanthire.com"),
    employer:
      import.meta.env.VITE_EMPLOYER_APP_URL ??
      (isLocalHost ? "http://127.0.0.1:4175" : "https://employer.turanthire.com"),
  };
}

/* ── SVG Icon helpers ─────────────────────────────────────────────── */
function BoltIcon({ size = 24, color = "#ffc347" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2L4.5 13.5H11L10 22L20.5 10.5H14L13 2Z" fill={color} />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PersonSearchIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
      <circle cx="18" cy="17" r="3" />
      <path d="M20.2 19.2L22 21" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PersonCheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function CaseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M21 9H3" />
      <path d="M3 9v12h18V9" />
      <rect x="9" y="14" width="6" height="7" />
      <path d="M9 9a3 3 0 0 1-6 0" />
      <path d="M15 9a3 3 0 0 1-6 0" />
      <path d="M21 9a3 3 0 0 1-6 0" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ marginLeft: 8 }}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashedArrow() {
  return (
    <div className="th-step-arrow-wrap" aria-hidden="true">
      <svg width="80" height="16" viewBox="0 0 80 16" fill="none">
        <line x1="0" y1="8" x2="66" y2="8" stroke="#b0b8c8" strokeWidth="1.5" strokeDasharray="5 4" />
        <path d="M66 4l8 4-8 4" stroke="#b0b8c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

/* ── Brand ────────────────────────────────────────────────────────── */
function BrandMark() {
  return (
    <div className="th-brand">
      <BoltIcon size={26} color="#ffc347" />
      <span className="th-brand-text">TurantHire</span>
    </div>
  );
}

/* ── Hero preview card ────────────────────────────────────────────── */
function HeroPreview() {
  return (
    <div className="th-preview-card" aria-hidden="true">
      <div className="th-preview-top">
        <div className="th-preview-badge">
          <BoltIcon size={24} color="#ffc347" />
        </div>
        <div className="th-preview-lines">
          <span style={{ width: 120 }} />
          <span style={{ width: 108 }} />
          <span style={{ width: 96 }} />
          <span style={{ width: 84 }} />
        </div>
      </div>

      <div className="th-preview-row">
        <span className="th-preview-icon"><BriefcaseIcon /></span>
        <span>Need: Sales Executive, Bengaluru</span>
        <span />
      </div>
      <div className="th-preview-row">
        <span className="th-preview-icon"><PeopleIcon /></span>
        <span>Candidates ready today:</span>
        <strong>18</strong>
      </div>
      <div className="th-preview-row">
        <span className="th-preview-icon"><ShieldIcon /></span>
        <span>Verified profiles:</span>
        <strong>12</strong>
      </div>
      <div className="th-preview-row">
        <span className="th-preview-icon"><CalendarIcon /></span>
        <span>Interviews can start:</span>
        <strong>Today</strong>
      </div>
    </div>
  );
}

/* ── Data ─────────────────────────────────────────────────────────── */
const painPoints = [
  { title: "Post jobs and wait",        text: "Job posts take time. Urgent needs don't.",          Icon: HourglassIcon },
  { title: "Candidates don't respond",  text: "Many see the job, few actually reply.",              Icon: ChatIcon },
  { title: "Too much manual screening", text: "Sorting profiles and verifying takes hours.",        Icon: PersonSearchIcon },
  { title: "Hiring gets delayed",       text: "Critical roles stay open. Business slows down.",    Icon: ClockIcon },
];

const steps = [
  { number: "1", title: "Tell us who you need",          text: "Share role, location and key requirements.",             Icon: DocIcon },
  { number: "2", title: "We find available candidates",  text: "We match and verify candidates who are ready to join.", Icon: TeamIcon },
  { number: "3", title: "You interview and hire faster", text: "Talk to interested candidates and close faster.",        Icon: PersonCheckIcon },
];

const useCases = [
  { title: "Startups",          text: "Move fast and build without delays.",           Icon: RocketIcon },
  { title: "Agencies",          text: "Deliver for clients on tight timelines.",       Icon: CaseIcon },
  { title: "Local Businesses",  text: "Find reliable talent when you need it.",        Icon: StoreIcon },
  { title: "High-volume Teams", text: "Hire more people, faster.",                    Icon: GroupIcon },
];

import { useState } from "react";

/* ── Page ─────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const appUrls = getAppUrls();

  const handleComingSoon = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="turant-landing">
      {/* COMING SOON MODAL */}
      {showModal && (
        <div className="th-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="th-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="th-modal-icon">
              <BoltIcon size={32} color="#ffc347" />
            </div>
            <h3>Coming Soon!</h3>
            <p>We are currently building this feature. Stay tuned!</p>
            <button className="th-btn th-btn-primary" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="th-navbar">
        <div className="th-navbar-inner">
          <BrandMark />

          <nav className="th-nav">
            <a href="#companies">For Companies</a>
            <a href="#candidates">Candidates</a>
            <a href={appUrls.employer}>Login</a>
          </nav>

          <a className="th-nav-cta" href={appUrls.employer}>
            Start Hiring
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="th-hero-section">
        <div className="th-hero-inner">
          <div className="th-hero-copy">
            <h1>
              Fast hiring for<br />
              roles that <span className="th-accent">cannot wait.</span>
            </h1>
            <p className="th-hero-text">
              TurantHire helps companies find verified, available
              candidates for urgent roles — without waiting weeks
              for job posts, follow-ups, and manual screening.
            </p>

            <div className="th-hero-actions">
              <a className="th-btn th-btn-primary" href={appUrls.employer}>
                Start Hiring <ArrowRight />
              </a>
              <a className="th-btn th-btn-secondary" href={appUrls.candidate}>
                Join as Candidate <ArrowRight />
              </a>
            </div>

            <div className="th-hero-note">
              <ShieldIcon />
              <span>Built for fast hiring in India</span>
            </div>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="th-section th-problem-section">
        <div className="th-container">
          <h2 className="th-section-title centered">Hiring is broken when you need someone urgently.</h2>
          <div className="th-problem-grid">
            {painPoints.map((item) => (
              <article className="th-problem-item" key={item.title}>
                <div className="th-icon-circle">
                  <item.Icon />
                </div>
                <div>
                  <strong className="th-item-title">{item.title}</strong>
                  <p className="th-item-text">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="th-section th-how-section" id="companies">
        <div className="th-container">
          <h2 className="th-section-title centered">How it works</h2>
          <div className="th-steps-row">
            {steps.map((step, index) => (
              <div className="th-step-wrap" key={step.number}>
                <article className="th-step">
                  <div className="th-step-icon-wrap">
                    <step.Icon />
                  </div>
                  <strong className="th-step-title">
                    {step.number}. {step.title}
                  </strong>
                  <p className="th-item-text">{step.text}</p>
                </article>
                {index < steps.length - 1 && <DashedArrow />}
              </div>
            ))}
          </div>

          <div className="th-centered-cta">
            <a className="th-btn th-btn-primary" href={appUrls.employer}>
              Post your requirement <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="th-section th-usecases-section" id="candidates">
        <div className="th-container">
          <h2 className="th-section-title centered">Built for urgent hiring</h2>
          <div className="th-usecase-grid">
            {useCases.map((item) => (
              <article className="th-usecase-card" key={item.title}>
                <div className="th-icon-circle warm">
                  <item.Icon />
                </div>
                <div>
                  <strong className="th-item-title">{item.title}</strong>
                  <p className="th-item-text">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="th-cta-strip" id="contact">
        <div className="th-container">
          <div className="th-cta-inner">
            <div className="th-cta-copy">
              <h2 className="th-cta-title">Need to hire someone urgently?</h2>
              <p className="th-cta-sub">Start with one requirement. We'll help you find ready candidates faster.</p>
            </div>
            <a className="th-btn th-btn-primary th-btn-lg" href={appUrls.employer}>
              Start Hiring <ArrowRight />
            </a>
            <div className="th-cta-bolt" aria-hidden="true">
              <BoltIcon size={100} color="rgba(255,195,71,0.18)" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="th-footer">
        <div className="th-container">
          <div className="th-footer-inner">
            <div className="th-footer-brand">
              <BrandMark />
              <p className="th-footer-tagline">Fast hiring for roles that cannot wait.</p>
            </div>

            <nav className="th-footer-links">
              <a href={appUrls.employer}>For Companies</a>
              <a href={appUrls.candidate}>Candidates</a>
              <a href="#about">About Us</a>
              <a href="#contact">Contact Us</a>
              <a href="#privacy">Privacy Policy</a>
            </nav>
          </div>

          <div className="th-footer-bottom">
            <span>© 2025 TurantHire. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
