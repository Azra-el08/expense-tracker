import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../utils/format";

function RecentTransactions({ transactions, categories }) {
  const getCategory = (id) => categories.find((c) => c.category_id === id);

  return (
    <section className="card">
      <div className="section-header">
        <h2>Recent transactions</h2>
        <Link to="/transactions" className="link">
          View all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="muted">No transactions yet.</p>
      ) : (
        <ul className="category-list">
          {transactions.map((t) => {
            const category = getCategory(t.category_id);
            const isIncome = t.transaction_type === "income";

            return (
              <li key={t.transaction_id} className="category-row">
                <span className="dot dot-lg" style={{ background: category?.color }} />
                <div className="category-info">
                  <span className="category-name">{t.description || category?.name}</span>
                  <span className="muted small">
                    {category?.name} | {formatDate(t.transaction_date)}
                  </span>
                </div>
                <span className={isIncome ? "amount-income" : "amount-expense"}>
                  {isIncome ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default RecentTransactions;
