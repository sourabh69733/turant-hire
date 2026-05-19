import React from "react";

export function ProfileView({ profile, profileDraft, setProfileDraft, saveProfile, isSaving, setActiveTab }) {
  const [editMode, setEditMode] = React.useState(null);
  const hasVerifiedEmail = Boolean(profile.email);

  const handleEditClick = (field) => {
    setEditMode(field);
  };

  const handleSave = async (e) => {
    try {
      await saveProfile(e);
      setEditMode(null);
    } catch {
      // Keep the field in edit mode so the user can correct the invalid input.
    }
  };

  return (
    <div className="cv2-profile">
      <div className="cv2-page-header">
        <h1 className="cv2-page-title">Profile Details</h1>
        <p className="cv2-page-subtitle">Keep your profile complete and up to date for better matches.</p>
        <button
          className="cv2-btn-white"
          onClick={() => setActiveTab("overview")}
          style={{ border: "1px solid var(--c-border)", color: "var(--c-text-main)", marginTop: "16px", fontSize: "0.85rem", padding: "8px 16px" }}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Preview Profile
        </button>
      </div>

      <div className="cv2-card">
        <form className="cv2-info-grid" style={{ marginBottom: 0 }} onSubmit={handleSave}>
          {/* Primary Role */}
          <div className="cv2-info-item">
            <div className="cv2-info-item-header">
              <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              {editMode !== "role" ? (
                <button className="cv2-info-edit" onClick={() => handleEditClick("role")} type="button">Edit</button>
              ) : (
                <button className="cv2-info-edit" type="submit" disabled={isSaving}>Save</button>
              )}
            </div>
            <div>
              <span className="cv2-info-label">Primary Role</span>
              {editMode === "role" ? (
                <input
                  type="text"
                  style={{ width: "100%", padding: "4px", marginTop: "4px", border: "1px solid var(--c-border)", borderRadius: "4px" }}
                  value={profileDraft.primary_role}
                  onChange={(e) => setProfileDraft((curr) => ({ ...curr, primary_role: e.target.value }))}
                />
              ) : (
                <div className="cv2-info-value">{profileDraft.primary_role}</div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="cv2-info-item">
            <div className="cv2-info-item-header">
              <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {editMode !== "location" ? (
                <button className="cv2-info-edit" onClick={() => handleEditClick("location")} type="button">Edit</button>
              ) : (
                <button className="cv2-info-edit" type="submit" disabled={isSaving}>Save</button>
              )}
            </div>
            <div>
              <span className="cv2-info-label">Location</span>
              {editMode === "location" ? (
                <input
                  type="text"
                  style={{ width: "100%", padding: "4px", marginTop: "4px", border: "1px solid var(--c-border)", borderRadius: "4px" }}
                  value={profileDraft.location}
                  onChange={(e) => setProfileDraft((curr) => ({ ...curr, location: e.target.value }))}
                />
              ) : (
                <div className="cv2-info-value">{profileDraft.location}</div>
              )}
            </div>
          </div>

          {/* Expected Pay */}
          <div className="cv2-info-item">
            <div className="cv2-info-item-header">
              <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              {editMode !== "pay" ? (
                <button className="cv2-info-edit" onClick={() => handleEditClick("pay")} type="button">Edit</button>
              ) : (
                <button className="cv2-info-edit" type="submit" disabled={isSaving}>Save</button>
              )}
            </div>
            <div>
              <span className="cv2-info-label">Expected Pay</span>
              {editMode === "pay" ? (
                <input
                  type="text"
                  style={{ width: "100%", padding: "4px", marginTop: "4px", border: "1px solid var(--c-border)", borderRadius: "4px" }}
                  value={profileDraft.expected_pay}
                  onChange={(e) => setProfileDraft((curr) => ({ ...curr, expected_pay: e.target.value }))}
                />
              ) : (
                <div className="cv2-info-value">{profileDraft.expected_pay}</div>
              )}
            </div>
          </div>

          <div style={{ display: "none" }} />

          {/* Availability */}
          <div className="cv2-info-item" style={{ gridColumn: "1 / span 1" }}>
            <div className="cv2-info-item-header">
              <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <div>
              <span className="cv2-info-label">Availability</span>
              <div className="cv2-info-value">{profile.availability}</div>
            </div>
          </div>

          {/* Travel Radius */}
          <div className="cv2-info-item">
            <div className="cv2-info-item-header">
              <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <div>
              <span className="cv2-info-label">Travel Radius</span>
              <div className="cv2-info-value">Not added yet</div>
            </div>
          </div>

          {/* Contact Verification */}
          <div className="cv2-info-item" style={{ gridColumn: "3 / span 2" }}>
            <div className="cv2-info-item-header">
              <svg className="cv2-info-icon" style={{ color: "var(--c-green)" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
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
                {hasVerifiedEmail ? "Email Added" : "Email Missing"}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="cv2-bottom-split" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <form className="cv2-card" onSubmit={handleSave}>
          <div className="cv2-section-title">
            About Me
            {editMode !== "about" ? (
              <button className="cv2-info-edit" onClick={() => handleEditClick("about")} type="button">Edit</button>
            ) : (
              <button className="cv2-info-edit" type="submit" disabled={isSaving}>Save</button>
            )}
          </div>
          {editMode === "about" ? (
            <textarea
              style={{ width: "100%", padding: "8px", minHeight: "80px", border: "1px solid var(--c-border)", borderRadius: "4px" }}
              value={profileDraft.profile_summary}
              onChange={(e) => setProfileDraft((curr) => ({ ...curr, profile_summary: e.target.value }))}
            />
          ) : (
            <p className="cv2-about-text">
              {profileDraft.profile_summary || "No summary provided."}
            </p>
          )}
        </form>

        <div className="cv2-card">
          <div className="cv2-section-title">
            Profile Notes
          </div>
          <p className="cv2-about-text">
            More fields like skills, documents, and verification details can be added after the core candidate flow is stable.
          </p>
        </div>
      </div>
    </div>
  );
}
