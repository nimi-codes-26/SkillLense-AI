import { useEffect, useState } from "react";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Returns a percentage that starts at 0 and animates to `target` once, right
// after mount (relies on the CSS transition already on the bar-fill
// elements) - so bars fill in rather than appearing already full. Skips the
// animation entirely when the visitor prefers reduced motion.
export default function useAnimatedPercent(target) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (typeof target !== "number") return;
    if (prefersReducedMotion()) {
      setDisplay(target);
      return;
    }
    const frame = requestAnimationFrame(() => setDisplay(target));
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}
