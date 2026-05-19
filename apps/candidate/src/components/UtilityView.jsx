import React from "react";

export function UtilityView({ title, subtitle, items, primaryActionLabel, onPrimaryAction }) {
  return (
    <div className="cv2-utility-view">
      <div className="cv2-page-header">
        <div className="cv2-page-header-copy">
          <h1 className="cv2-page-title">{title}</h1>
          <p className="cv2-page-subtitle">{subtitle}</p>
        </div>

        {primaryActionLabel ? (
          <button className="cv2-btn-outline" onClick={onPrimaryAction} type="button">
            {primaryActionLabel}
          </button>
        ) : null}
      </div>

      <div className="cv2-utility-grid">
        {items.map((item) => (
          <div className="cv2-card" key={item.title}>
            <div className="cv2-section-title">{item.title}</div>
            <p className="cv2-about-text">{item.description}</p>
            {item.points?.length ? (
              <div className="cv2-utility-points">
                {item.points.map((point) => (
                  <div className="cv2-utility-point" key={point}>
                    <span className="cv2-utility-dot" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
