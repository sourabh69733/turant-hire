import React, { useMemo } from "react";

export function DashboardView({ profile, setActiveTab, openAvailabilityModal }) {
  const initials = profile.full_name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const completionPercent = useMemo(() => {
    const checks = [
      profile.full_name,
      profile.phone,
      profile.primary_role,
      profile.location,
      profile.expected_pay,
      profile.availability,
      profile.profile_summary,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  const statusCopy = profile.is_ready_now ? "Visible to employers now" : "Turn on readiness to get urgent matches";
  const expectedPay = profile.expected_pay || "Add expected pay";
  const lastUpdated = profile.updated_at
    ? new Date(profile.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "Recently";

  return (
    <div className="cv2-dashboard">
      <div className="cv2-hero-grid">
        <div className="cv2-card cv2-hero-profile">
          <div className="cv2-profile-top">
            <div className="cv2-avatar-stack">
              <div className="cv2-avatar-lg">{initials}</div>
              <span className="cv2-avatar-status" />
            </div>
            <div className="cv2-profile-info">
              <h1>{profile.full_name}</h1>
              <p className="cv2-profile-role">{profile.primary_role}</p>
              <div className="cv2-profile-meta">
                <span className="cv2-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {profile.location}
                </span>
                <span className="cv2-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" x2="9.01" y1="9" y2="9" />
                    <line x1="15" x2="15.01" y1="9" y2="9" />
                  </svg>
                  1.5 Years Exp
                </span>
                <span className="cv2-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  {profile.availability}
                </span>
              </div>
              <div className="cv2-profile-tags">
                <span className="cv2-tag cv2-tag-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12h4l3-9 5 18 3-9h5" />
                  </svg>
                  Visible to employers
                </span>
                <span className={`cv2-tag ${profile.is_ready_now ? "cv2-tag-orange" : "cv2-tag-gray"}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  {profile.is_ready_now ? "Ready Now" : "Not Ready"}
                </span>
              </div>
            </div>
          </div>

          <div className="cv2-profile-stats">
            <div className="cv2-stat">
              <span className="cv2-stat-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Phone Verified
              </span>
              <span className="cv2-stat-value">{profile.phone || "Not provided"}</span>
            </div>
            <div className="cv2-stat">
              <span className="cv2-stat-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Preferred Shift
              </span>
              <span className="cv2-stat-value">{profile.is_ready_now ? "Day Shift" : statusCopy}</span>
            </div>
            <div className="cv2-stat">
              <span className="cv2-stat-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6" />
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 8v6h6" />
                </svg>
                Last Updated
              </span>
              <span className="cv2-stat-value">{lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className={`cv2-ready-card ${profile.is_ready_now ? "" : "cv2-ready-card-muted"}`}>
          <div className="cv2-ready-top">
            <span className="cv2-ready-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              {profile.is_ready_now ? "READY NOW" : "NOT READY"}
            </span>
            <div className="cv2-ready-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          </div>

          <div className="cv2-ready-copy">
            <p className="cv2-ready-eyebrow">You are</p>
            <h2>{profile.is_ready_now ? "READY NOW!" : "AVAILABLE SOON"}</h2>
            <p>{profile.is_ready_now ? "Employers can see you and match faster." : "Update your timeline so employers know when to reach out."}</p>
          </div>

          <button className="cv2-btn-white" onClick={openAvailabilityModal} type="button">
            Update Availability
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          <div className="cv2-progress-section">
            <div className="cv2-progress-top">
              <span>Profile Completeness</span>
              <span>{completionPercent}%</span>
            </div>
            <div className="cv2-progress-bar">
              <div className="cv2-progress-fill" style={{ width: `${completionPercent}%` }} />
            </div>
            <button
              className="cv2-progress-link"
              onClick={() => setActiveTab("profile")}
              style={{ background: "transparent", border: "none", padding: 0 }}
              type="button"
            >
              Complete your profile
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="cv2-info-grid">
        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon blue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div>
            <span className="cv2-info-label">Primary Role</span>
            <div className="cv2-info-value">{profile.primary_role}</div>
          </div>
        </div>

        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <span className="cv2-info-label">Location</span>
            <div className="cv2-info-value">{profile.location}</div>
          </div>
        </div>

        <div className="cv2-info-item">
          <div className="cv2-info-item-header">
            <svg className="cv2-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <span className="cv2-info-label">Expected Pay</span>
            <div className="cv2-info-value">{expectedPay}</div>
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
            <span className="cv2-info-label">Contact Verified</span>
            <div className="cv2-info-value cv2-info-value-sm">{profile.phone ? "Phone & Email" : "Add phone number"}</div>
          </div>
        </div>
      </div>

      <div className="cv2-bottom-split">
        <div className="cv2-card">
          <div className="cv2-section-title">About Me</div>
          <p className="cv2-about-text">
            {profile.profile_summary || "Add a short summary so employers understand your experience and availability quickly."}
          </p>
          <button
            className="cv2-link"
            style={{ background: "transparent", border: "none", padding: 0 }}
            onClick={() => setActiveTab("profile")}
            type="button"
          >
            View full profile
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="cv2-card">
          <div className="cv2-section-title">Quick Actions</div>
          <div className="cv2-action-list">
            <button className="cv2-action-item" onClick={() => setActiveTab("profile")} type="button">
              <div className="cv2-action-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </div>
              <div className="cv2-action-text">
                <div className="cv2-action-title">Edit Profile</div>
                <div className="cv2-action-desc">Update your skills, experience and more</div>
              </div>
              <svg className="cv2-action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <button className="cv2-action-item" onClick={openAvailabilityModal} type="button">
              <div className="cv2-action-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </div>
              <div className="cv2-action-text">
                <div className="cv2-action-title">Update Availability</div>
                <div className="cv2-action-desc">Change your current readiness and start timing</div>
              </div>
              <svg className="cv2-action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
