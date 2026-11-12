import { formatCurrency, formatDate, getPaymentLabel } from "../utils/format";

function TransactionTable({ transactions, categories, onEdit, onDelete, emptyMessage = "No transactions found." }) {
  // Empty state: show a friendly message instead of an empty table
  if (transactions.length === 0) {
    return <div className="card empty-state">{emptyMessage}</div>;
  }

  const getCategory = (id) => categories.find((c) => c.category_id === id);

  return (
    <div className="card table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Payment</th>
            <th className="num">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const category = getCategory(t.category_id);
            const isIncome = t.transaction_type === "income";

            return (
              <tr key={t.transaction_id}>
                <td>{formatDate(t.transaction_date)}</td>
                <td>{t.description || <span className="muted">No description</span>}</td>
                <td>
                  <span className="category-chip">
                    <span className="dot" style={{ background: category?.color }} />
                    {category?.name ?? "Unknown"}
                  </span>
                </td>
                <td>{getPaymentLabel(t.payment_method)}</td>
                <td className={"num " + (isIncome ? "amount-income" : "amount-expense")}>
                  {isIncome ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </td>
                <td className="table-actions">
                  <button className="btn btn-small" onClick={() => onEdit(t)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => onDelete(t)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
