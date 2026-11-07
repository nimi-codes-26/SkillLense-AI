export default function StatCard({ label, value }) {
  const isLong = typeof value === "string" && value.length > 12;

  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className={`stat-card-value ${isLong ? "stat-card-value--compact" : ""}`}>{value}</div>
    </div>
  );
}
