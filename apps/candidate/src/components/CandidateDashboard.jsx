import React, { useEffect, useState } from "react";
import { CandidateSidebar } from "./CandidateSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { DashboardView } from "./DashboardView";
import { ProfileView } from "./ProfileView";
import { AvailabilityModal } from "./AvailabilityModal";

export function CandidateDashboard({ profile, onProfileSave, onAvailabilitySave, onSignOut, isSaving, error, onClearError }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    full_name: profile.full_name,
    primary_role: profile.primary_role,
    location: profile.location,
    expected_pay: profile.expected_pay,
    profile_summary: profile.profile_summary,
  });
  const [availabilityDraft, setAvailabilityDraft] = useState({
    availability: profile.availability,
    is_ready_now: profile.is_ready_now,
  });

  useEffect(() => {
    setProfileDraft({
      full_name: profile.full_name,
      primary_role: profile.primary_role,
      location: profile.location,
      expected_pay: profile.expected_pay,
      profile_summary: profile.profile_summary,
    });
    setAvailabilityDraft({
      availability: profile.availability,
      is_ready_now: profile.is_ready_now,
    });
  }, [profile]);

  const initials = profile.full_name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleProfileSave(event) {
    event.preventDefault();
    return onProfileSave(profileDraft);
  }

  function handleAvailabilitySave(event) {
    event.preventDefault();
    return onAvailabilitySave(availabilityDraft).then(() => setIsEditingAvailability(false));
  }

  function handleTabChange(nextTab) {
    if (nextTab === "availability") {
      setIsEditingAvailability(true);
      return;
    }
    setActiveTab(nextTab);
  }

  return (
    <div className="candidate-v2">
      <div className="cv2-container">
        <CandidateSidebar activeTab={activeTab} setActiveTab={handleTabChange} onSignOut={onSignOut} />

        <main className="cv2-main">
          {error ? <div className="candidate-banner candidate-banner-inline">{error}</div> : null}

          <header className="cv2-header">
            <div className="cv2-mobile-only">
              <svg className="cv2-brand-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              TurantHire
            </div>

            <div className="cv2-header-actions">
              <button className="cv2-header-profile" onClick={() => setActiveTab("profile")} type="button">
                <div className="cv2-avatar-sm">{initials}</div>
                <span className="cv2-header-name">{profile.full_name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-text-muted)" }}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </header>

          {activeTab === "overview" ? (
            <DashboardView
              profile={profile}
              setActiveTab={handleTabChange}
              openAvailabilityModal={() => setIsEditingAvailability(true)}
            />
          ) : null}

          {activeTab === "profile" ? (
            <ProfileView
              error={error}
              profile={profile}
              profileDraft={profileDraft}
              setProfileDraft={setProfileDraft}
              saveProfile={handleProfileSave}
              isSaving={isSaving}
              onClearError={onClearError}
              onPreviewProfile={() => setActiveTab("overview")}
              onOpenAvailability={() => setIsEditingAvailability(true)}
            />
          ) : null}
        </main>
      </div>

      <MobileBottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {isEditingAvailability ? (
        <AvailabilityModal
          availabilityDraft={availabilityDraft}
          setAvailabilityDraft={setAvailabilityDraft}
          saveAvailability={handleAvailabilitySave}
          isSaving={isSaving}
          onClose={() => setIsEditingAvailability(false)}
        />
      ) : null}
    </div>
  );
}
