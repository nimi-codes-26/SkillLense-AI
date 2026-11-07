// A fixed, whole-app ambient atmosphere: four soft, blurred light fields in
// the existing palette, drifting extremely slowly via transform only (cheap,
// compositor-friendly - no width/height/top/left animation). Sits behind
// every page, at pointer-events: none, so it never interferes with content.
// The #FDFCE8 ivory base itself is set on <body> and is untouched by this.
export default function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-glow ambient-glow--lavender" />
      <div className="ambient-glow ambient-glow--yellow" />
      <div className="ambient-glow ambient-glow--mint" />
      <div className="ambient-glow ambient-glow--pink" />
      <div className="ambient-grain" />
    </div>
  );
}
