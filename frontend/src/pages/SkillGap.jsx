import { useEffect } from "react";
import { useProfile } from "../context/useProfile";
import { FEATURE_LABELS } from "../constants/fields";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import { LoadingMessage, ErrorMessage } from "../components/StatusMessage";

export default function SkillGap() {
  const { profile, careerAlignmentResult, loading, error, analyzeProfile } = useProfile();

  useEffect(() => {
    if (profile && !careerAlignmentResult && !loading && !error) {
      analyzeProfile(profile);
    }
  }, [profile, careerAlignmentResult, loading, error, analyzeProfile]);

  if (!profile) {
    return (
      <EmptyState
        title="No growth areas identified yet"
        description="Complete your profile and we'll surface exactly what's worth building next."
      />
    );
  }

  if (loading) {
    return <LoadingMessage text="Evaluating your priority growth areas..." />;
  }

  if (error) {
    return <ErrorMessage text={error} onRetry={() => analyzeProfile(profile)} />;
  }

  if (!careerAlignmentResult) {
    return null;
  }

  const bestMatchResult = careerAlignmentResult.all_role_results.find(
    (result) => result.role === careerAlignmentResult.best_match
  );

  return (
    <div>
      <div className="eyebrow">Best Match</div>
      <h2 style={{ marginTop: 8 }}>{careerAlignmentResult.best_match}</h2>

      <div className="section-gap" style={{ maxWidth: 260 }}>
        <StatCard label="Alignment" value={`${careerAlignmentResult.best_match_score}%`} />
      </div>

      <div className="section-gap">
        <h3>Priority Areas</h3>

        {bestMatchResult.skill_gaps.length === 0 ? (
          <div className="positive-state section-gap" style={{ marginTop: 16 }}>
            <span className="dot" />
            <span>
              You already meet or exceed every requirement for {careerAlignmentResult.best_match}{" "}
              in this project's requirement profile.
            </span>
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            {bestMatchResult.skill_gaps.map((gap) => (
              <div key={gap.feature} className="gap-row">
                <div className="gap-row-feature">{FEATURE_LABELS[gap.feature] ?? gap.feature}</div>
                <div className="gap-row-values">
                  Your level {gap.actual} → Required level {gap.required}
                </div>
                <div className="gap-row-amount">-{gap.gap}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="methodology-note">
        Gaps are calculated with a transparent formula (required level minus your actual level,
        floored at zero) against this project's illustrative requirement profile - not a
        real-world hiring standard.
      </p>
    </div>
  );
}
