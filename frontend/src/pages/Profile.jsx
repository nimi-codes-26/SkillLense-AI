import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/useProfile";
import { FIELD_GROUPS, ALL_FIELDS, DEFAULT_PROFILE } from "../constants/fields";

const SECTION_VARIANTS = {
  Academic: "academic",
  Technical: "technical",
  Professional: "professional",
};

function RangeField({ field, value, onChange }) {
  const inputId = `field-${field.key}`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="form-group">
      <div className="form-label-row">
        <label className="form-label" htmlFor={inputId}>
          {field.label}
        </label>
        <span className="form-value" aria-hidden="true">{value}</span>
      </div>
      <input
        id={inputId}
        type="range"
        className="form-range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        aria-describedby={hintId}
        aria-valuetext={`${value} out of ${field.max}`}
        onChange={(event) => onChange(field.key, Number(event.target.value))}
      />
      <div className="form-hint" id={hintId}>
        Range: {field.min}–{field.max}, current value {value}
      </div>
    </div>
  );
}

export default function Profile() {
  const { profile, analyzeProfile, loading, error } = useProfile();
  const [formValues, setFormValues] = useState(profile ?? DEFAULT_PROFILE);
  // Tracks which fields the visitor has actually moved this session, purely
  // to give the "profile completion" indicator honest meaning. A returning
  // visitor editing an already-analyzed profile starts fully complete, since
  // every field already holds a real value.
  const [touched, setTouched] = useState(
    () => new Set(profile ? ALL_FIELDS.map((field) => field.key) : [])
  );
  const navigate = useNavigate();

  function handleChange(key, value) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Simple frontend validation before sending - every field must be a finite
    // number within the range the backend also enforces.
    for (const group of FIELD_GROUPS) {
      for (const field of group.fields) {
        const value = formValues[field.key];
        if (typeof value !== "number" || Number.isNaN(value) || value < field.min || value > field.max) {
          window.alert(`${field.label} must be between ${field.min} and ${field.max}.`);
          return;
        }
      }
    }

    const success = await analyzeProfile(formValues);
    if (success) {
      navigate("/analysis");
    }
  }

  const completion = touched.size;

  return (
    <form onSubmit={handleSubmit}>
      <div className="profile-layout">
        <div className="profile-intro">
          <div className="eyebrow">Build Your Profile</div>
          <h2 style={{ marginTop: 8 }}>Tell SkillLense where you are today.</h2>
          <p>
            Your profile helps us understand your current strengths and identify areas worth
            developing.
          </p>

          <div className="profile-progress">
            <div className="profile-progress-row">
              <span className="metric-eyebrow">Profile Completion</span>
              <span className="profile-progress-fraction">
                {String(completion).padStart(2, "0")} / {String(ALL_FIELDS.length).padStart(2, "0")}
              </span>
            </div>
            <div className="profile-progress-track">
              <div
                className="profile-progress-fill"
                style={{ width: `${(completion / ALL_FIELDS.length) * 100}%` }}
              />
            </div>
          </div>

          {error && (
            <p style={{ color: "var(--accent-terracotta)", marginTop: 20 }}>{error}</p>
          )}

          <div className="profile-intro-actions">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Analyzing..." : "Analyze My Profile"}
            </button>
          </div>
        </div>

        <div className="profile-sections">
          {FIELD_GROUPS.map((group, index) => (
            <div
              key={group.title}
              className={`profile-section-card profile-section-card--${SECTION_VARIANTS[group.title]}`}
            >
              <div className="profile-section-header">
                <span className="profile-section-number">0{index + 1}</span>
                <span className="profile-section-title">{group.title}</span>
              </div>
              {group.fields.map((field) => (
                <RangeField
                  key={field.key}
                  field={field}
                  value={formValues[field.key]}
                  onChange={handleChange}
                />
              ))}
            </div>
          ))}

          {/* On stacked (mobile/tablet) layouts the sticky intro button sits
              above all the sliders, so a second submit button here saves
              scrolling all the way back up. Hidden on desktop via CSS, where
              the two-column layout keeps the first button always in view. */}
          <button
            type="submit"
            className="btn btn-primary btn-block profile-submit-mobile"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze My Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}
