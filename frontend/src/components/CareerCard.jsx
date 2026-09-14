import useAnimatedPercent from "../hooks/useAnimatedPercent";

export default function CareerCard({ role, description, score, isBestMatch }) {
  const displayScore = useAnimatedPercent(score);

  return (
    <div className={`career-card ${isBestMatch ? "best-match" : ""}`}>
      <div className="career-card-header">
        <div className="career-card-title">
          <h3>{role}</h3>
          {isBestMatch && <span className="best-match-tag">Best Match</span>}
        </div>
        <div className="score-badge">{score}%</div>
      </div>

      {description && <p>{description}</p>}

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${displayScore}%` }} />
      </div>
    </div>
  );
}
