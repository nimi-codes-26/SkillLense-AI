import { NavLink } from "react-router-dom";
import Sparkle from "./Sparkle";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
  { to: "/analysis", label: "Analysis" },
  { to: "/career-alignment", label: "Career Alignment" },
  { to: "/skill-gap", label: "Skill Gap" },
  { to: "/about", label: "About" },
];

export default function Sidebar({ open, onNavigate }) {
  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <Sparkle className="sidebar-logo-mark" aria-hidden="true" />
          Skill<span>Lens</span> AI
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">Student Skill Profiling &amp; Career Gap Analysis</div>
      </aside>

      <div
        className={`sidebar-scrim ${open ? "visible" : ""}`}
        onClick={onNavigate}
        aria-hidden="true"
      />
    </>
  );
}
