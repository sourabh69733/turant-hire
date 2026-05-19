import React, { useEffect, useState } from "react";
import { CandidateSidebar } from "./CandidateSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { DashboardView } from "./DashboardView";
import { ProfileView } from "./ProfileView";
import { AvailabilityModal } from "./AvailabilityModal";

export function CandidateDashboard({ profile, onProfileSave, onAvailabilitySave, onSignOut, isSaving }) {
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

  const handleProfileSave = (event) => {
    event.preventDefault();
    onProfileSave(profileDraft);
  };

  const handleAvailabilitySave = (event) => {
    event.preventDefault();
    onAvailabilitySave(availabilityDraft).then(() => setIsEditingAvailability(false));
  };

  const handleTabChange = (nextTab) => {
    if (nextTab === "availability") {
      setIsEditingAvailability(true);
      return;
    }
    setActiveTab(nextTab);
  };

  return (
    <div className="candidate-v2">
      <div className="cv2-container">
        {/* Desktop Sidebar */}
        <CandidateSidebar activeTab={activeTab} setActiveTab={handleTabChange} onSignOut={onSignOut} />

        {/* Main Content Area */}
        <main className="cv2-main">
          {/* Header */}
          <header className="cv2-header">
            {/* Mobile Brand (hidden on desktop) */}
            <div className="cv2-header-brand cv2-mobile-only">
              <svg className="cv2-header-brand-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              TurantHire
            </div>

            {/* Action Items */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <button className="cv2-header-icon" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </button>

              <button className="cv2-header-profile" style={{ border: "none", background: "transparent", padding: 0 }} type="button">
                <div className="cv2-avatar-sm" style={{ display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, #dbe2ea 0%, #bfc8d4 100%)', color: '#1f2937', fontWeight: 800 }}>
                  {initials}
                </div>
                <span className="cv2-header-name">{profile.full_name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-text-muted)" }}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </header>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <DashboardView
              profile={profile}
              setActiveTab={handleTabChange}
              openAvailabilityModal={() => setIsEditingAvailability(true)}
            />
          )}

          {activeTab === "profile" && (
            <ProfileView
              profile={profile}
              profileDraft={profileDraft}
              setProfileDraft={setProfileDraft}
              saveProfile={handleProfileSave}
              isSaving={isSaving}
              setActiveTab={handleTabChange}
            />
          )}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Modals */}
      {isEditingAvailability && (
        <AvailabilityModal
          availabilityDraft={availabilityDraft}
          setAvailabilityDraft={setAvailabilityDraft}
          saveAvailability={handleAvailabilitySave}
          isSaving={isSaving}
          onClose={() => setIsEditingAvailability(false)}
        />
      )}
    </div>
  );
}
