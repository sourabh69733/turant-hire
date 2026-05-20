import { useEffect, useMemo, useRef, useState } from "react";
import { AuthScreen, getSupabaseBrowserClient } from "auth-ui";

import { createRequirement } from "./lib/requirementApi";
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

const requirementFields = [
  "hiring_role",
  "openings",
  "department",
  "work_mode",
  "location",
  "employment_type",
  "joining_timeline",
  "compensation",
  "experience",
  "must_have_skills",
  "language_requirements",
  "communication_expectation",
  "screening_questions",
  "disqualifiers",
  "ideal_candidate_notes",
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

const hiringVolumeOptions = ["1 - 5", "6 - 10", "11 - 25", "26 - 50", "50+"];
const workModeOptions = ["On-site", "Hybrid", "Remote"];
const employmentTypeOptions = ["Full-time", "Part-time", "Contract", "Temporary"];
const timelineOptions = ["Immediate", "Within 2 weeks", "Within 1 month", "Planning ahead"];
const priorityOptions = ["Critical", "Priority", "Standard"];

function getProfileStorageKey(authUserId) {
  return `turant_hire_employer_profile_${authUserId}`;
}

function getRequirementStorageKey(authUserId) {
  return `turant_hire_employer_requirement_${authUserId}`;
}

function validateEmployerProfile(form) {
  if (!form.company_name.trim()) {
    return "Enter your company or organization name.";
  }
  if (!form.industry.trim()) {
    return "Select your industry.";
  }
  if (!form.company_size.trim()) {
    return "Select your company size.";
  }
  if (!form.locations.trim()) {
    return "Add at least one hiring location.";
  }
  if (!form.employee_count.trim()) {
    return "Enter your total employee count.";
  }
  if (!form.hiring_team_size.trim()) {
    return "Enter your hiring team size.";
  }
  if (!form.monthly_hiring_volume.trim()) {
    return "Select your monthly hiring volume.";
  }
  if (!form.primary_contact_name.trim()) {
    return "Enter the primary contact name.";
  }
  if (!form.primary_contact_email.trim()) {
    return "Enter the work email.";
  }
  if (!form.primary_contact_phone.trim()) {
    return "Enter the contact phone number.";
  }
  return "";
}

function validateRequirementForm(form) {
  if (!form.hiring_role.trim()) {
    return "Enter the role title.";
  }
  if (!String(form.openings).trim()) {
    return "Enter the number of openings.";
  }
  if (!form.work_mode.trim()) {
    return "Select the work mode.";
  }
  if (!form.location.trim()) {
    return "Enter the work location.";
  }
  if (!form.employment_type.trim()) {
    return "Select the employment type.";
  }
  if (!form.joining_timeline.trim()) {
    return "Select the joining timeline.";
  }
  if (!form.compensation.trim()) {
    return "Enter the compensation range.";
  }
  if (!form.experience.trim()) {
    return "Enter the minimum experience required.";
  }
  if (!form.must_have_skills.trim()) {
    return "Add the must-have skills.";
  }
  return "";
}

function splitCommaValues(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLineValues(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Choose an image file to continue."));
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Only image files can be uploaded here."));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      reject(new Error("Please upload an image smaller than 2 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("We could not read that image file."));
    reader.readAsDataURL(file);
  });
}

function EmployerSidebar({ activeTab, onSupportClick, onTabChange }) {
  const items = [
    { id: "profile", label: "Profile Setup", icon: "profile" },
    { id: "requirements", label: "Hiring Requirements", icon: "briefcase" },
    { id: "review", label: "Evaluation Pipeline", icon: "pipeline" },
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
          <button
            key={item.label}
            className={`employer-nav-item ${activeTab === item.id ? "active" : ""} ${item.disabled ? "disabled" : ""}`}
            onClick={() => {
              if (!item.disabled) {
                onTabChange(item.id);
              }
            }}
            type="button"
          >
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
        <button className="employer-support-button" onClick={onSupportClick} type="button">
          Contact Support
        </button>
      </div>
    </aside>
  );
}

function TopBar({ companyLogoUrl, companyName, email, onAccountClick, onBellClick, onPhotoClick, onSignOut, profilePhotoUrl, step }) {
  const steps = [1, 2, 3];
  const titleMap = {
    1: "Profile Setup",
    2: "Hiring Requirements",
    3: "Review & Start Evaluation",
  };

  return (
    <div className="employer-topbar">
      <div className="employer-topbar-left">
        <div className="employer-topbar-title">{titleMap[step]}</div>
        <div className="employer-stepper">
          {steps.map((item, index) => (
            <div className="employer-stepper-group" key={item}>
              <span className={`employer-step ${step === item ? "active" : ""}`}>{item}</span>
              {index < steps.length - 1 ? <span className="employer-step-line" /> : null}
            </div>
          ))}
          <span className="employer-step-copy">
            {step === 1 && "Complete your profile to start defining hiring needs"}
            {step === 2 && "Define what success looks like for this role"}
            {step === 3 && "Review the screening blueprint before evaluation starts"}
          </span>
        </div>
      </div>

      <div className="employer-topbar-right">
        <button className="employer-account-chip" onClick={onAccountClick} type="button">
          <div className="employer-account-avatar">
            {companyLogoUrl ? <img alt="Company logo" src={companyLogoUrl} /> : (companyName || email || "AC").slice(0, 2).toUpperCase()}
          </div>
          <div className="employer-account-copy">
            <strong>{companyName || "Employer Account"}</strong>
            <span>Employer Account</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <button className="employer-icon-button" onClick={onBellClick} type="button">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="employer-notification-dot" />
        </button>
        <button
          className="employer-user-avatar employer-user-avatar-button"
          onClick={onPhotoClick}
          title="Update profile photo"
          type="button"
        >
          {profilePhotoUrl ? <img alt="Employer profile" src={profilePhotoUrl} /> : "👨🏻"}
        </button>
        <button className="employer-signout-button" onClick={onSignOut} type="button">
          Sign out
        </button>
      </div>
    </div>
  );
}

function MatterIcon({ type }) {
  if (type === "target") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    );
  }
  if (type === "people") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <path d="M4 19a6 6 0 0 1 10 0" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M15.5 18a5 5 0 0 1 4.5-3" />
      </svg>
    );
  }
  if (type === "chart") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16" />
        <path d="M8 20V9" />
        <path d="M12 20V5" />
        <path d="M16 20v-7" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 4.4 2.7 8.4 7 9 4.3-.6 7-4.6 7-9V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.2-3.6" />
    </svg>
  );
}

function ProfileMatterCard() {
  const items = [
    {
      title: "Better Requirement Interpretation",
      body: "We understand your context to capture the right hiring needs.",
      icon: "target",
    },
    {
      title: "Better Candidate Matching",
      body: "Match with the most relevant, qualified, and available candidates.",
      icon: "people",
    },
    {
      title: "Better Screening Workflows",
      body: "Our agents run smarter interviews and evaluations based on your hiring standards.",
      icon: "chart",
    },
    {
      title: "Trusted & Secure",
      body: "We keep your data private and never share it with anyone.",
      icon: "shield",
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
              <MatterIcon type={item.icon} />
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

function RequirementHelperCard({ completionPercent }) {
  const readinessTone =
    completionPercent >= 80 ? "High-confidence brief" : completionPercent >= 50 ? "Good working draft" : "Needs more structure";

  return (
    <aside className="employer-matters-card">
      <div className="employer-matters-head">
        <div className="employer-matters-head-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h16" />
            <path d="M12 4v16" />
          </svg>
        </div>
        <div>
          <h3>Requirement Quality</h3>
          <p>Structured requirements help our interview agents ask the right questions from the start.</p>
        </div>
      </div>

      <div className="employer-quality-meter">
        <div className="employer-quality-meter-top">
          <span>Readiness</span>
          <strong>{completionPercent}%</strong>
        </div>
        <div className="employer-quality-bar">
          <div className="employer-quality-fill" style={{ width: `${completionPercent}%` }} />
        </div>
        <div className="employer-quality-meter-note">{readinessTone}</div>
      </div>

      <div className="employer-matters-list">
        <div className="employer-matter-item">
          <div className="employer-matter-icon">
            <MatterIcon type="target" />
          </div>
          <div>
            <strong>Role interpretation</strong>
            <p>The platform converts this structure into a screening blueprint and evaluation logic.</p>
          </div>
        </div>
        <div className="employer-matter-item">
          <div className="employer-matter-icon">
            <MatterIcon type="chart" />
          </div>
          <div>
            <strong>What agents will evaluate</strong>
            <p>Role fit, communication, availability, non-negotiables, and readiness for the final round.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ReviewHelperCard() {
  return (
    <aside className="employer-matters-card">
      <div className="employer-matters-head">
        <div className="employer-matters-head-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 12 2 2 4-4" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <div>
          <h3>Evaluation Readiness</h3>
          <p>Confirm this requirement before AI screening begins.</p>
        </div>
      </div>

      <div className="employer-matters-list">
        <div className="employer-matter-item">
          <div className="employer-matter-icon">
            <MatterIcon type="chart" />
          </div>
          <div>
            <strong>What happens next</strong>
            <p>AI interviews begin, candidates are scored, and a qualified shortlist is prepared for employer review.</p>
          </div>
        </div>
        <div className="employer-matter-item">
          <div className="employer-matter-icon">
            <MatterIcon type="people" />
          </div>
          <div>
            <strong>Employer review stage</strong>
            <p>You will review transcripts, fit scores, and final ready-to-hire candidate recommendations.</p>
          </div>
        </div>
        <div className="employer-matter-item">
          <div className="employer-matter-icon">
            <MatterIcon type="shield" />
          </div>
          <div>
            <strong>Structured before automated</strong>
            <p>Your requirement is locked into a consistent evaluation brief before any agent-led interview begins.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function EmployerProfileStep({
  form,
  setForm,
  authUserId,
  email,
  onCompanyLogoPick,
  onProfilePhotoPick,
  onRemoveCompanyLogo,
  onRemoveProfilePhoto,
  setError,
  setMessage,
}) {
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(getProfileStorageKey(authUserId));
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
  }, [authUserId, email, setForm, setMessage]);

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

  function removeLocationTag(tagToRemove) {
    const nextLocations = locationTags.filter((tag) => tag !== tagToRemove).join(", ");
    updateField("locations", nextLocations);
  }

  function addLocationTag(rawValue) {
    const nextValue = rawValue.trim();
    if (!nextValue) {
      return;
    }

    const nextTags = [...locationTags];
    if (!nextTags.includes(nextValue)) {
      nextTags.push(nextValue);
    }

    updateField("locations", nextTags.join(", "));
    setLocationInput("");
  }

  function handleLocationKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addLocationTag(locationInput);
    }
    if (event.key === "Backspace" && !locationInput && locationTags.length) {
      event.preventDefault();
      removeLocationTag(locationTags[locationTags.length - 1]);
    }
  }

  return (
    <>
      <div className="employer-page-heading">
        <h1>Set up your hiring profile</h1>
        <p>Help TurantHire understand your organization so we can tailor screening and evaluation for you.</p>
      </div>

      <div className="employer-content-grid">
        <div className="employer-form-card">
          <section className="employer-branding-panel">
            <div className="employer-branding-card">
              <div className="employer-branding-preview employer-branding-preview-logo">
                {form.company_logo_url ? <img alt="Company logo" src={form.company_logo_url} /> : <span>Logo</span>}
              </div>
              <div className="employer-branding-copy">
                <strong>Company logo</strong>
                <p>Upload a clean brand mark to personalize the employer workspace.</p>
              </div>
              <div className="employer-branding-actions">
                <button className="employer-plain-action employer-small-action" onClick={onCompanyLogoPick} type="button">
                  {form.company_logo_url ? "Replace" : "Upload"}
                </button>
                {form.company_logo_url ? (
                  <button className="employer-text-action" onClick={onRemoveCompanyLogo} type="button">
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            <div className="employer-branding-card">
              <div className="employer-branding-preview employer-branding-preview-photo">
                {form.profile_photo_url ? <img alt="Employer profile" src={form.profile_photo_url} /> : <span>Photo</span>}
              </div>
              <div className="employer-branding-copy">
                <strong>Hiring lead photo</strong>
                <p>This appears in the top-right account area so your workspace feels personal.</p>
              </div>
              <div className="employer-branding-actions">
                <button className="employer-plain-action employer-small-action" onClick={onProfilePhotoPick} type="button">
                  {form.profile_photo_url ? "Replace" : "Upload"}
                </button>
                {form.profile_photo_url ? (
                  <button className="employer-text-action" onClick={onRemoveProfilePhoto} type="button">
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          </section>

          <div className="employer-form-card-head">
            <div className="employer-form-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20h16" />
                <path d="M6 20V8.5A1.5 1.5 0 0 1 7.5 7H11v13" />
                <path d="M11 5.5A1.5 1.5 0 0 1 12.5 4H16a1.5 1.5 0 0 1 1.5 1.5V20" />
              </svg>
            </div>
            <div className="employer-form-card-title">Company Information</div>
          </div>

          <div className="employer-form-grid">
            <label>
              <span className="employer-label-text">Company / Organization Name <span>*</span></span>
              <input onChange={(event) => updateField("company_name", event.target.value)} value={form.company_name} />
            </label>
            <label>
              <span className="employer-label-text">Industry <span>*</span></span>
              <select onChange={(event) => updateField("industry", event.target.value)} value={form.industry}>
                <option value="">Select industry</option>
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
                <option value="">Select company size</option>
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
                    <button onClick={() => removeLocationTag(tag)} type="button">
                      ×
                    </button>
                  </span>
                ))}
                <input
                  className="employer-location-input"
                  onBlur={() => addLocationTag(locationInput)}
                  onChange={(event) => setLocationInput(event.target.value)}
                  onKeyDown={handleLocationKeyDown}
                  placeholder={locationTags.length ? "Add another location" : "Type a city or area and press Enter"}
                  value={locationInput}
                />
              </div>
            </div>
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
                <option value="">Select monthly hiring volume</option>
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
            <span className="employer-label-text">Tell us about your current hiring process (optional)</span>
            <textarea onChange={(event) => updateField("current_process_note", event.target.value)} rows="4" value={form.current_process_note} />
            <div className="employer-field-note">This helps our AI agents design better screening and evaluation workflows.</div>
          </label>

          <div className="employer-security-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" />
            </svg>
            <span>Your information is secure and will only be used to improve hiring outcomes.</span>
          </div>
        </div>

        <ProfileMatterCard />
      </div>
    </>
  );
}

function EmployerRequirementStep({ form, setForm, authUserId, setError, setMessage }) {
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(getRequirementStorageKey(authUserId));
      if (!saved) {
        return;
      }
      const parsed = JSON.parse(saved);
      setForm((current) => ({ ...current, ...parsed }));
      setMessage("Loaded your saved requirement draft.");
    } catch {
      setMessage("");
    }
  }, [authUserId, setForm, setMessage]);

  const completionPercent = useMemo(() => {
    const completed = requirementFields.filter((field) => String(form[field] ?? "").trim()).length;
    return Math.round((completed / requirementFields.length) * 100);
  }, [form]);

  function updateField(key, value) {
    setError("");
    setMessage("");
    setForm((current) => ({ ...current, [key]: value }));
  }

  const mustHaveSkills = splitCommaValues(form.must_have_skills);
  const knockoutQuestions = splitLineValues(form.screening_questions);
  const disqualifiers = splitLineValues(form.disqualifiers);

  return (
    <>
      <div className="employer-page-heading">
        <h1>Create a hiring requirement</h1>
        <p>Define what success looks like for this role so our screening agents can evaluate the right candidates.</p>
      </div>

      <div className="employer-content-grid">
        <div className="employer-form-card">
          <div className="employer-form-card-head">
            <div className="employer-form-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M8 3v4" />
                <path d="M16 3v4" />
                <path d="M4 10h16" />
              </svg>
            </div>
            <div className="employer-form-card-title">Role Requirement Blueprint</div>
          </div>

          <section className="employer-form-section">
            <div className="employer-form-section-header">
              <div>
                <div className="employer-form-section-title">Role Basics</div>
                <div className="employer-form-section-copy">
                  Capture the core hiring brief so our agents know what role they are screening for.
                </div>
              </div>
              <div className="employer-section-badge">Step 1</div>
            </div>
            <div className="employer-form-grid">
              <label>
                <span className="employer-label-text">Role Title <span>*</span></span>
                <input onChange={(event) => updateField("hiring_role", event.target.value)} value={form.hiring_role} />
              </label>
              <label>
                <span className="employer-label-text">Number of Openings <span>*</span></span>
                <input min="1" onChange={(event) => updateField("openings", event.target.value)} type="number" value={form.openings} />
              </label>
              <label>
                <span className="employer-label-text">Department</span>
                <input onChange={(event) => updateField("department", event.target.value)} value={form.department} />
              </label>
              <label>
                <span className="employer-label-text">Work Mode <span>*</span></span>
                <select onChange={(event) => updateField("work_mode", event.target.value)} value={form.work_mode}>
                  <option value="">Select work mode</option>
                  {workModeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="employer-label-text">Location <span>*</span></span>
                <input onChange={(event) => updateField("location", event.target.value)} value={form.location} />
              </label>
              <label>
                <span className="employer-label-text">Employment Type <span>*</span></span>
                <select onChange={(event) => updateField("employment_type", event.target.value)} value={form.employment_type}>
                  <option value="">Select employment type</option>
                  {employmentTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="employer-form-section">
            <div className="employer-form-section-header">
              <div>
                <div className="employer-form-section-title">Hiring Targets</div>
                <div className="employer-form-section-copy">
                  Define urgency, compensation, and baseline experience so the shortlist stays realistic.
                </div>
              </div>
              <div className="employer-section-badge">Step 2</div>
            </div>
            <div className="employer-form-grid employer-form-grid-tight">
              <label>
                <span className="employer-label-text">Joining Timeline <span>*</span></span>
                <select onChange={(event) => updateField("joining_timeline", event.target.value)} value={form.joining_timeline}>
                  <option value="">Select joining timeline</option>
                  {timelineOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="employer-label-text">Compensation Range <span>*</span></span>
                <input onChange={(event) => updateField("compensation", event.target.value)} value={form.compensation} />
              </label>
              <label>
                <span className="employer-label-text">Hiring Priority</span>
                <select onChange={(event) => updateField("priority", event.target.value)} value={form.priority}>
                  <option value="">Select hiring priority</option>
                  {priorityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="employer-label-text">Minimum Experience <span>*</span></span>
                <input onChange={(event) => updateField("experience", event.target.value)} value={form.experience} />
              </label>
            </div>
          </section>

          <section className="employer-form-section">
            <div className="employer-form-section-header">
              <div>
                <div className="employer-form-section-title">Must-Have Requirements</div>
                <div className="employer-form-section-copy">
                  These requirements become the anchor for fit scoring, eligibility checks, and interview design.
                </div>
              </div>
              <div className="employer-section-badge">Step 3</div>
            </div>
            <label className="employer-wide-field">
              <span className="employer-label-text">Must-Have Skills <span>*</span></span>
              <textarea onChange={(event) => updateField("must_have_skills", event.target.value)} rows="3" value={form.must_have_skills} />
              <div className="employer-field-note">Use commas to separate skills so we can structure them more clearly.</div>
            </label>
            {mustHaveSkills.length ? (
              <div className="employer-chip-row">
                {mustHaveSkills.map((skill) => (
                  <span className="employer-skill-chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="employer-form-grid employer-form-grid-tight">
              <label>
                <span className="employer-label-text">Language Requirements</span>
                <input onChange={(event) => updateField("language_requirements", event.target.value)} value={form.language_requirements} />
              </label>
              <label>
                <span className="employer-label-text">Communication Expectations</span>
                <input onChange={(event) => updateField("communication_expectation", event.target.value)} value={form.communication_expectation} />
              </label>
              <label>
                <span className="employer-label-text">Education / Certification</span>
                <input onChange={(event) => updateField("education_requirement", event.target.value)} value={form.education_requirement} />
              </label>
            </div>
          </section>

          <section className="employer-form-section">
            <div className="employer-form-section-header">
              <div>
                <div className="employer-form-section-title">Screening Rules</div>
                <div className="employer-form-section-copy">
                  Add knockout logic and disqualifiers so the first round is disciplined from the start.
                </div>
              </div>
              <div className="employer-section-badge">Step 4</div>
            </div>
            <div className="employer-form-grid employer-two-column-grid">
              <label className="employer-wide-field employer-no-margin">
                <span className="employer-label-text">Knockout Questions</span>
                <textarea onChange={(event) => updateField("screening_questions", event.target.value)} rows="5" value={form.screening_questions} />
                <div className="employer-field-note">Add one question per line for clean evaluation logic.</div>
              </label>
              <label className="employer-wide-field employer-no-margin">
                <span className="employer-label-text">Disqualifiers</span>
                <textarea onChange={(event) => updateField("disqualifiers", event.target.value)} rows="5" value={form.disqualifiers} />
                <div className="employer-field-note">List non-negotiables that should immediately disqualify a candidate.</div>
              </label>
            </div>
            {(knockoutQuestions.length || disqualifiers.length) ? (
              <div className="employer-review-panels">
                <div className="employer-mini-panel">
                  <strong>Knockout preview</strong>
                  <ul>
                    {knockoutQuestions.length ? knockoutQuestions.map((item) => <li key={item}>{item}</li>) : <li>No knockout questions yet.</li>}
                  </ul>
                </div>
                <div className="employer-mini-panel">
                  <strong>Disqualifier preview</strong>
                  <ul>
                    {disqualifiers.length ? disqualifiers.map((item) => <li key={item}>{item}</li>) : <li>No disqualifiers yet.</li>}
                  </ul>
                </div>
              </div>
            ) : null}
          </section>

          <section className="employer-form-section employer-form-section-last">
            <div className="employer-form-section-header">
              <div>
                <div className="employer-form-section-title">Ideal Candidate Notes</div>
                <div className="employer-form-section-copy">
                  Describe the kind of person who tends to succeed in this role beyond just matching the checklist.
                </div>
              </div>
              <div className="employer-section-badge">Step 5</div>
            </div>
            <label className="employer-wide-field employer-no-margin">
              <span className="employer-label-text">What makes a strong hire for this role?</span>
              <textarea onChange={(event) => updateField("ideal_candidate_notes", event.target.value)} rows="4" value={form.ideal_candidate_notes} />
            </label>
          </section>
        </div>

        <RequirementHelperCard completionPercent={completionPercent} />
      </div>
    </>
  );
}

function EmployerReviewStep({ profileForm, requirementForm }) {
  const mustHaveSkills = splitCommaValues(requirementForm.must_have_skills);
  const knockoutQuestions = splitLineValues(requirementForm.screening_questions);
  const disqualifiers = splitLineValues(requirementForm.disqualifiers);
  const summaryItems = [
    ["Role title", requirementForm.hiring_role],
    ["Openings", requirementForm.openings],
    ["Location", requirementForm.location],
    ["Work mode", requirementForm.work_mode],
    ["Employment type", requirementForm.employment_type],
    ["Joining timeline", requirementForm.joining_timeline],
    ["Compensation", requirementForm.compensation],
    ["Minimum experience", requirementForm.experience],
    ["Hiring priority", requirementForm.priority],
  ];

  return (
    <>
      <div className="employer-page-heading">
        <h1>Review requirement before evaluation</h1>
        <p>Confirm the hiring criteria before our AI agents begin screening and preparation.</p>
      </div>

      <div className="employer-content-grid">
        <div className="employer-form-card">
          <div className="employer-form-card-head">
            <div className="employer-form-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 12 2 2 4-4" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <div className="employer-form-card-title">Requirement Summary</div>
          </div>

          <div className="employer-summary-hero">
            <div>
              <div className="employer-summary-eyebrow">Evaluation brief</div>
              <div className="employer-summary-title">{requirementForm.hiring_role || "Role title"}</div>
              <div className="employer-summary-subtitle">
                {profileForm.company_name || "Company"} · {requirementForm.location || "Location"} · {requirementForm.openings} opening(s)
              </div>
            </div>
            <div className="employer-summary-badge">Ready for evaluation</div>
          </div>

          <div className="employer-summary-grid">
            {summaryItems.map(([label, value]) => (
              <div className="employer-summary-item" key={label}>
                <span>{label}</span>
                <strong>{value || "Not added"}</strong>
              </div>
            ))}
          </div>

          <div className="employer-review-panels">
            <div className="employer-mini-panel">
              <strong>Agent evaluation focus</strong>
              <ul>
                <li>Role-fit scoring against your required skills and experience.</li>
                <li>Availability and location suitability for the target work setup.</li>
                <li>Communication quality and screening confidence before final review.</li>
              </ul>
            </div>
            <div className="employer-mini-panel">
              <strong>Employer context used</strong>
              <ul>
                <li>{profileForm.company_name || "Company profile"} and its hiring footprint.</li>
                <li>{profileForm.monthly_hiring_volume || "Monthly hiring volume"} hiring volume and operating scale.</li>
                <li>{profileForm.current_process_note || "No additional hiring-process note added yet."}</li>
              </ul>
            </div>
          </div>

          <div className="employer-review-section">
            <h3>Must-have skills</h3>
            {mustHaveSkills.length ? (
              <div className="employer-chip-row">
                {mustHaveSkills.map((skill) => (
                  <span className="employer-skill-chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>No skills added yet.</p>
            )}
          </div>

          <div className="employer-review-section">
            <h3>Language and communication</h3>
            <p>
              {requirementForm.language_requirements || "Language requirements not added."}
              {requirementForm.communication_expectation ? ` · ${requirementForm.communication_expectation}` : ""}
            </p>
          </div>

          <div className="employer-review-section">
            <h3>Knockout questions</h3>
            {knockoutQuestions.length ? (
              <ul className="employer-review-list">
                {knockoutQuestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No knockout questions defined.</p>
            )}
          </div>

          <div className="employer-review-section">
            <h3>Disqualifiers</h3>
            {disqualifiers.length ? (
              <ul className="employer-review-list">
                {disqualifiers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No disqualifiers defined.</p>
            )}
          </div>

          <div className="employer-review-section">
            <h3>Ideal candidate notes</h3>
            <p>{requirementForm.ideal_candidate_notes || "No ideal-candidate notes defined."}</p>
          </div>
        </div>

        <ReviewHelperCard />
      </div>
    </>
  );
}

export default function App() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const companyLogoInputRef = useRef(null);
  const profilePhotoInputRef = useRef(null);
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    company_logo_url: "",
    company_name: "",
    industry: "",
    company_size: "",
    locations: "",
    employee_count: "",
    hiring_team_size: "",
    monthly_hiring_volume: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    profile_photo_url: "",
    current_process_note: "",
  });
  const [requirementForm, setRequirementForm] = useState({
    hiring_role: "",
    openings: "",
    department: "",
    work_mode: "",
    location: "",
    employment_type: "",
    joining_timeline: "",
    compensation: "",
    priority: "",
    experience: "",
    must_have_skills: "",
    language_requirements: "",
    communication_expectation: "",
    education_requirement: "",
    screening_questions: "",
    disqualifiers: "",
    ideal_candidate_notes: "",
  });

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
        setProfileForm((current) => ({
          ...current,
          primary_contact_email: current.primary_contact_email || session.user.email || "",
        }));
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

  function handleSupportClick() {
    window.location.href = "mailto:support@turanthire.com?subject=TurantHire%20Employer%20Support";
  }

  function handleAccountClick() {
    setActiveTab("profile");
    setMessage("Showing your employer profile setup.");
    setError("");
  }

  function handleBellClick() {
    setMessage("Notifications will appear here as soon as evaluations and candidate updates are available.");
    setError("");
  }

  function handlePhotoPick(ref) {
    ref.current?.click();
  }

  async function handleImageChange(key, event) {
    const [file] = Array.from(event.target.files ?? []);
    event.target.value = "";

    try {
      const imageUrl = await readImageFile(file);
      setProfileForm((current) => ({ ...current, [key]: imageUrl }));
      setError("");
      setMessage(key === "company_logo_url" ? "Company logo updated." : "Profile photo updated.");
    } catch (nextError) {
      setError(nextError.message);
      setMessage("");
    }
  }

  function removeImage(key) {
    setProfileForm((current) => ({ ...current, [key]: "" }));
    setError("");
    setMessage(key === "company_logo_url" ? "Company logo removed." : "Profile photo removed.");
  }

  function saveProfileDraft() {
    const validationError = validateEmployerProfile(profileForm);
    if (validationError) {
      setError(validationError);
      return false;
    }
    window.localStorage.setItem(getProfileStorageKey(session.user.id), JSON.stringify(profileForm));
    setMessage("Profile saved. You can continue to requirements when ready.");
    setError("");
    return true;
  }

  function saveRequirementDraft() {
    const validationError = validateRequirementForm(requirementForm);
    if (validationError) {
      setError(validationError);
      return false;
    }
    window.localStorage.setItem(getRequirementStorageKey(session.user.id), JSON.stringify(requirementForm));
    setMessage("Requirement draft saved.");
    setError("");
    return true;
  }

  async function handlePublishEvaluation() {
    const profileOk = saveProfileDraft();
    const requirementOk = saveRequirementDraft();
    if (!profileOk || !requirementOk) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      await createRequirement({
        employer_auth_user_id: session.user.id,
        employer_email: session.user.email ?? "",
        company_name: profileForm.company_name,
        hiring_role: requirementForm.hiring_role,
        location: requirementForm.location,
        urgency: requirementForm.joining_timeline,
        compensation: requirementForm.compensation,
        openings: Number(requirementForm.openings),
        notes: [
          `Department: ${requirementForm.department}`,
          `Work mode: ${requirementForm.work_mode}`,
          `Employment type: ${requirementForm.employment_type}`,
          `Experience: ${requirementForm.experience}`,
          `Must-have skills: ${requirementForm.must_have_skills}`,
          `Language requirements: ${requirementForm.language_requirements}`,
          `Communication expectation: ${requirementForm.communication_expectation}`,
          `Education requirement: ${requirementForm.education_requirement}`,
          `Screening questions: ${requirementForm.screening_questions}`,
          `Disqualifiers: ${requirementForm.disqualifiers}`,
          `Ideal candidate notes: ${requirementForm.ideal_candidate_notes}`,
        ].join("\n"),
      });
      setMessage("Requirement published. Evaluation can begin now.");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

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

  if (error && !session) {
    return (
      <div className="employer-loading-shell">
        <div className="employer-loading-card employer-error-card">{error}</div>
      </div>
    );
  }

  const step = activeTab === "profile" ? 1 : activeTab === "requirements" ? 2 : 3;

  return (
    <div className="employer-layout">
      <EmployerSidebar activeTab={activeTab} onSupportClick={handleSupportClick} onTabChange={setActiveTab} />

      <main className="employer-main">
        <TopBar
          companyLogoUrl={profileForm.company_logo_url}
          companyName={profileForm.company_name}
          email={session.user.email ?? ""}
          onAccountClick={handleAccountClick}
          onBellClick={handleBellClick}
          onPhotoClick={() => handlePhotoPick(profilePhotoInputRef)}
          onSignOut={handleSignOut}
          profilePhotoUrl={profileForm.profile_photo_url}
          step={step}
        />

        <input
          accept="image/*"
          className="employer-hidden-file-input"
          onChange={(event) => handleImageChange("company_logo_url", event)}
          ref={companyLogoInputRef}
          type="file"
        />
        <input
          accept="image/*"
          className="employer-hidden-file-input"
          onChange={(event) => handleImageChange("profile_photo_url", event)}
          ref={profilePhotoInputRef}
          type="file"
        />

        {error ? <div className="employer-banner employer-banner-error">{error}</div> : null}
        {message ? <div className="employer-banner employer-banner-success">{message}</div> : null}

        {activeTab === "profile" ? (
          <EmployerProfileStep
            authUserId={session.user.id}
            email={session.user.email ?? ""}
            form={profileForm}
            onCompanyLogoPick={() => handlePhotoPick(companyLogoInputRef)}
            onProfilePhotoPick={() => handlePhotoPick(profilePhotoInputRef)}
            onRemoveCompanyLogo={() => removeImage("company_logo_url")}
            onRemoveProfilePhoto={() => removeImage("profile_photo_url")}
            setError={setError}
            setForm={setProfileForm}
            setMessage={setMessage}
          />
        ) : null}

        {activeTab === "requirements" ? (
          <EmployerRequirementStep
            authUserId={session.user.id}
            form={requirementForm}
            setError={setError}
            setForm={setRequirementForm}
            setMessage={setMessage}
          />
        ) : null}

        {activeTab === "review" ? (
          <EmployerReviewStep profileForm={profileForm} requirementForm={requirementForm} />
        ) : null}

        <div className="employer-bottom-bar">
          <div className="employer-bottom-left">
            <button
              className="employer-secondary-action"
              onClick={() => {
                if (activeTab === "profile") {
                  saveProfileDraft();
                } else if (activeTab === "requirements") {
                  saveRequirementDraft();
                } else {
                  const profileOk = saveProfileDraft();
                  const requirementOk = saveRequirementDraft();
                  if (profileOk && requirementOk) {
                    setMessage("Profile and requirement drafts saved.");
                  }
                }
              }}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l5 5v11a2 2 0 0 1-2 2Z" />
                <path d="M14 3v6h6" />
              </svg>
              Save for Later
            </button>
            <span className="employer-bottom-note">You can complete this anytime.</span>
          </div>

          <div className="employer-bottom-actions">
            {activeTab !== "profile" ? (
              <button
                className="employer-plain-action"
                onClick={() => setActiveTab(activeTab === "review" ? "requirements" : "profile")}
                type="button"
              >
                Back
              </button>
            ) : (
              <button className="employer-plain-action" onClick={saveProfileDraft} type="button">
                Save Profile
              </button>
            )}

            {activeTab === "profile" ? (
              <button
                className="employer-primary-action"
                onClick={() => {
                  if (saveProfileDraft()) {
                    setActiveTab("requirements");
                  }
                }}
                type="button"
              >
                Continue to Requirements
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            ) : null}

            {activeTab === "requirements" ? (
              <button
                className="employer-primary-action"
                onClick={() => {
                  if (saveRequirementDraft()) {
                    setActiveTab("review");
                  }
                }}
                type="button"
              >
                Review Requirement
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            ) : null}

            {activeTab === "review" ? (
              <button className="employer-primary-action" disabled={isSubmitting} onClick={handlePublishEvaluation} type="button">
                {isSubmitting ? "Publishing..." : "Publish & Start Evaluation"}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
