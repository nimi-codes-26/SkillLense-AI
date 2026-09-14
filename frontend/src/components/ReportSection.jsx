import Reveal from "./Reveal";

// A numbered report section (01, 02, 03...) - the structural building block
// of the Skill Intelligence Report on the Analysis page. Reveals once as the
// reader scrolls to it.
export default function ReportSection({ number, title, children }) {
  return (
    <Reveal as="section" className="report-section">
      <div className="report-section-header">
        <span className="report-section-number">{number}</span>
        <h3>{title}</h3>
      </div>
      <div className="report-section-body">{children}</div>
    </Reveal>
  );
}
