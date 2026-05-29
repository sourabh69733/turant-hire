import { useEffect, useMemo, useRef, useState } from "react";
import { AuthScreen, getSupabaseBrowserClient } from "auth-ui";

import { EmployerRequirementAgent } from "./components/EmployerRequirementAgent";
import { sendEmployerAgentMessage } from "./lib/employerAgentApi";
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

function getRequirementAgentStorageKey(authUserId) {
  return `turant_hire_employer_requirement_agent_${authUserId}`;
}

function getEmployerIntroMessage(profileForm) {
  if (!profileForm.primary_contact_name.trim()) {
    return "Hi, I’m here to help you hire fast. What should I call you?";
  }
  if (!profileForm.business_type.trim()) {
    return `Thanks ${profileForm.primary_contact_name.split(" ")[0]}. What kind of business do you run?`;
  }
  return "Who do you need to hire right now? You can describe it in one line and I’ll prepare the draft with you.";
}

function getEmployerConversationStage(profileForm) {
  if (!profileForm.primary_contact_name.trim()) {
    return "collect_name";
  }
  if (!profileForm.business_type.trim()) {
    return "collect_business_type";
  }
  return "role_intake";
}

function validateEmployerProfile(form) {
  const errors = {};

  return errors;
}

function validateRequirementForm(form) {
  const errors = {};

  if (!form.hiring_role.trim()) {
    errors.hiring_role = "Enter the role title.";
  }
  if (!form.location.trim()) {
    errors.location = "Enter the work location.";
  }
  if (!form.joining_timeline.trim()) {
    errors.joining_timeline = "Select the joining timeline.";
  }
  if (!form.compensation.trim()) {
    errors.compensation = "Enter the compensation range.";
  }

  return errors;
}

function hasFieldErrors(errors) {
  return Object.keys(errors).length > 0;
}

function getFirstFieldError(errors) {
  return Object.values(errors)[0] ?? "";
}

function getFieldGroupClassName(hasError, extraClassName = "") {
  return [extraClassName, hasError ? "is-invalid" : ""].filter(Boolean).join(" ");
}

function renderFieldError(message) {
  if (!message) {
    return null;
  }

  return (
    <span className="employer-field-error" role="alert">
      {message}
    </span>
  );
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
    { id: "requirements", label: "New Hiring Request", icon: "briefcase" },
    { id: "review", label: "Draft Review", icon: "pipeline" },
    { id: "profile", label: "Business Details", icon: "profile" },
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
    1: "New Hiring Request",
    2: "Draft Review",
    3: "Business Details",
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
            {step === 1 && "Start with a simple conversation about who you need to hire"}
            {step === 2 && "Review the draft before we start matching and screening"}
            {step === 3 && "Add optional business details if you want a richer setup later"}
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
  fieldErrors,
  setFieldErrors,
  onCompanyLogoPick,
  onProfilePhotoPick,
  onRemoveCompanyLogo,
  onRemoveProfilePhoto,
  setError,
  setMessage,
}) {
  const [locationInput, setLocationInput] = useState("");

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
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[key];
      return nextErrors;
    });
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
            <div className="employer-form-card-title">Business Details</div>
          </div>

          <div className="employer-security-note employer-security-note-soft">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M12 4h9" />
              <path d="M4 9h16" />
              <path d="M4 15h16" />
            </svg>
            <span>Everything on this page is optional now. Use it only if you want a richer employer profile.</span>
          </div>

          <div className="employer-form-grid">
            <label className={getFieldGroupClassName(Boolean(fieldErrors.company_name))}>
              <span className="employer-label-text">Company / Organization Name</span>
              <input onChange={(event) => updateField("company_name", event.target.value)} value={form.company_name} />
              {renderFieldError(fieldErrors.company_name)}
            </label>
            <label>
              <span className="employer-label-text">Business Type</span>
              <input
                onChange={(event) => updateField("business_type", event.target.value)}
                placeholder="Cafe, bakery, restaurant, salon, retail shop..."
                value={form.business_type}
              />
            </label>
            <label className={getFieldGroupClassName(Boolean(fieldErrors.industry))}>
              <span className="employer-label-text">Industry</span>
              <select onChange={(event) => updateField("industry", event.target.value)} value={form.industry}>
                <option value="">Select industry</option>
                {industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {renderFieldError(fieldErrors.industry)}
            </label>
            <label className={getFieldGroupClassName(Boolean(fieldErrors.company_size))}>
              <span className="employer-label-text">Company Size</span>
              <select onChange={(event) => updateField("company_size", event.target.value)} value={form.company_size}>
                <option value="">Select company size</option>
                {companySizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {renderFieldError(fieldErrors.company_size)}
            </label>
          </div>

          <label className={getFieldGroupClassName(Boolean(fieldErrors.locations), "employer-wide-field employer-locations-field")}>
            <span className="employer-label-text">Primary Hiring Locations</span>
            <div className={`employer-location-box ${fieldErrors.locations ? "is-invalid" : ""}`}>
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
            {renderFieldError(fieldErrors.locations)}
            <div className="employer-field-note">Add all major locations where you hire.</div>
          </label>

          <div className="employer-form-grid">
            <label className={getFieldGroupClassName(Boolean(fieldErrors.employee_count))}>
              <span className="employer-label-text">Total Employees</span>
              <input onChange={(event) => updateField("employee_count", event.target.value)} value={form.employee_count} />
              {renderFieldError(fieldErrors.employee_count)}
            </label>
            <label className={getFieldGroupClassName(Boolean(fieldErrors.hiring_team_size))}>
              <span className="employer-label-text">Hiring Team Size</span>
              <input onChange={(event) => updateField("hiring_team_size", event.target.value)} value={form.hiring_team_size} />
              {renderFieldError(fieldErrors.hiring_team_size)}
            </label>
            <label className={getFieldGroupClassName(Boolean(fieldErrors.monthly_hiring_volume))}>
              <span className="employer-label-text">Monthly Hiring Volume</span>
              <select onChange={(event) => updateField("monthly_hiring_volume", event.target.value)} value={form.monthly_hiring_volume}>
                <option value="">Select monthly hiring volume</option>
                {hiringVolumeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {renderFieldError(fieldErrors.monthly_hiring_volume)}
            </label>
          </div>

          <div className="employer-form-grid">
            <label className={getFieldGroupClassName(Boolean(fieldErrors.primary_contact_name))}>
              <span className="employer-label-text">Primary Contact Name</span>
              <input onChange={(event) => updateField("primary_contact_name", event.target.value)} value={form.primary_contact_name} />
              {renderFieldError(fieldErrors.primary_contact_name)}
            </label>
            <label className={getFieldGroupClassName(Boolean(fieldErrors.primary_contact_email))}>
              <span className="employer-label-text">Work Email</span>
              <input onChange={(event) => updateField("primary_contact_email", event.target.value)} type="email" value={form.primary_contact_email} />
              {renderFieldError(fieldErrors.primary_contact_email)}
            </label>
            <label className={getFieldGroupClassName(Boolean(fieldErrors.primary_contact_phone))}>
              <span className="employer-label-text">Phone Number</span>
              <input onChange={(event) => updateField("primary_contact_phone", event.target.value)} value={form.primary_contact_phone} />
              {renderFieldError(fieldErrors.primary_contact_phone)}
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

function EmployerRequirementStep({ form, setForm, authUserId, fieldErrors, setFieldErrors, setError, setMessage }) {
  function updateField(key, value) {
    setError("");
    setMessage("");
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[key];
      return nextErrors;
    });
    setForm((current) => ({ ...current, [key]: value }));
  }

  const mustHaveSkills = splitCommaValues(form.must_have_skills);
  const knockoutQuestions = splitLineValues(form.screening_questions);
  const disqualifiers = splitLineValues(form.disqualifiers);

  return (
    <>
      <div className="employer-page-heading">
        <h1>Edit the full draft only if you need to</h1>
        <p>The chat should do most of the work. Use this form when you want to add or correct details manually.</p>
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
              <label className={getFieldGroupClassName(Boolean(fieldErrors.hiring_role))}>
                <span className="employer-label-text">Role Title <span>*</span></span>
                <input onChange={(event) => updateField("hiring_role", event.target.value)} value={form.hiring_role} />
                {renderFieldError(fieldErrors.hiring_role)}
              </label>
              <label className={getFieldGroupClassName(Boolean(fieldErrors.openings))}>
                <span className="employer-label-text">Number of Openings</span>
                <input min="1" onChange={(event) => updateField("openings", event.target.value)} type="number" value={form.openings} />
                {renderFieldError(fieldErrors.openings)}
              </label>
              <label>
                <span className="employer-label-text">Department</span>
                <input onChange={(event) => updateField("department", event.target.value)} value={form.department} />
              </label>
              <label className={getFieldGroupClassName(Boolean(fieldErrors.work_mode))}>
                <span className="employer-label-text">Work Mode</span>
                <select onChange={(event) => updateField("work_mode", event.target.value)} value={form.work_mode}>
                  <option value="">Select work mode</option>
                  {workModeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {renderFieldError(fieldErrors.work_mode)}
              </label>
              <label className={getFieldGroupClassName(Boolean(fieldErrors.location))}>
                <span className="employer-label-text">Location <span>*</span></span>
                <input onChange={(event) => updateField("location", event.target.value)} value={form.location} />
                {renderFieldError(fieldErrors.location)}
              </label>
              <label className={getFieldGroupClassName(Boolean(fieldErrors.employment_type))}>
                <span className="employer-label-text">Employment Type</span>
                <select onChange={(event) => updateField("employment_type", event.target.value)} value={form.employment_type}>
                  <option value="">Select employment type</option>
                  {employmentTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {renderFieldError(fieldErrors.employment_type)}
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
              <label className={getFieldGroupClassName(Boolean(fieldErrors.joining_timeline))}>
                <span className="employer-label-text">Joining Timeline <span>*</span></span>
                <select onChange={(event) => updateField("joining_timeline", event.target.value)} value={form.joining_timeline}>
                  <option value="">Select joining timeline</option>
                  {timelineOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {renderFieldError(fieldErrors.joining_timeline)}
              </label>
              <label className={getFieldGroupClassName(Boolean(fieldErrors.compensation))}>
                <span className="employer-label-text">Compensation Range <span>*</span></span>
                <input onChange={(event) => updateField("compensation", event.target.value)} value={form.compensation} />
                {renderFieldError(fieldErrors.compensation)}
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
              <label className={getFieldGroupClassName(Boolean(fieldErrors.experience))}>
                <span className="employer-label-text">Minimum Experience</span>
                <input onChange={(event) => updateField("experience", event.target.value)} value={form.experience} />
                {renderFieldError(fieldErrors.experience)}
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
            <label className={getFieldGroupClassName(Boolean(fieldErrors.must_have_skills), "employer-wide-field")}>
              <span className="employer-label-text">Must-Have Skills</span>
              <textarea onChange={(event) => updateField("must_have_skills", event.target.value)} rows="3" value={form.must_have_skills} />
              {renderFieldError(fieldErrors.must_have_skills)}
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
    ["Openings", requirementForm.openings || "1"],
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
                {profileForm.company_name || profileForm.business_type || "Company"} · {requirementForm.location || "Location"} · {requirementForm.openings || "1"} opening(s)
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
  const authUserIdRef = useRef(null);
  const initialAgentMessages = useRef([
    {
      role: "assistant",
      content: "Hi, I’m here to help you hire fast. What should I call you?",
    },
  ]);
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSessionResolved, setIsSessionResolved] = useState(false);
  const [hasHydratedEmployerState, setHasHydratedEmployerState] = useState(false);
  const [error, setError] = useState("");
  const [hasRoleAccess, setHasRoleAccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("requirements");
  const [showRequirementEditor, setShowRequirementEditor] = useState(false);
  const [profileFieldErrors, setProfileFieldErrors] = useState({});
  const [requirementFieldErrors, setRequirementFieldErrors] = useState({});
  const [agentMessages, setAgentMessages] = useState(initialAgentMessages.current);
  const [agentMissingFields, setAgentMissingFields] = useState([]);
  const [agentReadyToReview, setAgentReadyToReview] = useState(false);
  const [profileForm, setProfileForm] = useState({
    company_logo_url: "",
    company_name: "",
    business_type: "",
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
      authUserIdRef.current = data.session?.user?.id ?? null;
      setIsSessionResolved(true);
      if (!data.session) {
        setIsChecking(false);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const nextUserId = nextSession?.user?.id ?? null;
      const previousUserId = authUserIdRef.current;
      authUserIdRef.current = nextUserId;

      setSession(nextSession);
      setIsSessionResolved(true);
      if (!nextSession) {
        setHasRoleAccess(false);
        setIsChecking(false);
      } else if (nextUserId !== previousUserId) {
        setIsChecking(true);
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!isSessionResolved) {
      return;
    }

    async function verifyEmployerRole() {
      if (!session?.user?.id) {
        setHasRoleAccess(false);
        return;
      }

      setIsChecking(true);
      setError("");
      setHasRoleAccess(false);

      try {
        await ensureAppUser({
          auth_user_id: session.user.id,
          email: session.user.email ?? "",
          role: "employer",
        });
        setHasRoleAccess(true);
        setProfileForm((current) => ({
          ...current,
          primary_contact_email: current.primary_contact_email || session.user.email || "",
        }));
      } catch (nextError) {
        setHasRoleAccess(false);
        setError(nextError.message);
      } finally {
        setIsChecking(false);
      }
    }

    verifyEmployerRole();
  }, [isSessionResolved, session?.user?.email, session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id || !hasRoleAccess) {
      setHasHydratedEmployerState(false);
      setAgentMessages([
        {
          role: "assistant",
          content: getEmployerIntroMessage(profileForm),
        },
      ]);
      setAgentMissingFields([]);
      setAgentReadyToReview(false);
      return;
    }

    try {
      const savedProfile = window.localStorage.getItem(getProfileStorageKey(session.user.id));
      let hydratedProfile = null;
      if (savedProfile) {
        hydratedProfile = JSON.parse(savedProfile);
        setProfileForm((current) => ({
          ...current,
          ...hydratedProfile,
          primary_contact_email: hydratedProfile.primary_contact_email || current.primary_contact_email || session.user.email || "",
        }));
      }

      const savedRequirement = window.localStorage.getItem(getRequirementStorageKey(session.user.id));
      if (savedRequirement) {
        const parsedRequirement = JSON.parse(savedRequirement);
        setRequirementForm((current) => ({ ...current, ...parsedRequirement }));
      }

      const savedAgentState = window.localStorage.getItem(getRequirementAgentStorageKey(session.user.id));
      if (savedAgentState) {
        const parsedAgentState = JSON.parse(savedAgentState);
        const nextMessages = Array.isArray(parsedAgentState.messages)
          ? parsedAgentState.messages.filter(
              (item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string",
            )
          : [];

        setAgentMessages(nextMessages.length ? nextMessages : initialAgentMessages.current);
        setAgentMissingFields(
          Array.isArray(parsedAgentState.missingFields)
            ? parsedAgentState.missingFields.filter((item) => typeof item === "string" && item.trim())
            : [],
        );
        setAgentReadyToReview(Boolean(parsedAgentState.readyToReview));
      } else {
        setAgentMessages([
          {
            role: "assistant",
            content: getEmployerIntroMessage({
              ...profileForm,
              ...(hydratedProfile || {}),
              primary_contact_email:
                hydratedProfile?.primary_contact_email || profileForm.primary_contact_email || session.user.email || "",
            }),
          },
        ]);
        setAgentMissingFields([]);
        setAgentReadyToReview(false);
      }
    } catch {
      setAgentMessages([
        {
          role: "assistant",
          content: getEmployerIntroMessage(profileForm),
        },
      ]);
      setAgentMissingFields([]);
      setAgentReadyToReview(false);
    } finally {
      setHasHydratedEmployerState(true);
    }
  }, [hasRoleAccess, session?.user?.email, session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id || !hasRoleAccess || !hasHydratedEmployerState) {
      return;
    }

    window.localStorage.setItem(getProfileStorageKey(session.user.id), JSON.stringify(profileForm));
  }, [hasHydratedEmployerState, hasRoleAccess, profileForm, session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id || !hasRoleAccess || !hasHydratedEmployerState) {
      return;
    }

    window.localStorage.setItem(getRequirementStorageKey(session.user.id), JSON.stringify(requirementForm));
  }, [hasHydratedEmployerState, hasRoleAccess, requirementForm, session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id || !hasRoleAccess || !hasHydratedEmployerState) {
      return;
    }

    window.localStorage.setItem(
      getRequirementAgentStorageKey(session.user.id),
      JSON.stringify({
        messages: agentMessages,
        missingFields: agentMissingFields,
        readyToReview: agentReadyToReview,
      }),
    );
  }, [
    agentMessages,
    agentMissingFields,
    agentReadyToReview,
    hasHydratedEmployerState,
    hasRoleAccess,
    session?.user?.id,
  ]);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  function handleSupportClick() {
    window.location.href = "mailto:support@turanthire.com?subject=TurantHire%20Employer%20Support";
  }

  function handleAccountClick() {
    setActiveTab("profile");
    setMessage("Showing optional business details.");
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

  async function handleEmployerAgentMessage(userContent) {
    const nextMessages = [...agentMessages, { role: "user", content: userContent }];
    setAgentMessages(nextMessages);
    setError("");
    setMessage("");

    const trimmedContent = userContent.trim();
    const conversationStage = getEmployerConversationStage(profileForm);

    if (conversationStage === "collect_name") {
      const firstName = trimmedContent.split(" ")[0];
      setProfileForm((current) => ({
        ...current,
        primary_contact_name: trimmedContent,
      }));
      setAgentMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: `Thanks ${firstName}. What kind of business do you run? You can say cafe, bakery, restaurant, retail shop, salon, or anything similar.`,
        },
      ]);
      return;
    }

    if (conversationStage === "collect_business_type") {
      setProfileForm((current) => ({
        ...current,
        business_type: trimmedContent,
        company_name: current.company_name || trimmedContent,
      }));
      setAgentMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Got it. Who do you need to hire right now? You can describe it in one line, like \"I need 2 waiters for my Bandra cafe, evening shift, immediate joining.\"",
        },
      ]);
      return;
    }

    setIsAgentLoading(true);

    try {
      const recentMessages = nextMessages.slice(-16);
      const response = await sendEmployerAgentMessage({
        messages: recentMessages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        current_draft: requirementForm,
      });

      setAgentMessages((current) => [
        ...current,
        { role: "assistant", content: response.assistant_message },
      ]);
      setAgentMissingFields(response.missing_fields ?? []);
      setAgentReadyToReview(Boolean(response.ready_to_review));
      setRequirementForm((current) => ({
        ...current,
        openings: current.openings || "1",
        ...response.structured_requirement,
      }));
      setMessage("Draft updated. Review it or keep chatting if you want to refine it.");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setIsAgentLoading(false);
    }
  }

  function saveProfileDraft() {
    const validationErrors = validateEmployerProfile(profileForm);
    setProfileFieldErrors(validationErrors);
    if (hasFieldErrors(validationErrors)) {
      setError("");
      setMessage("");
      return false;
    }
    window.localStorage.setItem(getProfileStorageKey(session.user.id), JSON.stringify(profileForm));
    setMessage("Business details saved.");
    setError("");
    setProfileFieldErrors({});
    return true;
  }

  function saveRequirementDraft() {
    const validationErrors = validateRequirementForm(requirementForm);
    setRequirementFieldErrors(validationErrors);
    if (hasFieldErrors(validationErrors)) {
      setError("");
      setMessage("");
      return false;
    }
    window.localStorage.setItem(getRequirementStorageKey(session.user.id), JSON.stringify(requirementForm));
    setMessage("Requirement draft saved.");
    setError("");
    setRequirementFieldErrors({});
    return true;
  }

  async function handlePublishEvaluation() {
    const profileOk = saveProfileDraft();
    if (!profileOk) {
      setActiveTab("profile");
      return;
    }

    const requirementOk = saveRequirementDraft();
    if (!requirementOk) {
      setActiveTab("requirements");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      await createRequirement({
        employer_auth_user_id: session.user.id,
        employer_email: session.user.email ?? "",
        company_name: profileForm.company_name || profileForm.business_type || "Employer",
        hiring_role: requirementForm.hiring_role,
        location: requirementForm.location,
        urgency: requirementForm.joining_timeline,
        compensation: requirementForm.compensation,
        openings: Number(requirementForm.openings) || 1,
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

  if (session && !hasRoleAccess) {
    return (
      <div className="employer-loading-shell">
        <div className="employer-loading-card employer-error-card">
          <div style={{ marginBottom: 14 }}>{error || "This account cannot access the employer workspace."}</div>
          <button className="employer-signout-button" onClick={handleSignOut} type="button">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const step = activeTab === "requirements" ? 1 : activeTab === "review" ? 2 : 3;

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
            fieldErrors={profileFieldErrors}
            form={profileForm}
            onCompanyLogoPick={() => handlePhotoPick(companyLogoInputRef)}
            onProfilePhotoPick={() => handlePhotoPick(profilePhotoInputRef)}
            onRemoveCompanyLogo={() => removeImage("company_logo_url")}
            onRemoveProfilePhoto={() => removeImage("profile_photo_url")}
            setError={setError}
            setFieldErrors={setProfileFieldErrors}
            setForm={setProfileForm}
            setMessage={setMessage}
          />
        ) : null}

        {activeTab === "requirements" ? (
          <>
            <EmployerRequirementAgent
              actionLabel="Continue"
              heading="Tell me who you need to hire"
              isLoading={isAgentLoading}
              messages={agentMessages}
              missingFields={agentMissingFields}
              onSendMessage={handleEmployerAgentMessage}
              placeholder="Example: I need 2 waiters for my Bandra cafe, evening shift, immediate joining."
              statusCollectingLabel="Building draft"
              statusReadyLabel="Draft ready"
              subheading="Start with a few short replies. I’ll keep the intake light and build the hiring draft as we go."
              tip="Keep it simple. Name, business type, role, area, urgency, shift, and pay are enough to get started."
              readyToReview={agentReadyToReview}
            />
            {showRequirementEditor ? (
              <EmployerRequirementStep
                authUserId={session.user.id}
                fieldErrors={requirementFieldErrors}
                form={requirementForm}
                setError={setError}
                setFieldErrors={setRequirementFieldErrors}
                setForm={setRequirementForm}
                setMessage={setMessage}
              />
            ) : null}
          </>
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
                  setMessage("Draft saved. You can continue later.");
                  setError("");
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
                Save Business Details
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
                Back to Hiring Request
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
                  } else {
                    setShowRequirementEditor(true);
                  }
                }}
                type="button"
              >
                Review Draft
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
