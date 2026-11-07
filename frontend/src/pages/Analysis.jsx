import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/useProfile";
import { FIELD_GROUPS, ALL_FIELDS, FEATURE_LABELS } from "../constants/fields";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import SkillBar from "../components/SkillBar";
import MetricCard from "../components/MetricCard";
import ReportSection from "../components/ReportSection";
import { LoadingMessage, ErrorMessage } from "../components/StatusMessage";

export default function Analysis() {
  const { profile, skillCategoryResult, careerAlignmentResult, loading, error, analyzeProfile } =
    useProfile();
  const navigate = useNavigate();

  // If a profile exists but we don't have a result yet (e.g. a fresh session
  // that restored the profile from localStorage before results were cached),
  // run the analysis automatically instead of showing a dead end.
  useEffect(() => {
    if (profile && !skillCategoryResult && !loading && !error) {
      analyzeProfile(profile);
    }
  }, [profile, skillCategoryResult, loading, error, analyzeProfile]);

  if (!profile) {
    return (
      <EmptyState
        title="Your Skill Intelligence Report is waiting"
        description="Complete your profile to see your strengths, gaps and best-fit path."
      />
    );
  }

  if (loading) {
    return <LoadingMessage text="Preparing your Skill Intelligence Report..." />;
  }

  if (error) {
    return <ErrorMessage text={error} onRetry={() => analyzeProfile(profile)} />;
  }

  if (!skillCategoryResult || !careerAlignmentResult) {
    return null;
  }

  const bestMatchResult = careerAlignmentResult.all_role_results.find(
    (result) => result.role === careerAlignmentResult.best_match
  );

  // "Strengths" here are simply the student's own highest-scoring submitted
  // features (value relative to that feature's max) - a plain sort of real
  // profile data, not a separate ML prediction.
  const strengths = [...ALL_FIELDS]
    .sort((a, b) => profile[b.key] / b.max - profile[a.key] / a.max)
    .slice(0, 3);

  const topGaps = bestMatchResult.skill_gaps.slice(0, 3);

  return (
    <div>
      <div className="eyebrow">Skill Intelligence Report</div>
      <h2 style={{ marginTop: 8 }}>Your profile, at a glance</h2>

      <ReportSection number="01" title="Profile Snapshot">
        <div className="grid grid-3">
          <StatCard label="Skill Profile Category" value={skillCategoryResult.predicted_category} />
          <MetricCard
            variant="rose"
            eyebrow="Overall Readiness"
            value={`${careerAlignmentResult.best_match_score}%`}
            sub={`Toward ${careerAlignmentResult.best_match}`}
            bar={careerAlignmentResult.best_match_score}
          />
          <MetricCard
            variant="violet"
            eyebrow="Profile"
            value={ALL_FIELDS.length}
            sub="Skills Analysed"
            dots={{ total: ALL_FIELDS.length, filled: ALL_FIELDS.length }}
          />
        </div>
      </ReportSection>

      <ReportSection number="02" title="Role Fit">
        <div className="role-fit-callout">
          <div>
            <span className="metric-eyebrow">Best Matching Path</span>
            <div className="role-fit-role">{careerAlignmentResult.best_match}</div>
          </div>
          <div className="role-fit-score">
            <span className="metric-eyebrow">Match Score</span>
            <div className="role-fit-score-value">{careerAlignmentResult.best_match_score}%</div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: 16 }}
          onClick={() => navigate("/career-alignment")}
        >
          Compare All Career Paths
        </button>
      </ReportSection>

      <ReportSection number="03" title="Your Strengths">
        <div className="tag-list">
          {strengths.map((field) => (
            <span key={field.key} className="tag tag--strength">
              {field.label}
              <span className="tag-note">
                {profile[field.key]}/{field.max}
              </span>
            </span>
          ))}
        </div>
      </ReportSection>

      <ReportSection number="04" title="Skill Gaps">
        {topGaps.length === 0 ? (
          <p>You already meet or exceed every requirement for {careerAlignmentResult.best_match}.</p>
        ) : (
          <div className="tag-list">
            {topGaps.map((gap) => (
              <span key={gap.feature} className="tag tag--gap">
                {FEATURE_LABELS[gap.feature] ?? gap.feature}
                <span className="tag-note">-{gap.gap}</span>
              </span>
            ))}
          </div>
        )}
      </ReportSection>

      <ReportSection number="05" title="What to Build Next">
        {topGaps.length === 0 ? (
          <p>No priority gaps against {careerAlignmentResult.best_match} right now - nice work.</p>
        ) : (
          <div className="action-list">
            {topGaps.map((gap, index) => (
              <div key={gap.feature} className="action-item">
                <span className="action-item-index">0{index + 1}</span>
                <span className="action-item-text">
                  Strengthen <strong>{FEATURE_LABELS[gap.feature] ?? gap.feature}</strong> - you're
                  at {gap.actual}, {careerAlignmentResult.best_match} looks for {gap.required}.
                </span>
              </div>
            ))}
          </div>
        )}
      </ReportSection>

      <ReportSection number="06" title="Profile Breakdown">
        <div className="grid grid-3">
          {FIELD_GROUPS.map((group) => (
            <div key={group.title} className="card">
              <div className="form-section-title">{group.title}</div>
              {group.fields.map((field) => (
                <SkillBar
                  key={field.key}
                  label={field.label}
                  value={profile[field.key]}
                  max={field.max}
                />
              ))}
            </div>
          ))}
        </div>
      </ReportSection>

      <p className="methodology-note">
        Your skill profile category is generated using the trained Random Forest model based
        on patterns learned from the project dataset. It is not a prediction of employability
        or real-world career readiness. Role Fit and Skill Gaps come from the separate,
        rule-based career alignment engine, not from the classifier.
      </p>
    </div>
  );
}
