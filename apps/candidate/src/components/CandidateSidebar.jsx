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
