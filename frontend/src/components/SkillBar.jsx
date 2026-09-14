import useAnimatedPercent from "../hooks/useAnimatedPercent";

export default function SkillBar({ label, value, max }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  const displayPercent = useAnimatedPercent(percent);

  return (
    <div className="skill-bar-row">
      <div className="skill-bar-label">{label}</div>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ width: `${displayPercent}%` }} />
      </div>
      <div className="skill-bar-value">
        {value}/{max}
      </div>
    </div>
  );
}
