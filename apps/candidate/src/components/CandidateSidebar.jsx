import React from "react";

export function CandidateSidebar({ activeTab, setActiveTab, onSignOut }) {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <path
          d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="currentColor"
        />
      ),
    },
    {
      id: "profile",
      label: "My Profile",
      icon: (
        <>
          <path
            d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            stroke="currentColor"
          />
          <circle
            cx="12"
            cy="7"
            r="4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            stroke="currentColor"
          />
        </>
      ),
    },
    {
      id: "availability",
      label: "Availability",
      icon: (
        <>
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            stroke="currentColor"
          />
          <polyline
            points="12 6 12 12 16 14"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            stroke="currentColor"
          />
        </>
      ),
    },
    {
      id: "verifications",
      label: "Verifications",
      icon: (
        <>
          <rect x="4" y="5" width="16" height="15" rx="3" strokeWidth="2" fill="none" stroke="currentColor" />
          <path d="m8 12 3 3 5-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" />
        </>
      ),
    },
    {
      id: "documents",
      label: "Documents",
      icon: (
        <>
          <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" />
          <path d="M14 2v5h5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" />
        </>
      ),
    },
    {
      id: "messages",
      label: "Messages",
      badge: "2",
      icon: (
        <>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" />
        </>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <>
          <circle cx="12" cy="12" r="3" strokeWidth="2" fill="none" stroke="currentColor" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-.33-1 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.33H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1-.33 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82L4.3 6.46a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 .33 1 1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c0 .39.14.76.4 1 .26.24.61.36.96.34H21a2 2 0 0 1 0 4h-.24c-.35-.02-.7.1-.96.34-.26.24-.4.61-.4 1.32Z" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" />
        </>
      ),
    },
  ];

  return (
    <aside className="cv2-sidebar">
      <div className="cv2-brand">
        <svg
          className="cv2-brand-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        TurantHire
      </div>

      <nav className="cv2-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`cv2-nav-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            <svg viewBox="0 0 24 24">{tab.icon}</svg>
            {tab.label}
            {tab.badge && <span className="cv2-nav-badge">{tab.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="cv2-sidebar-bottom">
        <button className="cv2-nav-item" onClick={onSignOut} type="button">
          <svg viewBox="0 0 24 24">
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              stroke="currentColor"
            />
            <polyline
              points="16 17 21 12 16 7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              stroke="currentColor"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              stroke="currentColor"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
