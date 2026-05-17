import { profileSections, roleCards, workHistory } from "../data"

export default function CandidatePage() {
  return (
    <div className="site-shell">
      <header className="site-header candidate-header">
        <div>
          <p className="eyebrow">Candidate Workspace</p>
          <h1>Keep your profile ready for the next urgent role.</h1>
        </div>
        <div className="domain-note">
          <p className="eyebrow">Candidate</p>
          <p>Single profile, active availability, clean job-fit details.</p>
        </div>
      </header>

      <main className="candidate-main">
        <section className="candidate-hero panel">
          <div className="candidate-hero-copy">
            <p className="section-kicker">Profile status</p>
            <div className="candidate-identity">
              <div className="candidate-avatar">RS</div>
              <div>
                <h2>Riya Sharma</h2>
                <p className="subtle">
                  Service-focused worker open to fast-moving local roles.
                </p>
              </div>
            </div>

            <div className="pill-row">
              <span className="pill">Ready now</span>
              <span className="pill">Verified phone</span>
              <span className="pill">Weekend available</span>
            </div>
          </div>

          <div className="profile-grid">
            {profileSections.map((item) => (
              <div className="info-tile" key={item.label}>
                <span className="detail-label">{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="candidate-sections">
          <article className="panel">
            <div className="section-head">
              <div>
                <p className="section-kicker">Role preferences</p>
                <h3>Roles you want to be matched for</h3>
              </div>
            </div>
            <div className="card-grid">
              {roleCards.map((card) => (
                <div className="role-preference-card" key={card.title}>
                  <strong>{card.title}</strong>
                  <p className="subtle">{card.note}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="section-head">
              <div>
                <p className="section-kicker">Experience</p>
                <h3>Recent work history</h3>
              </div>
            </div>
            <div className="timeline">
              {workHistory.map((item) => (
                <div className="timeline-item" key={`${item.place}-${item.role}`}>
                  <span className="timeline-dot" />
                  <div>
                    <strong>{item.role}</strong>
                    <p>{item.place}</p>
                    <p className="subtle">{item.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="section-head">
              <div>
                <p className="section-kicker">Availability</p>
                <h3>Current work readiness</h3>
              </div>
            </div>
            <div className="availability-layout">
              <div className="availability-card">
                <span className="detail-label">Preferred shifts</span>
                <strong>Evening, Weekend, Split shift</strong>
              </div>
              <div className="availability-card">
                <span className="detail-label">Travel</span>
                <strong>Brooklyn, Lower Manhattan</strong>
              </div>
              <div className="availability-card">
                <span className="detail-label">Start date</span>
                <strong>Immediate</strong>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
