import React from "react";

export function AvailabilityModal({
  availabilityDraft,
  setAvailabilityDraft,
  saveAvailability,
  isSaving,
  onClose,
}) {
  const availabilityOptions = [
    "Immediately",
    "Within 1 Week",
    "Within 2 Weeks",
  ];

  const handleSave = (e) => {
    e.preventDefault();
    saveAvailability(e);
  };

  return (
    <div className="cv2-modal-overlay" onClick={onClose}>
      <form className="cv2-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
        <div className="cv2-modal-header">
          <h2 className="cv2-modal-title">Update Availability</h2>
          <button className="cv2-modal-close" onClick={onClose} type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cv2-modal-body">
          <div className="cv2-toggle-row">
            <div className="cv2-toggle-text">
              <h3>I am ready to work right now</h3>
              <p>Turn this on to get matched for immediate roles.</p>
            </div>
            <label className="cv2-switch">
              <input
                type="checkbox"
                checked={availabilityDraft.is_ready_now}
                onChange={(e) => setAvailabilityDraft((curr) => ({ ...curr, is_ready_now: e.target.checked }))}
              />
              <span className="cv2-slider" />
            </label>
          </div>

          <div className="cv2-modal-grid">
            <div className="cv2-form-group">
              <label className="cv2-form-label">When can you start?</label>

              {availabilityOptions.map((option, idx) => (
                <div key={option} style={{ marginTop: idx > 0 ? "8px" : "0" }}>
                  <label className="cv2-radio-label">
                    <input
                      type="radio"
                      name="availability"
                      checked={availabilityDraft.availability === option}
                      onChange={() => setAvailabilityDraft((curr) => ({ ...curr, availability: option }))}
                    />
                    {option}
                  </label>
                  {option === "Immediately" && (
                    <span className="cv2-radio-sub">Available to start right away</span>
                  )}
                </div>
              ))}
            </div>

            <div className="cv2-form-group">
              <label className="cv2-form-label">What employers see</label>
              <div className="cv2-preview-card">
                <div className="cv2-preview-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {availabilityDraft.is_ready_now ? "READY NOW" : "NOT READY"}
                </div>
                <p>
                  Employers will see you as {availabilityDraft.is_ready_now ? "ready now" : "not ready right now"} with
                  an availability of {availabilityDraft.availability.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cv2-modal-footer">
          <div className="cv2-footer-tip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            Tip: The more accurate your availability, the better your matches.
          </div>
          <div className="cv2-footer-actions">
            <button className="cv2-btn-cancel" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="cv2-btn-save" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
