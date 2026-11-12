// A small summary card. "children" lets a card hold extra content, like a progress bar.
function StatCard({ label, value, hint, tone = "neutral", children }) {
  return (
    <div className={"card stat-card tone-" + tone}>
      <span className="stat-label">{label}</span>
      <span className={"stat-value stat-" + tone}>{value}</span>
      {hint && <span className="stat-hint">{hint}</span>}
      {children}
    </div>
  );
}

export default StatCard;
