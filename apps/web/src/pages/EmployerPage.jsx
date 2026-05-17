export default function EmployerPage() {
  return (
    <div className="site-shell">
      <header className="site-header candidate-header">
        <div>
          <p className="eyebrow">Employer Workspace</p>
          <h1>Employer requirement flow is being prepared separately.</h1>
        </div>
        <div className="domain-note">
          <p className="eyebrow">Employer</p>
          <p>This route will handle requirement capture and ranked candidate matching.</p>
        </div>
      </header>

      <main className="candidate-main">
        <section className="panel">
          <p className="section-kicker">Next build step</p>
          <h2>Requirement form and matching engine.</h2>
          <p className="subtle">
            This module stays separate from the candidate experience so the two
            products can evolve independently for `employer.turanthire.com` and
            `candidate.turanthire.com`.
          </p>
        </section>
      </main>
    </div>
  );
}
