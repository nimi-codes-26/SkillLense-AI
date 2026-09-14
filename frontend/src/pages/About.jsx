import DiscoverAlignGrow from "../components/DiscoverAlignGrow";

const STEPS = [
  "Student Profile — you enter your 9 skill features.",
  "Data Preprocessing — features are scaled using a StandardScaler fit only on training data.",
  "K-Means Clustering — training students are grouped by similarity to discover natural skill patterns.",
  "Skill Category Classification — a Random Forest model learns to reproduce those K-Means groupings for new students.",
  "Career Alignment — your profile is scored against each supported career path's requirement profile using plain arithmetic.",
  "Skill Gap Analysis — the largest gaps against your best-matching path are surfaced as priority areas.",
];

export default function About() {
  return (
    <div>
      <div className="eyebrow">About</div>
      <h2 style={{ marginTop: 8 }}>What is SkillLens AI?</h2>
      <p style={{ marginTop: 12, maxWidth: 620 }}>
        SkillLens AI turns a student's academic, technical and professional profile into a
        clear view of their strengths, gaps and career fit. It groups similar students to surface
        an interpretable skill category, then scores that profile against a growing set of
        career paths to highlight where the largest improvement opportunities are.
      </p>

      <div className="section-gap">
        <DiscoverAlignGrow />
      </div>

      <div className="section-gap">
        <h3>How It Works</h3>
        <ol className="about-steps section-gap" style={{ marginTop: 16 }}>
          {STEPS.map((step) => (
            <li key={step}>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <hr className="divider" />

      <div className="card card-soft">
        <h3>Two separate systems, on purpose</h3>
        <p style={{ marginTop: 10 }}>
          <strong>ML analysis</strong> (K-Means, Random Forest, and the exploratory DBSCAN/PCA
          notebooks) only ever describes a student's overall skill profile. K-Means creates
          interpretable pseudo-categories from patterns in the data; Random Forest learns to
          reproduce those categories for new students; DBSCAN and PCA are offline, exploratory
          tools used to understand the data, not part of the live prediction flow.
        </p>
        <p style={{ marginTop: 10 }}>
          <strong>Career alignment</strong> is a completely separate, transparent, rule-based
          comparison - plain subtraction against fixed requirement numbers. No machine learning
          model is involved in deciding a "best match" path.
        </p>
      </div>

      <div className="card card-soft section-gap">
        <h3>Built to grow</h3>
        <p style={{ marginTop: 10 }}>
          The Career Paths page groups every path SkillLense knows about into categories. Paths
          scored by the current model are clickable; paths marked "Coming next" are on the
          roadmap. Supporting a new path later is a data and training exercise, not a redesign -
          the architecture was built to extend, not to stay fixed at five.
        </p>
      </div>

      <p className="methodology-note">
        The dataset used in this project is synthetically generated for academic purposes, and
        the skill categories are pseudo-labels derived from clustering, not verified real-world
        outcomes. Career path requirements are illustrative, project-defined assumptions, not
        official industry or hiring standards. Nothing in this application should be read as a
        guarantee of employability or career success.
      </p>
    </div>
  );
}
