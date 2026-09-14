const STEPS = [
  { title: "Discover", desc: "Understand your current profile." },
  { title: "Align", desc: "See where your skills fit." },
  { title: "Grow", desc: "Know what to build next." },
];

// A small recurring brand motif, not a giant text section - three short
// steps with a thin connecting line, reused wherever the product's flow
// deserves a one-glance reminder.
export default function DiscoverAlignGrow() {
  return (
    <div className="dag-strip">
      {STEPS.map((step, index) => (
        <div key={step.title} className="dag-step">
          <div className="dag-step-index">0{index + 1}</div>
          <div className="dag-step-title">{step.title}</div>
          <div className="dag-step-desc">{step.desc}</div>
        </div>
      ))}
    </div>
  );
}
