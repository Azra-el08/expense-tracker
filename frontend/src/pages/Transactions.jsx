import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import DateFilter from "../components/DateFilter";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import useTransactions from "../hooks/useTransactions";
import { getRange, isInRange, toISODate } from "../utils/dateRange";
import { summarize } from "../utils/dashboard";
import { formatCurrency } from "../utils/format";

function Transactions() {
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
  } = useTransactions();

  // Filter state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [datePeriod, setDatePeriod] = useState("all"); // "all" | "day" | "week" | "month"
  const [anchor, setAnchor] = useState(() => toISODate(new Date())); // a date inside the chosen period

  // Modal state: editingTransaction is null when adding, or the transaction when editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  // Recalculate the visible list only when its inputs change
  const visibleTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();
    const range =
      datePeriod === "all" ? null : getRange(datePeriod, new Date(anchor + "T00:00:00"));

    return transactions
      .filter((t) => !range || isInRange(t.transaction_date, range))
      .filter((t) => typeFilter === "all" || t.transaction_type === typeFilter)
      .filter((t) => categoryFilter === "all" || t.category_id === Number(categoryFilter))
      .filter((t) => t.description.toLowerCase().includes(term))
      .sort((a, b) => b.transaction_date.localeCompare(a.transaction_date)); // newest first
  }, [transactions, search, typeFilter, categoryFilter, datePeriod, anchor]);

  const shownTotals = useMemo(() => summarize(visibleTransactions), [visibleTransactions]);

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (data) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.transaction_id, data);
    } else {
      addTransaction(data);
    }
    closeModal();
  };

  const handleDelete = (transaction) => {
    const label = transaction.description || "this transaction";
    if (window.confirm(`Delete "${label}"?`)) {
      deleteTransaction(transaction.transaction_id);
    }
  };

  const handleDeleteAll = () => {
    deleteAllTransactions();
    setShowDeleteAll(false);
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Every peso in, every peso out."
      />

      <div className="toolbar">
        <input
          className="input toolbar-grow"
          type="search"
          placeholder="Search description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input"
          aria-label="Filter by type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="input"
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All categories</option>
          <optgroup label="Expense">
            {categories
              .filter((c) => c.type === "expense")
              .map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Income">
            {categories
              .filter((c) => c.type === "income")
              .map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
          </optgroup>
        </select>

        <button className="btn btn-primary" onClick={openAddModal}>
          + Add transaction
        </button>
      </div>

      <div className="toolbar toolbar-between">
        <DateFilter
          period={datePeriod}
          anchor={anchor}
          onPeriodChange={setDatePeriod}
          onAnchorChange={setAnchor}
        />

        <button
          className="btn btn-danger"
          disabled={transactions.length === 0}
          onClick={() => setShowDeleteAll(true)}
        >
          Delete all
        </button>
      </div>

      <p className="result-count">
        Showing {visibleTransactions.length} of {transactions.length} transactions
        <span className="result-totals">
          In <strong className="amount-income">{formatCurrency(shownTotals.income)}</strong>
          {" | "}
          Out <strong className="amount-expense">{formatCurrency(shownTotals.expenses)}</strong>
        </span>
      </p>

      <TransactionTable
        transactions={visibleTransactions}
        categories={categories}
        onEdit={openEditModal}
        onDelete={handleDelete}
        emptyMessage={
          transactions.length === 0
            ? "No transactions yet. Add your first one and the chest starts filling."
            : "Nothing matches those filters."
        }
      />

      {isModalOpen && (
        <Modal
          title={editingTransaction ? "Edit transaction" : "Add transaction"}
          onClose={closeModal}
        >
          <TransactionForm
            initialValues={editingTransaction}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {showDeleteAll && (
        <ConfirmDialog
          title="Delete all transactions?"
          message={`This permanently deletes all ${transactions.length} transactions in your account, not only the ones currently shown. Your categories and budgets stay.`}
          confirmLabel="Delete everything"
          onConfirm={handleDeleteAll}
          onCancel={() => setShowDeleteAll(false)}
        />
      )}
    </>
  );
}

export default Transactions;
