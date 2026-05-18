import { useMemo, useState } from "react";

const roleOptions = ["Waiter", "Receptionist", "Cashier", "Sales Executive", "Delivery Associate"];
const availabilityOptions = ["Today", "Tomorrow", "This week", "Weekends only"];

export function CandidateOnboarding({ initialEmail, authUserId, onSave, isSaving }) {
  const [form, setForm] = useState({
    auth_user_id: authUserId,
    email: initialEmail,
    full_name: "",
    phone: "",
    primary_role: roleOptions[0],
    location: "",
    expected_pay: "",
    availability: availabilityOptions[0],
    is_ready_now: true,
    profile_summary: "",
  });

  const progress = useMemo(() => {
    const checks = [
      form.full_name,
      form.phone,
      form.primary_role,
      form.location,
      form.expected_pay,
      form.availability,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [form]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <div className="candidate-shell">
      <section className="candidate-panel candidate-hero-panel">
        <div>
          <span className="candidate-kicker">Candidate setup</span>
          <h1>Complete your ready-to-work profile.</h1>
          <p>
            Keep this short. We only need the basics first so you can start getting urgent matches.
          </p>
        </div>
        <div className="candidate-progress-card">
          <strong>{progress}% complete</strong>
          <span>One fast setup, then quick availability updates.</span>
        </div>
      </section>

      <form className="candidate-panel candidate-form" onSubmit={handleSubmit}>
        <section className="candidate-form-section">
          <div className="candidate-section-head">
            <span className="candidate-kicker">About you</span>
            <h2>Basic identity</h2>
          </div>

          <div className="candidate-grid">
            <label>
              Full name
              <input onChange={(event) => updateField("full_name", event.target.value)} value={form.full_name} />
            </label>
            <label>
              Email
              <input disabled value={form.email} />
            </label>
            <label>
              Phone
              <input onChange={(event) => updateField("phone", event.target.value)} value={form.phone} />
            </label>
            <label>
              Primary role
              <select onChange={(event) => updateField("primary_role", event.target.value)} value={form.primary_role}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="candidate-form-section">
          <div className="candidate-section-head">
            <span className="candidate-kicker">Job fit</span>
            <h2>Location, pay, and timing</h2>
          </div>

          <div className="candidate-grid">
            <label>
              Location
              <input onChange={(event) => updateField("location", event.target.value)} value={form.location} />
            </label>
            <label>
              Expected pay
              <input onChange={(event) => updateField("expected_pay", event.target.value)} value={form.expected_pay} />
            </label>
            <label>
              Availability
              <select onChange={(event) => updateField("availability", event.target.value)} value={form.availability}>
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
                checked={form.is_ready_now}
                onChange={(event) => updateField("is_ready_now", event.target.checked)}
                type="checkbox"
              />
            </label>
          </div>

          <label>
            Short summary
            <textarea
              onChange={(event) => updateField("profile_summary", event.target.value)}
              placeholder="Example: Front-desk candidate available for immediate morning shifts."
              rows="4"
              value={form.profile_summary}
            />
          </label>
        </section>

        <div className="candidate-actions">
          <button className="candidate-button" disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
