import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import useTransactions from "../hooks/useTransactions";

function Transactions() {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  // Filter state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal state: editingTransaction is null when adding, or the transaction when editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Recalculate the visible list only when its inputs change
  const visibleTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return transactions
      .filter((t) => typeFilter === "all" || t.transaction_type === typeFilter)
      .filter((t) => categoryFilter === "all" || t.category_id === Number(categoryFilter))
      .filter((t) => t.description.toLowerCase().includes(term))
      .sort((a, b) => b.transaction_date.localeCompare(a.transaction_date)); // newest first
  }, [transactions, search, typeFilter, categoryFilter]);

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

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Record and review your income and expenses."
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="input"
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

      <p className="result-count">
        Showing {visibleTransactions.length} of {transactions.length} transactions
      </p>

      <TransactionTable
        transactions={visibleTransactions}
        categories={categories}
        onEdit={openEditModal}
        onDelete={handleDelete}
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
    </>
  );
}

export default Transactions;
