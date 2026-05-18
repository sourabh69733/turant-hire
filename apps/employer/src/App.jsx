import { useEffect, useMemo, useState } from "react";
import { AuthScreen, getSupabaseBrowserClient } from "auth-ui";

import { createRequirement, listRequirements } from "./lib/requirementApi";
import { ensureAppUser } from "./lib/userApi";
import "./employer.css";

const urgencyOptions = ["Need today", "Need tomorrow", "This week", "Planning ahead"];

function EmployerWorkspace({ email, authUserId, onSignOut }) {
  const [requirements, setRequirements] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    employer_auth_user_id: authUserId,
    employer_email: email,
    company_name: "",
    hiring_role: "",
    location: "",
    urgency: urgencyOptions[0],
    compensation: "",
    openings: 1,
    notes: "",
  });

  useEffect(() => {
    async function loadRequirements() {
      try {
        const data = await listRequirements(authUserId);
        setRequirements(data);
      } catch (nextError) {
        setError(nextError.message);
      }
    }

    loadRequirements();
  }, [authUserId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const requirement = await createRequirement({
        ...form,
        openings: Number(form.openings),
      });
      setRequirements((current) => [requirement, ...current]);
      setForm((current) => ({
        ...current,
        company_name: current.company_name,
        hiring_role: "",
        location: "",
        urgency: urgencyOptions[0],
        compensation: "",
        openings: 1,
        notes: "",
      }));
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setIsSaving(false);
    }
  }

  const latestRequirement = requirements[0] ?? null;

  return (
    <div className="employer-shell">
      {error ? <div className="employer-banner">{error}</div> : null}

      <section className="employer-panel employer-hero">
        <div>
          <span className="employer-kicker">Employer workspace</span>
          <h1>Post your first urgent requirement.</h1>
          <p className="employer-muted">
            Keep it short. We only need enough to find the best next candidate fast.
          </p>
        </div>
        <div className="employer-side-card">
          <strong>Signed in</strong>
          <span>{email}</span>
          <span>{requirements.length} requirement{requirements.length === 1 ? "" : "s"} submitted</span>
        </div>
      </section>

      <div className="employer-grid">
        <form className="employer-panel employer-form" onSubmit={handleSubmit}>
          <div>
            <span className="employer-kicker">Requirement form</span>
            <h2>Create first requirement</h2>
          </div>

          <div className="employer-form-grid">
            <label>
              Company name
              <input onChange={(event) => updateField("company_name", event.target.value)} value={form.company_name} />
            </label>
            <label>
              Hiring role
              <input onChange={(event) => updateField("hiring_role", event.target.value)} value={form.hiring_role} />
            </label>
            <label>
              Location
              <input onChange={(event) => updateField("location", event.target.value)} value={form.location} />
            </label>
            <label>
              Urgency
              <select onChange={(event) => updateField("urgency", event.target.value)} value={form.urgency}>
                {urgencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Compensation
              <input onChange={(event) => updateField("compensation", event.target.value)} value={form.compensation} />
            </label>
            <label>
              Openings
              <input min="1" onChange={(event) => updateField("openings", event.target.value)} type="number" value={form.openings} />
            </label>
          </div>

          <label>
            Notes
            <textarea
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Example: Need candidates comfortable with walk-in customers and weekend shifts."
              rows="4"
              value={form.notes}
            />
          </label>

          <div className="employer-actions">
            <button className="employer-button" disabled={isSaving} type="submit">
              {isSaving ? "Submitting..." : "Submit requirement"}
            </button>
            <button className="employer-link" onClick={onSignOut} type="button">
              Sign out
            </button>
          </div>
        </form>

        <section className="employer-summary">
          <div className="employer-panel employer-summary-card">
            <span className="employer-kicker">Latest</span>
            <strong>{latestRequirement ? latestRequirement.hiring_role : "No requirement yet"}</strong>
            <p className="employer-muted">
              {latestRequirement
                ? `${latestRequirement.company_name} · ${latestRequirement.location} · ${latestRequirement.urgency}`
                : "Your first submitted requirement will appear here."}
            </p>
          </div>

          <div className="employer-panel employer-summary-card">
            <span className="employer-kicker">Submitted requirements</span>
            <div className="employer-list">
              {requirements.length ? (
                requirements.map((requirement) => (
                  <div className="employer-list-item" key={requirement.id}>
                    <strong>{requirement.hiring_role}</strong>
                    <div className="employer-muted">
                      {requirement.company_name} · {requirement.location} · {requirement.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="employer-muted">No requirements submitted yet.</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }
      setSession(data.session);
      setIsChecking(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    async function verifyEmployerRole() {
      if (!session?.user?.id) {
        return;
      }

      setIsChecking(true);
      setError("");

      try {
        await ensureAppUser({
          auth_user_id: session.user.id,
          email: session.user.email ?? "",
          role: "employer",
        });
      } catch (nextError) {
        setError(nextError.message);
      } finally {
        setIsChecking(false);
      }
    }

    verifyEmployerRole();
  }, [session?.user?.email, session?.user?.id]);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <AuthScreen
        audienceLabel="Employer"
        heading="Employer sign in"
        subheading="Sign in first, then post your urgent requirement."
        googleRedirectTo={window.location.origin}
        allowEmailAuth={false}
      />
    );
  }

  if (isChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div>Checking employer account...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#fff7ed", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{ maxWidth: 720, padding: 24, borderRadius: 20, background: "#fff", border: "1px solid #fed7aa" }}>
          <h2 style={{ marginTop: 0 }}>Access blocked</h2>
          <p>{error}</p>
          <button onClick={handleSignOut} style={{ border: 0, borderRadius: 12, minHeight: 44, padding: "0 16px", background: "#111827", color: "#fff", cursor: "pointer" }} type="button">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <EmployerWorkspace
      authUserId={session.user.id}
      email={session.user.email ?? ""}
      onSignOut={handleSignOut}
    />
  );
}
