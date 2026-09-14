import useAnimatedPercent from "../hooks/useAnimatedPercent";

// A small, colourful stat card used across Home (illustrative) and the
// results pages (real data). Give it either `bar` (0-100, renders a mini
// progress bar) or `dots` ({ total, filled }, renders a micro dot row) -
// this is what gives the 4 palette colours distinct internal layouts
// instead of making every card identical.
export default function MetricCard({ variant, eyebrow, value, sub, bar, dots, compactValue }) {
  const displayBar = useAnimatedPercent(bar);

  return (
    <div className={`metric-card metric-card--${variant}`}>
      <div className="metric-eyebrow">{eyebrow}</div>
      <div className={`metric-value ${compactValue ? "metric-value--compact" : ""}`}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}

      {typeof bar === "number" && (
        <div className="metric-bar-track">
          <div className="metric-bar-fill" style={{ width: `${displayBar}%` }} />
        </div>
      )}

      {dots && (
        <div className="metric-dots">
          {Array.from({ length: dots.total }).map((_, i) => (
            <span key={i} className={`metric-dot ${i < dots.filled ? "filled" : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}
