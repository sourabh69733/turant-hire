import { useState } from "react";

const availabilityOptions = ["Today", "Tomorrow", "This week", "Weekends only"];

export function CandidateDashboard({ profile, onProfileSave, onAvailabilitySave, onSignOut, isSaving }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    full_name: profile.full_name,
    primary_role: profile.primary_role,
    location: profile.location,
    expected_pay: profile.expected_pay,
    profile_summary: profile.profile_summary,
  });
  const [availabilityDraft, setAvailabilityDraft] = useState({
    availability: profile.availability,
    is_ready_now: profile.is_ready_now,
  });

  function saveProfile(event) {
    event.preventDefault();
    onProfileSave(profileDraft).then(() => setIsEditingProfile(false));
  }

  function saveAvailability(event) {
    event.preventDefault();
    onAvailabilitySave(availabilityDraft).then(() => setIsEditingAvailability(false));
  }

  return (
    <div className="candidate-shell">
      <section className="candidate-panel candidate-hero-panel">
        <div>
          <span className="candidate-kicker">Profile overview</span>
          <h1>{profile.full_name}</h1>
          <p>{profile.primary_role} in {profile.location}</p>
        </div>
        <div className={`candidate-status-card ${profile.is_ready_now ? "is-ready" : ""}`}>
          <strong>{profile.is_ready_now ? "Ready now" : "Not ready now"}</strong>
          <span>{profile.availability}</span>
        </div>
      </section>

      <section className="candidate-grid candidate-summary-grid">
        <article className="candidate-panel">
          <div className="candidate-section-head">
            <span className="candidate-kicker">Core details</span>
            <h2>Match basics</h2>
          </div>
          <div className="candidate-detail-list">
            <div><span>Phone</span><strong>{profile.phone}</strong></div>
            <div><span>Expected pay</span><strong>{profile.expected_pay}</strong></div>
            <div><span>Availability</span><strong>{profile.availability}</strong></div>
            <div><span>Email</span><strong>{profile.email}</strong></div>
          </div>
          <button className="candidate-link" onClick={() => setIsEditingProfile((value) => !value)} type="button">
            {isEditingProfile ? "Close profile edit" : "Edit profile"}
          </button>
        </article>

        <article className="candidate-panel">
          <div className="candidate-section-head">
            <span className="candidate-kicker">Readiness</span>
            <h2>Quick availability</h2>
          </div>
          <p className="candidate-summary">{profile.profile_summary || "Add a short summary to improve matching quality."}</p>
          <button className="candidate-button candidate-button-secondary" onClick={() => setIsEditingAvailability((value) => !value)} type="button">
            {isEditingAvailability ? "Close availability edit" : "Update availability"}
          </button>
        </article>
      </section>

      {isEditingProfile ? (
        <form className="candidate-panel candidate-form-inline" onSubmit={saveProfile}>
          <div className="candidate-section-head">
            <span className="candidate-kicker">Edit profile</span>
            <h2>Update your match details</h2>
          </div>
          <div className="candidate-grid">
            <label>
              Full name
              <input
                onChange={(event) => setProfileDraft((current) => ({ ...current, full_name: event.target.value }))}
                value={profileDraft.full_name}
              />
            </label>
            <label>
              Primary role
              <input
                onChange={(event) => setProfileDraft((current) => ({ ...current, primary_role: event.target.value }))}
                value={profileDraft.primary_role}
              />
            </label>
            <label>
              Location
              <input
                onChange={(event) => setProfileDraft((current) => ({ ...current, location: event.target.value }))}
                value={profileDraft.location}
              />
            </label>
            <label>
              Expected pay
              <input
                onChange={(event) => setProfileDraft((current) => ({ ...current, expected_pay: event.target.value }))}
                value={profileDraft.expected_pay}
              />
            </label>
          </div>
          <label>
            Summary
            <textarea
              onChange={(event) => setProfileDraft((current) => ({ ...current, profile_summary: event.target.value }))}
              rows="4"
              value={profileDraft.profile_summary}
            />
          </label>
          <div className="candidate-actions">
            <button className="candidate-button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save profile changes"}
            </button>
          </div>
        </form>
      ) : null}

      {isEditingAvailability ? (
        <form className="candidate-panel candidate-form-inline" onSubmit={saveAvailability}>
          <div className="candidate-section-head">
            <span className="candidate-kicker">Availability</span>
            <h2>Keep your status fresh</h2>
          </div>
          <div className="candidate-grid">
            <label>
              Availability
              <select
                onChange={(event) => setAvailabilityDraft((current) => ({ ...current, availability: event.target.value }))}
                value={availabilityDraft.availability}
              >
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="candidate-toggle">
              <span>Ready now</span>
              <input
                checked={availabilityDraft.is_ready_now}
                onChange={(event) => setAvailabilityDraft((current) => ({ ...current, is_ready_now: event.target.checked }))}
                type="checkbox"
              />
            </label>
          </div>
          <div className="candidate-actions candidate-actions-spread">
            <button className="candidate-button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save availability"}
            </button>
            <button className="candidate-link" onClick={onSignOut} type="button">
              Sign out
            </button>
          </div>
        </form>
      ) : (
        <div className="candidate-actions candidate-actions-right">
          <button className="candidate-link" onClick={onSignOut} type="button">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
