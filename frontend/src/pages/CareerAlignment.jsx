import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/useProfile";
import { getCareerRoles } from "../api/api";
import CareerCard from "../components/CareerCard";
import CareerPathExplorer from "../components/CareerPathExplorer";
import { LoadingMessage, ErrorMessage } from "../components/StatusMessage";

export default function CareerAlignment() {
  const { profile, careerAlignmentResult, loading, error, analyzeProfile } = useProfile();
  const [roles, setRoles] = useState(null);
  const [rolesError, setRolesError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile && !careerAlignmentResult && !loading && !error) {
      analyzeProfile(profile);
    }
  }, [profile, careerAlignmentResult, loading, error, analyzeProfile]);

  useEffect(() => {
    getCareerRoles()
      .then(setRoles)
      .catch((err) => setRolesError(err.message));
  }, []);

  function handleSelectPath() {
    if (!profile) {
      navigate("/profile");
      return;
    }
    document.getElementById("your-role-fit")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const descriptionByRole = roles
    ? Object.fromEntries(roles.map((role) => [role.role, role.description]))
    : {};

  return (
    <div>
      <div className="eyebrow">Career Paths</div>
      <h2 style={{ marginTop: 8 }}>Explore where your skills could take you</h2>
      <p style={{ marginTop: 10, maxWidth: 580 }}>
        SkillLense currently scores your profile against a defined set of career paths, with more
        being added over time. "Best Match" means the highest alignment with that path's
        requirement profile - not a job offer, a guarantee, or a statement about which career you
        should pursue.
      </p>

      {profile && loading && <LoadingMessage text="Scoring your profile against every career path..." />}
      {profile && error && <ErrorMessage text={error} onRetry={() => analyzeProfile(profile)} />}
      {rolesError && <ErrorMessage text={rolesError} onRetry={() => setRolesError(null)} />}

      {profile && careerAlignmentResult && !loading && !error && (
        <div className="section-gap" id="your-role-fit">
          <h3>Your Role Fit</h3>
          <div className="grid grid-2 section-gap" style={{ marginTop: 16 }}>
            {careerAlignmentResult.all_role_results.map((result) => (
              <CareerCard
                key={result.role}
                role={result.role}
                description={descriptionByRole[result.role]}
                score={result.alignment_score}
                isBestMatch={result.role === careerAlignmentResult.best_match}
              />
            ))}
          </div>
        </div>
      )}

      {!profile && (
        <div className="section-gap card card-soft" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h3>See your own role fit</h3>
            <p style={{ marginTop: 6 }}>Build your skill profile to score it against every path below.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/profile")}>
            Build My Skill Profile
          </button>
        </div>
      )}

      <div className="section-gap">
        <h3>Explore Career Paths</h3>
        <p style={{ marginTop: 6, marginBottom: 20 }}>
          Live paths are scored by the current model. Paths marked "Coming next" are on the
          roadmap as the dataset grows.
        </p>
        <CareerPathExplorer
          onSelectPath={handleSelectPath}
          highlightRole={careerAlignmentResult?.best_match}
        />
      </div>
    </div>
  );
}
