import { useEffect, useMemo, useState } from "react";
import { AuthScreen, getSupabaseBrowserClient } from "auth-ui";

import { ensureAppUser } from "./lib/userApi";
import "./employer.css";

const employerProfileFields = [
  "company_name",
  "industry",
  "company_size",
  "locations",
  "employee_count",
  "hiring_team_size",
  "monthly_hiring_volume",
  "primary_contact_name",
  "primary_contact_email",
  "primary_contact_phone",
];

const industryOptions = [
  "Information Technology",
  "Hospitality",
  "Retail",
  "Logistics",
  "Healthcare",
];

const companySizeOptions = [
  "1 - 10 employees",
  "11 - 50 employees",
  "51 - 200 employees",
  "201 - 500 employees",
  "500+ employees",
];

const hiringVolumeOptions = [
  "1 - 5",
  "6 - 10",
  "11 - 25",
  "26 - 50",
  "50+",
];

function getStorageKey(authUserId) {
  return `turant_hire_employer_profile_${authUserId}`;
}

function validateEmployerProfile(form) {
  if (!form.company_name.trim()) {
    return "Enter your company or organization name.";
  }
  if (!form.locations.trim()) {
    return "Add at least one hiring location.";
  }
  if (!form.primary_contact_name.trim()) {
    return "Enter the primary contact name.";
  }
  if (!form.primary_contact_email.trim()) {
    return "Enter the work email.";
  }
  return "";
}

function EmployerSidebar({ onSignOut }) {
  const items = [
    { label: "Profile Setup", active: true, icon: "profile" },
    { label: "Hiring Requirements", icon: "briefcase" },
    { label: "Evaluation Pipeline", icon: "pipeline" },
    { label: "Candidates", icon: "candidates" },
    { label: "Reports", icon: "reports" },
    { label: "Settings", icon: "settings" },
  ];

  function renderIcon(type) {
    if (type === "profile") {
      return (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </>
      );
    }
    if (type === "briefcase") {
      return (
        <>
          <rect x="4" y="7" width="16" height="13" rx="2" />
          <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
        </>
      );
    }
    if (type === "pipeline") {
      return (
        <>
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="12" r="2" />
          <circle cx="6" cy="18" r="2" />
          <path d="M8 6h5l3 4" />
          <path d="M8 18h5l3-4" />
        </>
      );
    }
    if (type === "candidates") {
      return (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19a6 6 0 0 1 11 0" />
          <circle cx="17" cy="9" r="2.4" />
          <path d="M15 18a4.8 4.8 0 0 1 5.5-3.6" />
        </>
      );
    }
    if (type === "reports") {
      return (
        <>
          <path d="M5 20V9" />
          <path d="M12 20V4" />
          <path d="M19 20v-7" />
        </>
      );
    }
    return (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 .9-1.4V3a2 2 0 0 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.4.9H21a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1Z" />
      </>
    );
  }

  return (
    <aside className="employer-sidebar">
      <div className="employer-brand">
        <svg className="employer-brand-mark" width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <div>
          <div className="employer-brand-wordmark">TURANT<span>HIRE</span></div>
          <div className="employer-brand-subtitle">Hiring Intelligence Platform</div>
        </div>
      </div>

      <nav className="employer-nav">
        {items.map((item) => (
          <button key={item.label} className={`employer-nav-item ${item.active ? "active" : ""}`} type="button">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              {renderIcon(item.icon)}
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="employer-support-card">
        <div className="employer-support-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1H7a3 3 0 0 1-3-3v-2a8 8 0 1 1 16 0v2a3 3 0 0 1-3 3h-2v1Z" />
          </svg>
        </div>
        <div className="employer-support-title">Need help?</div>
        <div className="employer-support-copy">Our team is here to help you get started.</div>
        <button className="employer-support-button" onClick={onSignOut} type="button">
          Contact Support
        </button>
      </div>
    </aside>
  );
}

function ProfileMatterCard() {
  const items = [
    {
      title: "Better Requirement Interpretation",
      body: "We understand your context to capture the right hiring needs.",
      icon: (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="m12 8 2 4-4 1 2-5Z" />
        </>
      ),
    },
    {
      title: "Better Candidate Matching",
      body: "Match with the most relevant, qualified, and available candidates.",
      icon: (
        <>
          <circle cx="8" cy="9" r="2.5" />
          <circle cx="16" cy="9" r="2.5" />
          <path d="M3.5 18a5.2 5.2 0 0 1 9 0" />
          <path d="M11.5 18a5.2 5.2 0 0 1 9 0" />
        </>
      ),
    },
    {
      title: "Better Screening Workflows",
      body: "Our agents run smarter interviews and evaluations based on your hiring standards.",
      icon: (
        <>
          <path d="M5 18V9" />
          <path d="M10 18V6" />
          <path d="M15 18v-4" />
          <path d="M20 18V3" />
        </>
      ),
    },
    {
      title: "Trusted & Secure",
      body: "We keep your data private and never share it with anyone.",
      icon: (
        <>
          <path d="M12 21s7-3.5 7-9V6l-7-3-7 3v6c0 5.5 7 9 7 9Z" />
        </>
      ),
    },
  ];

  return (
    <aside className="employer-matters-card">
      <div className="employer-matters-head">
        <div className="employer-matters-head-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3 2.5 5.1 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" />
          </svg>
        </div>
        <div>
          <h3>Why this profile matters</h3>
          <p>Your profile helps TurantHire's AI agents understand your organization and hiring needs better.</p>
        </div>
      </div>

      <div className="employer-matters-list">
        {items.map((item) => (
          <div className="employer-matter-item" key={item.title}>
            <div className="employer-matter-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
            </div>
            <div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function EmployerProfileSetup({ authUserId, email }) {
  const [form, setForm] = useState({
    company_name: "",
    industry: industryOptions[0],
    company_size: companySizeOptions[2],
    locations: "Mumbai, Maharashtra, Bengaluru, Karnataka",
    employee_count: "",
    hiring_team_size: "",
    monthly_hiring_volume: hiringVolumeOptions[1],
    primary_contact_name: "",
    primary_contact_email: email,
    primary_contact_phone: "",
    current_process_note: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(getStorageKey(authUserId));
      if (!saved) {
        return;
      }
      const parsed = JSON.parse(saved);
      setForm((current) => ({
        ...current,
        ...parsed,
        primary_contact_email: parsed.primary_contact_email || email,
      }));
      setMessage("Loaded your saved employer profile.");
    } catch {
      setMessage("");
    }
  }, [authUserId, email]);

  const completionPercent = useMemo(() => {
    const completed = employerProfileFields.filter((field) => String(form[field] ?? "").trim()).length;
    return Math.round((completed / employerProfileFields.length) * 100);
  }, [form]);

  const locationTags = useMemo(
    () =>
      form.locations
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [form.locations],
  );

  function updateField(key, value) {
    setError("");
    setMessage("");
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave(event) {
    event.preventDefault();
    const validationError = validateEmployerProfile(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    window.localStorage.setItem(getStorageKey(authUserId), JSON.stringify(form));
    setMessage("Profile saved. You can continue to requirements when ready.");
  }

  return (
    <div className="employer-layout">
      <EmployerSidebar onSignOut={() => {}} />

      <main className="employer-main">
        <div className="employer-topbar">
          <div className="employer-topbar-left">
            <div className="employer-topbar-title">Profile Setup</div>
            <div className="employer-stepper">
              <span className="employer-step active">1</span>
              <span className="employer-step-line" />
              <span className="employer-step">2</span>
              <span className="employer-step-line" />
              <span className="employer-step">3</span>
              <span className="employer-step-copy">Complete your profile to start defining hiring needs</span>
            </div>
          </div>

          <div className="employer-topbar-right">
            <div className="employer-account-chip">
              <div className="employer-account-avatar">
                {form.company_name.trim()
                  ? form.company_name.trim().slice(0, 2).toUpperCase()
                  : (email || "AC").slice(0, 2).toUpperCase()}
              </div>
              <div className="employer-account-copy">
                <strong>{form.company_name || "Employer Account"}</strong>
                <span>Employer Account</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <button className="employer-icon-button" type="button">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="employer-notification-dot" />
            </button>
            <div className="employer-user-avatar">👨🏻</div>
          </div>
        </div>

        {error ? <div className="employer-banner employer-banner-error">{error}</div> : null}
        {message ? <div className="employer-banner employer-banner-success">{message}</div> : null}

        <div className="employer-page-heading">
          <h1>Set up your hiring profile</h1>
          <p>Help TurantHire understand your organization so we can tailor screening and evaluation for you.</p>
        </div>

        <div className="employer-content-grid">
          <form className="employer-form-card" onSubmit={handleSave}>
            <div className="employer-form-card-head">
              <div className="employer-form-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20h16" />
                  <path d="M6 20V8.5A1.5 1.5 0 0 1 7.5 7H11v13" />
                  <path d="M11 5.5A1.5 1.5 0 0 1 12.5 4H16a1.5 1.5 0 0 1 1.5 1.5V20" />
                  <path d="M8.5 11h.01" />
                  <path d="M8.5 14h.01" />
                  <path d="M14.5 8h.01" />
                  <path d="M14.5 11h.01" />
                </svg>
              </div>
              <div className="employer-form-card-title">Company Information</div>
            </div>

            <div className="employer-form-grid">
              <label>
                <span className="employer-label-text">Company / Organization Name <span>*</span></span>
                <input
                  onChange={(event) => updateField("company_name", event.target.value)}
                  value={form.company_name}
                />
              </label>
              <label>
                <span className="employer-label-text">Industry <span>*</span></span>
                <select onChange={(event) => updateField("industry", event.target.value)} value={form.industry}>
                  {industryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="employer-label-text">Company Size <span>*</span></span>
                <select onChange={(event) => updateField("company_size", event.target.value)} value={form.company_size}>
                  {companySizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="employer-wide-field employer-locations-field">
              <span className="employer-label-text">Primary Hiring Locations <span>*</span></span>
              <div className="employer-location-box">
                <div className="employer-location-tags">
                  {locationTags.map((tag) => (
                    <span className="employer-location-tag" key={tag}>
                      {tag}
                      <button onClick={() => {}} type="button">×</button>
                    </span>
                  ))}
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              <input
                className="employer-hidden-input"
                onChange={(event) => updateField("locations", event.target.value)}
                value={form.locations}
              />
              <div className="employer-field-note">Add all major locations where you hire.</div>
            </label>

            <div className="employer-form-grid">
              <label>
                <span className="employer-label-text">Total Employees <span>*</span></span>
                <input onChange={(event) => updateField("employee_count", event.target.value)} value={form.employee_count} />
              </label>
              <label>
                <span className="employer-label-text">Hiring Team Size <span>*</span></span>
                <input onChange={(event) => updateField("hiring_team_size", event.target.value)} value={form.hiring_team_size} />
              </label>
              <label>
                <span className="employer-label-text">Monthly Hiring Volume <span>*</span></span>
                <select onChange={(event) => updateField("monthly_hiring_volume", event.target.value)} value={form.monthly_hiring_volume}>
                  {hiringVolumeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="employer-form-grid">
              <label>
                <span className="employer-label-text">Primary Contact Name <span>*</span></span>
                <input onChange={(event) => updateField("primary_contact_name", event.target.value)} value={form.primary_contact_name} />
              </label>
              <label>
                <span className="employer-label-text">Work Email <span>*</span></span>
                <input onChange={(event) => updateField("primary_contact_email", event.target.value)} type="email" value={form.primary_contact_email} />
              </label>
              <label>
                <span className="employer-label-text">Phone Number <span>*</span></span>
                <input onChange={(event) => updateField("primary_contact_phone", event.target.value)} value={form.primary_contact_phone} />
              </label>
            </div>

            <label className="employer-wide-field">
              Tell us about your current hiring process (optional)
              <textarea
                onChange={(event) => updateField("current_process_note", event.target.value)}
                rows="4"
                value={form.current_process_note}
              />
              <div className="employer-field-note">This helps our AI agents design better screening and evaluation workflows.</div>
            </label>

            <div className="employer-security-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 1 1 8 0v3" />
              </svg>
              <span>Your information is secure and will only be used to improve hiring outcomes.</span>
            </div>
          </form>

          <ProfileMatterCard />
        </div>

        <div className="employer-bottom-bar">
          <div className="employer-bottom-left">
            <button className="employer-secondary-action" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l5 5v11a2 2 0 0 1-2 2Z" />
                <path d="M14 3v6h6" />
              </svg>
              Save for Later
            </button>
            <span className="employer-bottom-note">You can complete this anytime.</span>
          </div>

          <div className="employer-bottom-actions">
            <button className="employer-plain-action" onClick={handleSave} type="button">
              Save Profile
            </button>
            <button className="employer-primary-action" type="submit" form={undefined} onClick={handleSave}>
              Continue to Requirements
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
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

  if (!session) {
    return (
      <AuthScreen
        audienceLabel="Employer"
        heading="Employer sign in"
        subheading="Sign in to set up your hiring profile and define the right evaluation workflow."
        googleRedirectTo={window.location.origin}
        allowEmailAuth={false}
      />
    );
  }

  if (isChecking) {
    return (
      <div className="employer-loading-shell">
        <div className="employer-loading-card">Checking employer account...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employer-loading-shell">
        <div className="employer-loading-card employer-error-card">{error}</div>
      </div>
    );
  }

  return <EmployerProfileSetup authUserId={session.user.id} email={session.user.email ?? ""} />;
}
