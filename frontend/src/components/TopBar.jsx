import { useLocation } from "react-router-dom";

const PAGE_INFO = {
  "/": { title: "Home", subtitle: "Skill intelligence for career growth" },
  "/profile": { title: "Profile", subtitle: "Enter your current skill levels" },
  "/analysis": { title: "Analysis", subtitle: "Your Skill Intelligence Report" },
  "/career-alignment": { title: "Career Alignment", subtitle: "Explore and score career paths" },
  "/skill-gap": { title: "Skill Gap", subtitle: "Priority areas for your best-matching path" },
  "/about": { title: "About", subtitle: "How SkillLens AI works" },
};

export default function TopBar({ onToggleSidebar }) {
  const location = useLocation();
  const info = PAGE_INFO[location.pathname] ?? { title: "SkillLens AI", subtitle: "" };

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{info.title}</div>
        {info.subtitle && <div className="topbar-subtitle">{info.subtitle}</div>}
      </div>

      <button
        type="button"
        className="topbar-menu-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </header>
  );
}
