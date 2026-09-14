import { useNavigate } from "react-router-dom";
import Sparkle from "./Sparkle";

export default function EmptyState({ title, description, ctaLabel = "Create Profile", ctaTo = "/profile" }) {
  const navigate = useNavigate();

  return (
    <div className="status-panel">
      <Sparkle className="status-panel-mark" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
      <button type="button" className="btn btn-primary" onClick={() => navigate(ctaTo)}>
        {ctaLabel}
      </button>
    </div>
  );
}
