import { Link } from "react-router-dom";
import Sparkle from "./Sparkle";

const LINKS = [
  { to: "/profile", label: "Build Profile" },
  { to: "/career-alignment", label: "Career Paths" },
  { to: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-brand">
        <div className="app-footer-logo">
          <Sparkle className="sidebar-logo-mark" aria-hidden="true" />
          Skill<span>Lens</span> AI
        </div>
        <div className="app-footer-motto">Discover. Align. Grow.</div>
      </div>

      <p className="app-footer-desc">
        A machine-learning skill intelligence platform that turns a student's profile into a
        clear view of strengths, gaps and career fit.
      </p>

      <nav className="app-footer-nav">
        {LINKS.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="app-footer-bottom">
        <span>SkillLens AI — a college machine learning project</span>
      </div>
    </footer>
  );
}
