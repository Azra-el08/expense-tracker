import ProgressBar from "./ProgressBar";
import { formatCurrency } from "../utils/format";
import { getBudgetStatus } from "../utils/budget";

function BudgetCard({ title, color, limit, spent, onEdit, onDelete }) {
  // Derived values: calculated from props, never stored in state
  const percent = limit > 0 ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;
  const status = getBudgetStatus(percent);

  return (
    <div className="card budget-card">
      <div className="budget-top">
        <span className="category-chip">
          {color && <span className="dot" style={{ background: color }} />}
          <strong>{title}</strong>
        </span>
        <div className="table-actions">
          <button className="btn btn-small" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btn-small btn-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="budget-amounts">
        <span>
          {formatCurrency(spent)}{" "}
          <span className="muted">of {formatCurrency(limit)}</span>
        </span>
        <span className={"status-text-" + status}>{Math.round(percent)}%</span>
      </div>

      <ProgressBar percent={percent} status={status} />

      <p className={"budget-note status-text-" + status}>
        {status === "exceeded" && `Over by ${formatCurrency(Math.abs(remaining))}. Ouch.`}
        {status === "warning" && `Close to the limit: ${formatCurrency(remaining)} left`}
        {status === "ok" && `${formatCurrency(remaining)} left to spend`}
      </p>
    </div>
  );
}

export default BudgetCard;
