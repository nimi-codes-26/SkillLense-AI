// Small decorative four-point sparkle, used sparingly as SkillLens AI's
// recurring brand motif (next to the wordmark, in the hero, in empty states).
export default function Sparkle({ className = "", style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0c0.6 5.4 2 8.4 5.4 9.6-3.4 1.2-4.8 4.2-5.4 9.6-0.6-5.4-2-8.4-5.4-9.6C10 8.4 11.4 5.4 12 0z" />
      <path d="M20 13c0.3 2.2 1 3.4 3 4-2 0.6-2.7 1.8-3 4-0.3-2.2-1-3.4-3-4 2-0.6 2.7-1.8 3-4z" opacity="0.8" />
    </svg>
  );
}
