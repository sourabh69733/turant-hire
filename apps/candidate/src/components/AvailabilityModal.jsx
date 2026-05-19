import React, { useEffect, useState } from "react";

const availabilityOptions = [
  {
    value: "Immediately",
    label: "Immediately",
    description: "Available to start right away",
  },
  {
    value: "Within 1 Week",
    label: "Within 1 Week",
    description: "Best for near-term roles",
  },
  {
    value: "Within 2 Weeks",
    label: "Within 2 Weeks",
    description: "Useful for scheduled joining",
  },
  {
    value: "Custom Date",
    label: "Custom Date",
    description: "Choose a specific date",
  },
];

function isCustomAvailability(value) {
  return value && !availabilityOptions.some((option) => option.value === value);
}

export function AvailabilityModal({
  availabilityDraft,
  setAvailabilityDraft,
  saveAvailability,
  isSaving,
  onClose,
}) {
  const [customDate, setCustomDate] = useState("");

  useEffect(() => {
    if (isCustomAvailability(availabilityDraft.availability)) {
      setCustomDate(availabilityDraft.availability);
    } else {
      setCustomDate("");
    }
  }, [availabilityDraft.availability]);

  const selectedAvailability = isCustomAvailability(availabilityDraft.availability)
    ? "Custom Date"
    : availabilityDraft.availability;

  const displayAvailability = selectedAvailability === "Custom Date" && customDate
    ? customDate
    : availabilityDraft.availability;

  function handleAvailabilityChange(nextValue) {
    if (nextValue === "Custom Date") {
      setAvailabilityDraft((current) => ({
        ...current,
        availability: customDate || current.availability || "Custom Date",
      }));
      return;
    }

    setAvailabilityDraft((current) => ({
      ...current,
      availability: nextValue,
    }));
  }

  function handleCustomDateChange(nextValue) {
    setCustomDate(nextValue);
    setAvailabilityDraft((current) => ({
      ...current,
      availability: nextValue || "Custom Date",
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    saveAvailability(event);
  }

  return (
    <div className="cv2-modal-overlay" onClick={onClose}>
      <form className="cv2-modal" onClick={(event) => event.stopPropagation()} onSubmit={handleSave}>
        <div className="cv2-modal-header">
          <h2 className="cv2-modal-title">Update Availability</h2>
          <button className="cv2-modal-close" onClick={onClose} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                onChange={(event) => setAvailabilityDraft((current) => ({ ...current, is_ready_now: event.target.checked }))}
              />
              <span className="cv2-slider" />
            </label>
          </div>

          <div className="cv2-modal-grid">
            <div className="cv2-form-group">
              <label className="cv2-form-label">When can you start?</label>

              <div className="cv2-radio-stack">
                {availabilityOptions.map((option) => (
                  <div className="cv2-radio-option" key={option.value}>
                    <label className="cv2-radio-label">
                      <input
                        type="radio"
                        name="availability"
                        checked={selectedAvailability === option.value}
                        onChange={() => handleAvailabilityChange(option.value)}
                      />
                      {option.label}
                    </label>
                    <span className="cv2-radio-sub">{option.description}</span>

                    {option.value === "Custom Date" && selectedAvailability === "Custom Date" ? (
                      <input
                        className="cv2-date-input"
                        type="date"
                        value={customDate}
                        onChange={(event) => handleCustomDateChange(event.target.value)}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="cv2-form-group">
              <label className="cv2-form-label">What employers see</label>

              <div className="cv2-preview-card">
                <div className={`cv2-preview-badge ${availabilityDraft.is_ready_now ? "" : "muted"}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {availabilityDraft.is_ready_now ? "READY NOW" : "NOT READY"}
                </div>
                <h3 className="cv2-preview-title">This is the timing employers will see.</h3>
                <p>
                  Employers will see you as {availabilityDraft.is_ready_now ? "ready now" : "not immediately available"} with
                  an availability of {displayAvailability.toLowerCase()}.
                </p>
                <div className="cv2-preview-accent">
                  <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                    <path d="M13 48c10-9 18-12 27-12 6 0 10 1 17 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="m37 20 18 10-18 10 5-10-5-10Z" fill="currentColor" />
                  </svg>
                </div>
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
            <button className="cv2-btn-save" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
