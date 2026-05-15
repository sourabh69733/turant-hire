const categories = [
  "Warehouse",
  "Delivery",
  "Retail",
  "Hospitality",
  "Admin",
  "Cleaning",
];

const jobs = [
  { role: "Store Assistant", pay: "$18/hr", location: "Brooklyn", start: "Start tomorrow" },
  { role: "Delivery Driver", pay: "$22/hr", location: "Queens", start: "Start today" },
  { role: "Warehouse Picker", pay: "$20/hr", location: "Jersey City", start: "Night shift" },
];

const steps = [
  "Post a role or create a worker profile",
  "Get matched with nearby talent fast",
  "Message, shortlist, and start sooner",
];

export default function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">TH</span>
          <span>Turant Hire</span>
        </div>
        <nav className="nav">
          <a href="#jobs">Find Jobs</a>
          <a href="#how">How It Works</a>
          <a href="#post">Post a Job</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Same-day and next-day hiring</p>
            <h1>Hire fast. Get hired fast.</h1>
            <p className="hero-text">
              A simple place for local businesses and workers to connect without
              long forms, slow replies, or messy hiring steps.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#post">
                Post a Job
              </a>
              <a className="button button-secondary" href="#jobs">
                Find Work
              </a>
            </div>
            <p className="trust-line">Verified profiles. Fast responses. Mobile-first.</p>
          </div>

          <aside className="hero-panel">
            <div className="metric-card">
              <span>Fast posting</span>
              <strong>2 min</strong>
            </div>
            <div className="metric-card">
              <span>Response time</span>
              <strong>Under 1 hr</strong>
            </div>
            <div className="metric-card accent">
              <span>Best for</span>
              <strong>Hourly jobs</strong>
            </div>
          </aside>
        </section>

        <section className="search-panel">
          <div>
            <span className="field-label">Role</span>
            <strong>Warehouse worker</strong>
          </div>
          <div>
            <span className="field-label">Location</span>
            <strong>Near me</strong>
          </div>
          <div>
            <span className="field-label">Shift</span>
            <strong>Morning</strong>
          </div>
          <a className="button button-primary" href="#jobs">
            Search Jobs
          </a>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Popular categories</p>
            <h2>Built for quick local hiring</h2>
          </div>
          <div className="chip-grid">
            {categories.map((category) => (
              <span className="chip" key={category}>
                {category}
              </span>
            ))}
          </div>
        </section>

        <section className="section" id="how">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>Three simple steps</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <article className="step-card" key={step}>
                <span className="step-index">0{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="jobs">
          <div className="section-heading">
            <p className="eyebrow">Featured jobs</p>
            <h2>Live roles that need fast action</h2>
          </div>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <article className="job-card" key={job.role}>
                <span className="job-badge">Urgent hiring</span>
                <h3>{job.role}</h3>
                <p>{job.location}</p>
                <div className="job-meta">
                  <strong>{job.pay}</strong>
                  <span>{job.start}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section trust-section">
          <div className="section-heading">
            <p className="eyebrow">Trust signals</p>
            <h2>Enough detail to move fast with confidence</h2>
          </div>
          <div className="trust-grid">
            <article>
              <strong>Verified employers</strong>
              <p>Know who is posting before you apply.</p>
            </article>
            <article>
              <strong>Verified workers</strong>
              <p>Skills, availability, and ratings in one place.</p>
            </article>
            <article>
              <strong>Fast shortlist</strong>
              <p>See ready-to-work candidates without extra steps.</p>
            </article>
          </div>
        </section>

        <section className="cta-banner" id="post">
          <p className="eyebrow">Ready to launch</p>
          <h2>Need staff today? Post in two minutes.</h2>
          <a className="button button-primary" href="#top">
            Start Posting
          </a>
        </section>
      </main>
    </div>
  );
}
