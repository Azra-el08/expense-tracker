import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import BudgetCard from "../components/BudgetCard";
import BudgetForm from "../components/BudgetForm";
import useTransactions from "../hooks/useTransactions";
import { formatMonth, getCurrentMonth } from "../utils/budget";

function Budgets() {
  const { transactions, categories, budgets, addBudget, updateBudget, deleteBudget } =
    useTransactions();

  const [month, setMonth] = useState(getCurrentMonth); // "YYYY-MM"
  const [modal, setModal] = useState(null); // null (closed) or { budget } (budget is null when adding)

  // ----- Budgets for the selected month -----
  const monthBudgets = budgets.filter((b) => b.budget_month.slice(0, 7) === month);
  const overallBudget = monthBudgets.find((b) => b.category_id === null);
  const categoryBudgets = monthBudgets.filter((b) => b.category_id !== null);

  // ----- Spending for the selected month (expenses only) -----
  const { totalSpent, spentByCategory } = useMemo(() => {
    const byCategory = {};
    let total = 0;

    transactions.forEach((t) => {
      if (t.transaction_type !== "expense") return;
      if (t.transaction_date.slice(0, 7) !== month) return;

      total += t.amount;
      byCategory[t.category_id] = (byCategory[t.category_id] ?? 0) + t.amount;
    });

    return { totalSpent: total, spentByCategory: byCategory };
  }, [transactions, month]);

  // ----- What can still be added this month -----
  const budgetedIds = new Set(categoryBudgets.map((b) => b.category_id));
  const availableCategories = categories.filter(
    (c) => c.type === "expense" && !budgetedIds.has(c.category_id)
  );
  const canAddOverall = !overallBudget;
  const canAddAny = canAddOverall || availableCategories.length > 0;

  const getCategory = (id) => categories.find((c) => c.category_id === id);

  // ----- Modal handlers -----
  const openAdd = () => setModal({ budget: null });
  const openEdit = (budget) => setModal({ budget });
  const closeModal = () => setModal(null);

  const handleSubmit = (data) => {
    if (modal.budget) {
      updateBudget(modal.budget.budget_id, { amount_limit: data.amount_limit });
    } else {
      addBudget({ ...data, budget_month: `${month}-01` });
    }
    closeModal();
  };

  const handleDelete = (budget, label) => {
    if (window.confirm(`Delete the budget for ${label}?`)) {
      deleteBudget(budget.budget_id);
    }
  };

  // ----- Values for the form -----
  const editing = modal ? modal.budget : null;
  const initialValues = editing
    ? {
        target: editing.category_id === null ? "overall" : String(editing.category_id),
        amount: String(editing.amount_limit),
      }
    : { target: canAddOverall ? "overall" : "", amount: "" };
  const targetLabel = editing
    ? editing.category_id === null
      ? "Overall monthly budget"
      : getCategory(editing.category_id)?.name
    : "";

  return (
    <>
      <PageHeader
        title="Budgets"
        subtitle="Set limits and track your spending."
      />

      <div className="toolbar">
        <input
          className="input"
          type="month"
          value={month}
          onChange={(e) => {
            if (e.target.value) setMonth(e.target.value); // ignore a cleared field
          }}
        />
        <button className="btn btn-primary" onClick={openAdd} disabled={!canAddAny}>
          + Set budget
        </button>
      </div>

      <h2 className="section-title">Overall budget for {formatMonth(month)}</h2>
      {overallBudget ? (
        <div className="budget-overall">
          <BudgetCard
            title="Monthly budget"
            limit={overallBudget.amount_limit}
            spent={totalSpent}
            onEdit={() => openEdit(overallBudget)}
            onDelete={() => handleDelete(overallBudget, "the overall month")}
          />
        </div>
      ) : (
        <div className="card empty-state budget-overall">
          No overall budget set for this month.
        </div>
      )}

      <h2 className="section-title">Category budgets</h2>
      {categoryBudgets.length === 0 ? (
        <div className="card empty-state">No category budgets for this month.</div>
      ) : (
        <div className="budget-grid">
          {categoryBudgets.map((b) => {
            const category = getCategory(b.category_id);
            return (
              <BudgetCard
                key={b.budget_id}
                title={category?.name ?? "Unknown"}
                color={category?.color}
                limit={b.amount_limit}
                spent={spentByCategory[b.category_id] ?? 0}
                onEdit={() => openEdit(b)}
                onDelete={() => handleDelete(b, category?.name ?? "this category")}
              />
            );
          })}
        </div>
      )}

      {modal && (
        <Modal
          title={editing ? "Edit budget" : `Set budget for ${formatMonth(month)}`}
          onClose={closeModal}
        >
          <BudgetForm
            initialValues={initialValues}
            isEditing={Boolean(editing)}
            targetLabel={targetLabel}
            availableCategories={availableCategories}
            canAddOverall={canAddOverall}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </>
  );
}

export default Budgets;
