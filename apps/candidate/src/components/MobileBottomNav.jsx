import React from "react";

export function MobileBottomNav({ activeTab, setActiveTab }) {
  const navItems = [
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
      label: "Profile",
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
    <nav className="cv2-mobile-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`cv2-mnav-item ${activeTab === item.id ? "active" : ""}`}
          onClick={() => setActiveTab(item.id)}
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            {item.icon}
          </svg>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
