import { CAREER_PATH_CATEGORIES } from "../constants/careerPaths";

// Renders the full career-path taxonomy. Paths tied to a real, model-backed
// role (`roleKey` set) are clickable and call `onSelectPath`. Paths with no
// `roleKey` render as a muted "Coming next" card - visible (so the platform
// reads as extensible) but never wired to a fabricated result.
export default function CareerPathExplorer({ onSelectPath, highlightRole }) {
  return (
    <div className="path-explorer">
      {CAREER_PATH_CATEGORIES.map((group) => (
        <div key={group.category} className="path-category">
          <div className="path-category-title">{group.category}</div>
          <div className="path-grid">
            {group.paths.map((path) => {
              const isLive = Boolean(path.roleKey);
              const isActive = isLive && path.roleKey === highlightRole;
              return (
                <button
                  key={path.label}
                  type="button"
                  disabled={!isLive}
                  onClick={isLive ? () => onSelectPath(path.roleKey) : undefined}
                  className={`path-card ${isLive ? "path-card--live" : "path-card--soon"} ${isActive ? "path-card--active" : ""}`}
                >
                  <span>{path.label}</span>
                  {!isLive && <span className="path-card-tag">Coming next</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
