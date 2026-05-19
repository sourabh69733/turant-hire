import React from "react";

function ProfileFieldCard({
  label,
  icon,
  editKey,
  editMode,
  isSaving,
  value,
  onEdit,
  onCancel,
  children,
}) {
  const isEditing = editMode === editKey;

  return (
    <div className="cv2-info-item">
      <div className="cv2-info-item-header">
        {icon}
        {editKey ? (
          isEditing ? (
            <div className="cv2-inline-actions">
              <button className="cv2-info-edit" disabled={isSaving} type="submit">
                Save
              </button>
              <button className="cv2-info-edit cv2-info-edit-muted" onClick={onCancel} type="button">
                Cancel
              </button>
            </div>
          ) : (
            <button className="cv2-info-edit" onClick={() => onEdit(editKey)} type="button">
              Edit
            </button>
          )
        ) : null}
      </div>
      <div>
        <span className="cv2-info-label">{label}</span>
        {isEditing ? children : <div className="cv2-info-value">{value}</div>}
      </div>
    </div>
  );
}

export function ProfileView({
  error,
  profile,
  profileDraft,
  setProfileDraft,
  saveProfile,
  isSaving,
  onClearError,
  onPreviewProfile,
  onOpenAvailability,
}) {
  const [editMode, setEditMode] = React.useState(null);
  const hasVerifiedPhone = Boolean(profile.phone);
  const hasVerifiedEmail = Boolean(profile.email);

  async function handleSave(event) {
    try {
      await saveProfile(event);
      setEditMode(null);
    } catch {
      // Keep the field open when the API rejects the update.
    }
  }

  function handleCancel() {
    setEditMode(null);
    onClearError?.();
    setProfileDraft({
      full_name: profile.full_name,
      primary_role: profile.primary_role,
      location: profile.location,
      expected_pay: profile.expected_pay,
      profile_summary: profile.profile_summary,
    });
  }

  return (
    <div className="cv2-profile">
      {error ? <div className="candidate-banner candidate-banner-inline">{error}</div> : null}

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
        <ProfileFieldCard
          label="Full Name"
          icon={(
            <svg className="cv2-info-icon blue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
          editKey="full_name"
          editMode={editMode}
          isSaving={isSaving}
          value={profileDraft.full_name}
          onEdit={setEditMode}
          onCancel={handleCancel}
        >
          <input
            className="cv2-form-input"
            type="text"
            value={profileDraft.full_name}
            onChange={(event) => setProfileDraft((current) => ({ ...current, full_name: event.target.value }))}
            onFocus={onClearError}
          />
        </ProfileFieldCard>

        <ProfileFieldCard
          label="Primary Role"
          icon={(
            <svg className="cv2-info-icon blue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          )}
          editKey="primary_role"
          editMode={editMode}
          isSaving={isSaving}
          value={profileDraft.primary_role}
          onEdit={setEditMode}
          onCancel={handleCancel}
        >
          <input
            className="cv2-form-input"
            type="text"
            value={profileDraft.primary_role}
            onChange={(event) => setProfileDraft((current) => ({ ...current, primary_role: event.target.value }))}
            onFocus={onClearError}
          />
        </ProfileFieldCard>

        <ProfileFieldCard
          label="Location"
          icon={(
            <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          )}
          editKey="location"
          editMode={editMode}
          isSaving={isSaving}
          value={profileDraft.location}
          onEdit={setEditMode}
          onCancel={handleCancel}
        >
          <input
            className="cv2-form-input"
            type="text"
            value={profileDraft.location}
            onChange={(event) => setProfileDraft((current) => ({ ...current, location: event.target.value }))}
            onFocus={onClearError}
          />
        </ProfileFieldCard>

        <ProfileFieldCard
          label="Expected Pay"
          icon={(
            <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          )}
          editKey="expected_pay"
          editMode={editMode}
          isSaving={isSaving}
          value={profileDraft.expected_pay}
          onEdit={setEditMode}
          onCancel={handleCancel}
        >
          <input
            className="cv2-form-input"
            type="text"
            value={profileDraft.expected_pay}
            onChange={(event) => setProfileDraft((current) => ({ ...current, expected_pay: event.target.value }))}
            onFocus={onClearError}
          />
        </ProfileFieldCard>

        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <button className="cv2-info-edit" onClick={onOpenAvailability} type="button">
              Edit
            </button>
          </div>
          <div>
            <span className="cv2-info-label">Availability</span>
            <div className="cv2-info-value">{profile.availability}</div>
          </div>
        </div>

        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon green" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <span className="cv2-info-label">Contact Verification</span>
            <div className="cv2-info-value cv2-info-value-sm">{hasVerifiedPhone ? "Phone verified" : "Phone missing"}</div>
            <div className="cv2-info-subvalue">{hasVerifiedEmail ? "Email connected" : "Email missing"}</div>
          </div>
        </div>
      </form>

      <div className="cv2-bottom-split cv2-bottom-split-single">
        <form className="cv2-card" onSubmit={handleSave}>
          <div className="cv2-section-title">
            About Me
            {editMode === "profile_summary" ? (
              <div className="cv2-inline-actions">
                <button className="cv2-info-edit" disabled={isSaving} type="submit">
                  Save
                </button>
                <button className="cv2-info-edit cv2-info-edit-muted" onClick={handleCancel} type="button">
                  Cancel
                </button>
              </div>
            ) : (
              <button className="cv2-info-edit" onClick={() => setEditMode("profile_summary")} type="button">
                Edit
              </button>
            )}
          </div>

          {editMode === "profile_summary" ? (
            <textarea
              className="cv2-form-textarea"
              value={profileDraft.profile_summary}
              onChange={(event) => setProfileDraft((current) => ({ ...current, profile_summary: event.target.value }))}
              onFocus={onClearError}
            />
          ) : (
            <p className="cv2-about-text cv2-about-text-strong">
              {profileDraft.profile_summary || "Add a short summary so employers understand your profile quickly."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
