import React from "react";

const defaultSkills = ["Lead Generation", "Communication", "Sales", "Customer Handling"];

export function ProfileView({
  profile,
  profileDraft,
  setProfileDraft,
  saveProfile,
  isSaving,
  onPreviewProfile,
  onOpenAvailability,
  onOpenVerifications,
  onOpenSettings,
  onOpenSkills,
}) {
  const [editMode, setEditMode] = React.useState(null);
  const hasVerifiedEmail = Boolean(profile.email);

  const skillPills = profile.profile_summary
    ? profile.profile_summary
        .split(/[,.]/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4)
    : defaultSkills;

  async function handleSave(event) {
    try {
      await saveProfile(event);
      setEditMode(null);
    } catch {
      // Keep edit mode open so the user can correct the field.
    }
  }

  return (
    <div className="cv2-profile">
      <div className="cv2-page-header">
        <div className="cv2-page-header-copy">
          <h1 className="cv2-page-title">Profile Details</h1>
          <p className="cv2-page-subtitle">Keep your profile complete and up to date for better matches.</p>
        </div>

        <button className="cv2-btn-outline" onClick={onPreviewProfile} type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Preview Profile
        </button>
      </div>

      <form className="cv2-info-grid cv2-info-grid-profile" onSubmit={handleSave}>
        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon blue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            {editMode === "primary_role" ? (
              <button className="cv2-info-edit" disabled={isSaving} type="submit">Save</button>
            ) : (
              <button className="cv2-info-edit" onClick={() => setEditMode("primary_role")} type="button">Edit</button>
            )}
          </div>
          <div>
            <span className="cv2-info-label">Primary Role</span>
            {editMode === "primary_role" ? (
              <input
                className="cv2-form-input"
                type="text"
                value={profileDraft.primary_role}
                onChange={(event) => setProfileDraft((current) => ({ ...current, primary_role: event.target.value }))}
              />
            ) : (
              <div className="cv2-info-value">{profileDraft.primary_role}</div>
            )}
          </div>
        </div>

        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {editMode === "location" ? (
              <button className="cv2-info-edit" disabled={isSaving} type="submit">Save</button>
            ) : (
              <button className="cv2-info-edit" onClick={() => setEditMode("location")} type="button">Edit</button>
            )}
          </div>
          <div>
            <span className="cv2-info-label">Location</span>
            {editMode === "location" ? (
              <input
                className="cv2-form-input"
                type="text"
                value={profileDraft.location}
                onChange={(event) => setProfileDraft((current) => ({ ...current, location: event.target.value }))}
              />
            ) : (
              <div className="cv2-info-value">{profileDraft.location}</div>
            )}
          </div>
        </div>

        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {editMode === "expected_pay" ? (
              <button className="cv2-info-edit" disabled={isSaving} type="submit">Save</button>
            ) : (
              <button className="cv2-info-edit" onClick={() => setEditMode("expected_pay")} type="button">Edit</button>
            )}
          </div>
          <div>
            <span className="cv2-info-label">Expected Pay</span>
            {editMode === "expected_pay" ? (
              <input
                className="cv2-form-input"
                type="text"
                value={profileDraft.expected_pay}
                onChange={(event) => setProfileDraft((current) => ({ ...current, expected_pay: event.target.value }))}
              />
            ) : (
              <div className="cv2-info-value">{profileDraft.expected_pay}</div>
            )}
          </div>
        </div>

        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <button className="cv2-info-edit" onClick={onOpenAvailability} type="button">Edit</button>
          </div>
          <div>
            <span className="cv2-info-label">Availability</span>
            <div className="cv2-info-value">{profile.availability}</div>
          </div>
        </div>

        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <button className="cv2-info-edit" onClick={onOpenSettings} type="button">Edit</button>
          </div>
          <div>
            <span className="cv2-info-label">Travel Radius</span>
            <div className="cv2-info-value">Up to 15 km</div>
          </div>
        </div>

        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon green" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <button className="cv2-info-edit" onClick={onOpenVerifications} type="button">Edit</button>
          </div>
          <div>
            <span className="cv2-info-label">Contact Verification</span>
            <div className="cv2-info-check">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              Phone Verified
            </div>
            <div className="cv2-info-check">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              {hasVerifiedEmail ? "Email Verified" : "Email Added"}
            </div>
          </div>
        </div>
      </form>

      <div className="cv2-bottom-split cv2-bottom-split-half" style={{ marginTop: "16px" }}>
        <form className="cv2-card" onSubmit={handleSave}>
          <div className="cv2-section-title">
            About Me
            {editMode === "profile_summary" ? (
              <button className="cv2-info-edit" disabled={isSaving} type="submit">Save</button>
            ) : (
              <button className="cv2-info-edit" onClick={() => setEditMode("profile_summary")} type="button">Edit</button>
            )}
          </div>

          {editMode === "profile_summary" ? (
            <textarea
              className="cv2-form-textarea"
              value={profileDraft.profile_summary}
              onChange={(event) => setProfileDraft((current) => ({ ...current, profile_summary: event.target.value }))}
            />
          ) : (
            <p className="cv2-about-text">
              {profileDraft.profile_summary || "Motivated sales professional with strong communication and customer-facing experience."}
            </p>
          )}
        </form>

        <div className="cv2-card">
          <div className="cv2-section-title">
            Skills
            <button className="cv2-info-edit" onClick={onOpenSkills} type="button">Edit</button>
          </div>

          <div className="cv2-chip-grid">
            {skillPills.map((skill) => (
              <span className="cv2-skill-pill" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
