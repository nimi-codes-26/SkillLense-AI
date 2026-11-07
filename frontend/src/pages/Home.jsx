import { useNavigate } from "react-router-dom";
import Sparkle from "../components/Sparkle";
import MetricCard from "../components/MetricCard";
import DiscoverAlignGrow from "../components/DiscoverAlignGrow";
import CareerPathExplorer from "../components/CareerPathExplorer";
import Reveal from "../components/Reveal";

// Example values only, for the illustrative preview cards below the hero -
// these are never presented as a real prediction (see the caption in the UI).
const PREVIEW_METRICS = [
  { variant: "rose", eyebrow: "Career Readiness", value: "78%", sub: "Career Ready", bar: 78 },
  { variant: "gold", eyebrow: "Best Match", value: "Data Analyst", sub: "86% Match", bar: 86, compactValue: true },
  { variant: "violet", eyebrow: "Profile", value: "9", sub: "Skills Analysed", dots: 9, filledDots: 9 },
  { variant: "mint", eyebrow: "Improvement", value: "03", sub: "Skills to Strengthen", dots: 9, filledDots: 3 },
];

const SNAPSHOT_SKILLS = [
  { label: "Coding", value: 92 },
  { label: "DSA", value: 84 },
  { label: "Projects", value: 76 },
  { label: "Communication", value: 68 },
];

const PIPELINE_STEPS = [
  "Your Profile",
  "Skill Analysis",
  "Pattern Identification",
  "Career Fit",
  "Skill Gaps",
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="hero-split">
        <div className="hero-copy">
          <div className="eyebrow">Skill Intelligence Platform</div>
          <h1>
            Map your skills.
            <br />
            Find where they fit.
          </h1>
          <p>
            Understand your strengths, identify the gaps holding you back, and see how your
            current profile aligns with the paths you want to pursue.
          </p>

          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => navigate("/profile")}>
              Build My Skill Profile
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/career-alignment")}>
              Explore Career Paths
            </button>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-inner">
            <Sparkle className="hero-sparkle hero-sparkle-1" />
            <Sparkle className="hero-sparkle hero-sparkle-2" />
            <Sparkle className="hero-sparkle hero-sparkle-3" />
            <svg className="hero-orbit" viewBox="0 0 400 400" fill="none">
              <path d="M40,210 C120,140 260,120 360,90" stroke="var(--purple-200)" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" />
            </svg>

            <div className="hero-snapshot-card">
              <div className="hero-snapshot-header">
                <span className="metric-eyebrow">Skill Profile</span>
                <span className="hero-snapshot-title">Student Profile</span>
              </div>

              <div className="hero-snapshot-readiness">
                <span className="hero-snapshot-readiness-value">78%</span>
                <span className="metric-sub">Overall Readiness</span>
              </div>

              <div className="hero-snapshot-bars">
                {SNAPSHOT_SKILLS.map((skill) => (
                  <div key={skill.label} className="hero-snapshot-bar-row">
                    <span className="hero-snapshot-bar-label">{skill.label}</span>
                    <span className="hero-snapshot-bar-track">
                      <span className="hero-snapshot-bar-fill" style={{ width: `${skill.value}%` }} />
                    </span>
                    <span className="hero-snapshot-bar-value">{skill.value}</span>
                  </div>
                ))}
              </div>

              <div className="hero-snapshot-footer">
                <div>
                  <span className="hero-snapshot-footer-label">Top strength</span>
                  <span className="hero-snapshot-footer-value">Technical Foundation</span>
                </div>
                <div>
                  <span className="hero-snapshot-footer-label">Growth area</span>
                  <span className="hero-snapshot-footer-value">Communication</span>
                </div>
              </div>
            </div>

            <div className="hero-float-card hero-float-1">
              <span className="dot" />
              Role Fit <span className="value">86%</span>
            </div>
            <div className="hero-float-card hero-float-3">
              <span className="dot" />
              Skills Developed <span className="value">+12</span>
            </div>
            <div className="hero-float-card hero-float-4">
              <span className="dot" />
              Areas to Improve <span className="value">03</span>
            </div>
          </div>
          <div className="hero-visual-caption">Illustrative snapshot — not a live result</div>
        </div>
      </div>

      <Reveal className="section-gap">
        <DiscoverAlignGrow />
      </Reveal>

      <Reveal className="section-gap">
        <div className="form-section-title">What your report could look like</div>
        <div className="metric-row">
          {PREVIEW_METRICS.map((metric) => (
            <MetricCard
              key={metric.eyebrow}
              variant={metric.variant}
              eyebrow={metric.eyebrow}
              value={metric.value}
              sub={metric.sub}
              bar={metric.bar}
              dots={metric.dots ? { total: metric.dots, filled: metric.filledDots } : undefined}
              compactValue={metric.compactValue}
            />
          ))}
        </div>
        <p className="metric-note">
          Example values shown for illustration only - your own report is built entirely from
          your submitted profile.
        </p>
      </Reveal>

      <Reveal className="section-gap">
        <div className="eyebrow">Career Paths</div>
        <h2 style={{ marginTop: 8 }}>Explore where your skills could take you</h2>
        <p style={{ marginTop: 10, maxWidth: 560 }}>
          Every path below is grouped by category. Live paths are scored by the current model -
          others are on the roadmap as the dataset grows.
        </p>
        <div className="section-gap">
          <CareerPathExplorer onSelectPath={() => navigate("/career-alignment")} />
        </div>
      </Reveal>

      <Reveal className="section-gap">
        <div className="eyebrow">How It Works</div>
        <h2 style={{ marginTop: 8 }}>From profile to career fit</h2>
        <div className="section-gap">
          <div className="pipeline-strip">
            {PIPELINE_STEPS.map((step, index) => (
              <div key={step} style={{ display: "contents" }}>
                <div className="pipeline-step">
                  <span className="pipeline-step-dot">0{index + 1}</span>
                  <span className="pipeline-step-label">{step}</span>
                </div>
                {index < PIPELINE_STEPS.length - 1 && <span className="pipeline-connector" />}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="section-gap">
        <div className="cta-panel">
          <div className="eyebrow">Get Started</div>
          <h2 style={{ marginTop: 10 }}>Ready to understand your skill profile?</h2>
          <p>Nine questions, one clear report - your strengths, gaps and best-fit path.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/profile")}>
            Build My Profile
          </button>
        </div>
      </Reveal>
    </div>
  );
}
