import { useEffect, useState } from "react";
import TransactionContext from "./TransactionContext";
import { dummyCategories } from "../data/dummyData";
import { KEYS, readJSON, writeJSON } from "../utils/storage";

// A new account starts with the default categories and nothing else.
function loadInitialData(userId) {
  const saved = readJSON(KEYS.data(userId), null);
  return {
    transactions: saved?.transactions ?? [],
    categories: saved?.categories ?? dummyCategories,
    budgets: saved?.budgets ?? [],
  };
}

// Holds ONE account's data. ProtectedRoute gives it key={userId}, so switching
// accounts remounts this provider and loads the other account's data.
// When we connect the API, each part will move into its own service.
function TransactionProvider({ userId, children }) {
  const [initial] = useState(() => loadInitialData(userId));
  const [transactions, setTransactions] = useState(initial.transactions);
  const [categories, setCategories] = useState(initial.categories);
  const [budgets, setBudgets] = useState(initial.budgets);

  // Save this account's data whenever anything changes
  useEffect(() => {
    writeJSON(KEYS.data(userId), { transactions, categories, budgets });
  }, [userId, transactions, categories, budgets]);

  // ----- Transactions -----
  const addTransaction = (data) => {
    const newTransaction = { ...data, transaction_id: Date.now() };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id, data) => {
    setTransactions((prev) =>
      prev.map((t) => (t.transaction_id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.transaction_id !== id));
  };

  const deleteAllTransactions = () => setTransactions([]);

  // ----- Categories -----
  const addCategory = (data) => {
    setCategories((prev) => [...prev, { ...data, category_id: Date.now() }]);
  };

  const updateCategory = (id, data) => {
    setCategories((prev) =>
      prev.map((c) => (c.category_id === id ? { ...c, ...data } : c))
    );
  };

  // The rule lives here too, not only in the button. Never trust the UI alone.
  const deleteCategory = (id) => {
    const isInUse = transactions.some((t) => t.category_id === id);
    if (isInUse) return false;

    setCategories((prev) => prev.filter((c) => c.category_id !== id));
    setBudgets((prev) => prev.filter((b) => b.category_id !== id)); // its budgets go too
    return true;
  };

  // ----- Budgets -----
  const addBudget = (data) => {
    setBudgets((prev) => [...prev, { ...data, budget_id: Date.now() }]);
  };

  const updateBudget = (id, data) => {
    setBudgets((prev) =>
      prev.map((b) => (b.budget_id === id ? { ...b, ...data } : b))
    );
  };

  const deleteBudget = (id) => {
    setBudgets((prev) => prev.filter((b) => b.budget_id !== id));
  };

  const value = {
    transactions,
    categories,
    budgets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export default TransactionProvider;
