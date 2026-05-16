import { useMemo, useState } from "react";

const candidates = [
  {
    id: 1,
    name: "Maria Chen",
    role: "Warehouse Associate",
    location: "Brooklyn, NY",
    distance: "2.1 miles away",
    pay: "$20/hr expected",
    availability: "Ready today",
    skills: ["Packing", "Inventory", "Night shift"],
    matchScore: 96,
    reason: "Matches shift, pay, and same-day start",
    badges: ["Verified phone", "Ready now"],
  },
  {
    id: 2,
    name: "Jordan Patel",
    role: "Fulfillment Worker",
    location: "Queens, NY",
    distance: "4.8 miles away",
    pay: "$19/hr expected",
    availability: "Tomorrow morning",
    skills: ["Scanning", "Loading", "Weekend shift"],
    matchScore: 89,
    reason: "Good skill match, slightly later availability",
    badges: ["Background checked", "Recent experience"],
  },
  {
    id: 3,
    name: "Ava Robinson",
    role: "Retail Stock Assistant",
    location: "Jersey City, NJ",
    distance: "6.3 miles away",
    pay: "$18/hr expected",
    availability: "Available this week",
    skills: ["Stocking", "Customer support", "Morning shift"],
    matchScore: 82,
    reason: "Strong retail fit with lower travel priority",
    badges: ["Top rated", "Weekday open"],
  },
];

const profileItems = [
  "Full name and contact",
  "Primary role and skills",
  "Location and travel range",
  "Expected pay and shift type",
  "Availability and ready-now status",
];

const requirementItems = [
  "Job title and key skills",
  "Shift timing and urgency",
  "Location and pay range",
  "One best match at a time",
  "Pass to refresh next candidate",
];

const activitySeed = [
  "Saved 4 candidates this week",
  "2 candidates marked ready now",
  "1 employer request waiting",
];

function CandidateDashboard() {
  return (
    <section className="dashboard-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Candidate dashboard</p>
          <h2>Create one profile and stay ready</h2>
        </div>
        <span className="status-pill success">Profile 82% complete</span>
      </div>

      <div className="dashboard-grid">
        <article className="card profile-card">
          <div className="card-top">
            <div>
              <span className="mini-label">Your public card</span>
              <h3>Riya Sharma</h3>
              <p>Warehouse and retail support worker</p>
            </div>
            <span className="status-pill">Ready now</span>
          </div>

          <div className="info-pairs">
            <div>
              <span className="field-label">Location</span>
              <strong>Lower Manhattan</strong>
            </div>
            <div>
              <span className="field-label">Expected pay</span>
              <strong>$19/hr</strong>
            </div>
            <div>
              <span className="field-label">Shift</span>
              <strong>Morning / Evening</strong>
            </div>
            <div>
              <span className="field-label">Travel range</span>
              <strong>Up to 8 miles</strong>
            </div>
          </div>

          <div className="tag-row">
            <span className="tag">Stocking</span>
            <span className="tag">POS basics</span>
            <span className="tag">Packing</span>
            <span className="tag">Weekend available</span>
          </div>

          <div className="action-row">
            <button className="button button-primary" type="button">
              Edit profile
            </button>
            <button className="button button-secondary" type="button">
              Update availability
            </button>
          </div>
        </article>

        <article className="card">
          <span className="mini-label">What the candidate needs</span>
          <ul className="simple-list">
            {profileItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <article className="card">
          <span className="mini-label">Quick profile form</span>
          <div className="form-grid">
            <label>
              <span className="field-label">Primary role</span>
              <input defaultValue="Warehouse Associate" />
            </label>
            <label>
              <span className="field-label">Location</span>
              <input defaultValue="New York City" />
            </label>
            <label>
              <span className="field-label">Expected pay</span>
              <input defaultValue="$19/hr" />
            </label>
            <label>
              <span className="field-label">Availability</span>
              <input defaultValue="Ready today" />
            </label>
          </div>
        </article>

        <article className="card">
          <span className="mini-label">Why this side should stay simple</span>
          <div className="metric-stack">
            <div>
              <strong>1 profile</strong>
              <p>Workers should fill one card, not long forms.</p>
            </div>
            <div>
              <strong>1 tap status</strong>
              <p>Ready now should be fast to update.</p>
            </div>
            <div>
              <strong>Clear visibility</strong>
              <p>Workers need to know when employers saved or called.</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function EmployerDashboard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [lastAction, setLastAction] = useState("No action yet");

  const currentCandidate = candidates[currentIndex];
  const remainingCount = candidates.length - currentIndex - 1;

  const employerMetrics = useMemo(
    () => [
      { label: "Requirement", value: "Warehouse helper" },
      { label: "Urgency", value: "Need today" },
      { label: "Shown now", value: currentCandidate ? "1 best match" : "No more matches" },
    ],
    [currentCandidate],
  );

  function moveNext(actionText, saveCurrent = false) {
    if (!currentCandidate) {
      return;
    }

    if (saveCurrent) {
      setSavedCandidates((existing) =>
        existing.some((candidate) => candidate.id === currentCandidate.id)
          ? existing
          : [...existing, currentCandidate],
      );
    }

    setLastAction(`${actionText}: ${currentCandidate.name}`);
    setCurrentIndex((index) => Math.min(index + 1, candidates.length));
  }

  return (
    <section className="dashboard-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Employer dashboard</p>
          <h2>Post one need, review one candidate at a time</h2>
        </div>
        <span className="status-pill warning">Matching is live</span>
      </div>

      <div className="dashboard-grid employer-grid">
        <article className="card">
          <span className="mini-label">New requirement</span>
          <div className="form-grid">
            <label>
              <span className="field-label">Job title</span>
              <input defaultValue="Warehouse helper" />
            </label>
            <label>
              <span className="field-label">Urgency</span>
              <input defaultValue="Need today" />
            </label>
            <label>
              <span className="field-label">Pay range</span>
              <input defaultValue="$18 to $21/hr" />
            </label>
            <label>
              <span className="field-label">Location</span>
              <input defaultValue="Brooklyn, NY" />
            </label>
          </div>

          <div className="tag-row">
            <span className="tag">Packing</span>
            <span className="tag">Inventory</span>
            <span className="tag">Can lift 30 lb</span>
          </div>

          <ul className="simple-list compact">
            {requirementItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card candidate-match-card">
          {currentCandidate ? (
            <>
              <div className="card-top">
                <div>
                  <span className="mini-label">Best match now</span>
                  <h3>{currentCandidate.name}</h3>
                  <p>
                    {currentCandidate.role} • {currentCandidate.location}
                  </p>
                </div>
                <div className="score-badge">
                  <span>Match</span>
                  <strong>{currentCandidate.matchScore}%</strong>
                </div>
              </div>

              <div className="info-pairs">
                <div>
                  <span className="field-label">Distance</span>
                  <strong>{currentCandidate.distance}</strong>
                </div>
                <div>
                  <span className="field-label">Pay</span>
                  <strong>{currentCandidate.pay}</strong>
                </div>
                <div>
                  <span className="field-label">Availability</span>
                  <strong>{currentCandidate.availability}</strong>
                </div>
                <div>
                  <span className="field-label">Why matched</span>
                  <strong>{currentCandidate.reason}</strong>
                </div>
              </div>

              <div className="tag-row">
                {currentCandidate.skills.map((skill) => (
                  <span className="tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>

              <div className="badge-row">
                {currentCandidate.badges.map((badge) => (
                  <span className="status-pill" key={badge}>
                    {badge}
                  </span>
                ))}
              </div>

              <div className="action-row">
                <button
                  className="button button-primary"
                  onClick={() => moveNext("Call now")}
                  type="button"
                >
                  Call now
                </button>
                <button
                  className="button button-soft"
                  onClick={() => moveNext("Save", true)}
                  type="button"
                >
                  Save
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => moveNext("Pass")}
                  type="button"
                >
                  Pass
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span className="mini-label">Matching complete</span>
              <h3>No more candidates right now</h3>
              <p>Update the requirement or wait for new ready-now profiles.</p>
            </div>
          )}
        </article>
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <article className="card">
          <span className="mini-label">Employer flow</span>
          <div className="metric-grid">
            {employerMetrics.map((item) => (
              <div className="metric-box" key={item.label}>
                <span className="field-label">{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <p className="helper-text">
            Last action: <strong>{lastAction}</strong>
          </p>
          <p className="helper-text">
            Next improvement to add: keep track of pass reasons so the next search
            is smarter, not just the next person in the queue.
          </p>
        </article>

        <article className="card">
          <span className="mini-label">Saved shortlist</span>
          {savedCandidates.length > 0 ? (
            <ul className="simple-list">
              {savedCandidates.map((candidate) => (
                <li key={candidate.id}>
                  {candidate.name} • {candidate.role}
                </li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">No saved candidates yet.</p>
          )}
          <p className="helper-text">
            Remaining unseen matches: <strong>{Math.max(remainingCount, 0)}</strong>
          </p>
        </article>
      </div>
    </section>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("employer");

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">TH</span>
          <span>Turant Hire</span>
        </div>
        <nav className="nav">
          <button
            className={activeView === "employer" ? "nav-switch active" : "nav-switch"}
            onClick={() => setActiveView("employer")}
            type="button"
          >
            Employer
          </button>
          <button
            className={activeView === "candidate" ? "nav-switch active" : "nav-switch"}
            onClick={() => setActiveView("candidate")}
            type="button"
          >
            Candidate
          </button>
        </nav>
      </header>

      <main>
        <section className="hero hero-tight">
          <div className="hero-copy">
            <p className="eyebrow">Quick hiring flow</p>
            <h1>One profile. One requirement. One best match.</h1>
            <p className="hero-text">
              Candidates stay ready with a simple profile. Employers post a need
              and review one strong match at a time with clear actions.
            </p>
            <div className="hero-actions">
              <button
                className="button button-primary"
                onClick={() => setActiveView("employer")}
                type="button"
              >
                Open employer
              </button>
              <button
                className="button button-secondary"
                onClick={() => setActiveView("candidate")}
                type="button"
              >
                Open candidate
              </button>
            </div>
          </div>

          <aside className="hero-panel">
            {activitySeed.map((item) => (
              <div className="metric-card" key={item}>
                <strong>{item}</strong>
              </div>
            ))}
          </aside>
        </section>

        <section className="view-toggle-bar">
          <button
            className={activeView === "employer" ? "toggle-chip active" : "toggle-chip"}
            onClick={() => setActiveView("employer")}
            type="button"
          >
            Employer dashboard
          </button>
          <button
            className={activeView === "candidate" ? "toggle-chip active" : "toggle-chip"}
            onClick={() => setActiveView("candidate")}
            type="button"
          >
            Candidate dashboard
          </button>
        </section>

        {activeView === "employer" ? <EmployerDashboard /> : <CandidateDashboard />}
      </main>
    </div>
  );
}
