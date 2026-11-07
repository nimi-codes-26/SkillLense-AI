export function LoadingMessage({ text = "Loading..." }) {
  return (
    <div className="status-panel">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

export function ErrorMessage({ text, onRetry }) {
  return (
    <div className="status-panel error">
      <h3>Something went wrong</h3>
      <p>{text}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
