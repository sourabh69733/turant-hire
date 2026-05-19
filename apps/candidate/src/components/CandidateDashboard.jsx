import React, { useEffect, useState } from "react";
import { CandidateSidebar } from "./CandidateSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { DashboardView } from "./DashboardView";
import { ProfileView } from "./ProfileView";
import { AvailabilityModal } from "./AvailabilityModal";
import { UtilityView } from "./UtilityView";

const utilityTabs = {
  skills: {
    title: "Skills",
    subtitle: "Review the strengths employers will see first and refine them as your candidate profile grows.",
    primaryActionLabel: "Back to profile",
    items: [
      {
        title: "Top Skills",
        description: "These tags are derived from your current candidate summary so the app can present something useful right away.",
        points: ["Lead Generation", "Communication", "Sales", "Customer Handling"],
      },
      {
        title: "Next Improvement",
        description: "A dedicated skills editor can be added next once you want structured tags, confidence levels, and role-specific grouping.",
        points: ["Structured skill tags", "Experience highlights", "Priority ordering for employers"],
      },
    ],
  },
  verifications: {
    title: "Verifications",
    subtitle: "Keep your identity and contact details trustworthy so employers can act on your profile quickly.",
    primaryActionLabel: "Open profile",
    items: [
      {
        title: "Contact Status",
        description: "Your phone and email indicators can live here as a dedicated trust section instead of being buried inside profile details.",
        points: ["Phone verified", "Email connected", "Readiness signal visible"],
      },
      {
        title: "What can come next",
        description: "This area is ready for KYC, document checks, and employer-facing trust badges whenever you want to expand the workflow.",
        points: ["ID verification", "Reference checks", "Verified badge states"],
      },
    ],
  },
  documents: {
    title: "Documents",
    subtitle: "This section is now reachable from the UI and gives us a clear place to add resume and proof uploads next.",
    primaryActionLabel: "Open profile",
    items: [
      {
        title: "Candidate Files",
        description: "Resume, certificates, and proof-of-work uploads can plug into this layout without changing the rest of the dashboard.",
        points: ["Resume upload", "Experience proofs", "Training certificates"],
      },
      {
        title: "Employer Readiness",
        description: "A documents workflow helps employers review the candidate faster before outreach or interview scheduling.",
        points: ["Quick review list", "Missing file prompts", "Approval or pending states"],
      },
    ],
  },
  messages: {
    title: "Messages",
    subtitle: "Notifications and employer conversations now have a working destination instead of a dead button.",
    primaryActionLabel: "Go to overview",
    items: [
      {
        title: "Recent Activity",
        description: "This can become the inbox for employer interest, follow-ups, and ops nudges.",
        points: ["2 unread updates", "Match requests", "Interview follow-ups"],
      },
      {
        title: "Why this matters",
        description: "Candidates need a clear place to understand what happened after they became visible and ready to work.",
        points: ["Status timeline", "Employer responses", "Next recommended action"],
      },
    ],
  },
  settings: {
    title: "Settings",
    subtitle: "Travel radius, notification controls, and profile preferences now have a proper destination in the app.",
    primaryActionLabel: "Back to profile",
    items: [
      {
        title: "Profile Preferences",
        description: "This is the right home for travel radius, shift defaults, and other profile-level preferences.",
        points: ["Travel radius up to 15 km", "Preferred shift defaults", "Visibility preferences"],
      },
      {
        title: "App Controls",
        description: "You can grow this into account settings, notification preferences, and support controls without redesigning the layout again.",
        points: ["Notification settings", "Language preferences", "Account support"],
      },
    ],
  },
};

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

  function handleProfileSave(event) {
    event.preventDefault();
    onProfileSave(profileDraft);
  }

  function handleAvailabilitySave(event) {
    event.preventDefault();
    onAvailabilitySave(availabilityDraft).then(() => setIsEditingAvailability(false));
  }

  function handleTabChange(nextTab) {
    if (nextTab === "availability") {
      setIsEditingAvailability(true);
      return;
    }
    setActiveTab(nextTab);
  }

  function renderUtilityTab(tabKey) {
    const tab = utilityTabs[tabKey];
    if (!tab) {
      return null;
    }

    return (
      <UtilityView
        title={tab.title}
        subtitle={tab.subtitle}
        items={tab.items}
        primaryActionLabel={tab.primaryActionLabel}
        onPrimaryAction={() => setActiveTab(tabKey === "messages" ? "overview" : "profile")}
      />
    );
  }

  return (
    <div className="candidate-v2">
      <div className="cv2-container">
        <CandidateSidebar activeTab={activeTab} setActiveTab={handleTabChange} onSignOut={onSignOut} />

        <main className="cv2-main">
          <header className="cv2-header">
            <div className="cv2-mobile-only">
              <svg className="cv2-brand-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              TurantHire
            </div>

            <div className="cv2-header-actions">
              <button className="cv2-header-icon" onClick={() => setActiveTab("messages")} type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </button>

              <button className="cv2-header-profile" onClick={() => setActiveTab("profile")} type="button">
                <div className="cv2-avatar-sm">{initials}</div>
                <span className="cv2-header-name">{profile.full_name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--c-text-muted)" }}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <button className="cv2-header-icon cv2-mobile-menu" onClick={() => setActiveTab("settings")} type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
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
              profile={profile}
              profileDraft={profileDraft}
              setProfileDraft={setProfileDraft}
              saveProfile={handleProfileSave}
              isSaving={isSaving}
              onPreviewProfile={() => setActiveTab("overview")}
              onOpenAvailability={() => setIsEditingAvailability(true)}
              onOpenVerifications={() => setActiveTab("verifications")}
              onOpenSettings={() => setActiveTab("settings")}
              onOpenSkills={() => setActiveTab("skills")}
            />
          ) : null}

          {activeTab === "skills" ? renderUtilityTab("skills") : null}
          {activeTab === "verifications" ? renderUtilityTab("verifications") : null}
          {activeTab === "documents" ? renderUtilityTab("documents") : null}
          {activeTab === "messages" ? renderUtilityTab("messages") : null}
          {activeTab === "settings" ? renderUtilityTab("settings") : null}
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
