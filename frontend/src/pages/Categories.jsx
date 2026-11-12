import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import CategoryForm from "../components/CategoryForm";
import CategorySection from "../components/CategorySection";
import useTransactions from "../hooks/useTransactions";

const DEFAULT_COLOR = "#d9a21b";

function Categories() {
  const { categories, transactions, addCategory, updateCategory, deleteCategory } =
    useTransactions();

  // modal is null (closed) or { isEditing, values }
  const [modal, setModal] = useState(null);

  // How many transactions use each category: { categoryId: count }
  const usageCounts = useMemo(() => {
    const counts = {};
    transactions.forEach((t) => {
      counts[t.category_id] = (counts[t.category_id] ?? 0) + 1;
    });
    return counts;
  }, [transactions]);

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const openAdd = (type) =>
    setModal({ isEditing: false, values: { name: "", type, color: DEFAULT_COLOR } });

  const openEdit = (category) => setModal({ isEditing: true, values: category });

  const closeModal = () => setModal(null);

  const handleSubmit = (data) => {
    if (modal.isEditing) {
      updateCategory(modal.values.category_id, data);
    } else {
      addCategory(data);
    }
    closeModal();
  };

  const handleDelete = (category) => {
    if (window.confirm(`Delete the category "${category.name}"?`)) {
      deleteCategory(category.category_id);
    }
  };

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Organize your income and expenses."
      />

      <div className="two-col">
        <CategorySection
          title="Expense categories"
          categories={expenseCategories}
          usageCounts={usageCounts}
          onAdd={() => openAdd("expense")}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
        <CategorySection
          title="Income categories"
          categories={incomeCategories}
          usageCounts={usageCounts}
          onAdd={() => openAdd("income")}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <Modal
          title={modal.isEditing ? "Edit category" : "Add category"}
          onClose={closeModal}
        >
          <CategoryForm
            initialValues={modal.values}
            isEditing={modal.isEditing}
            existingCategories={categories}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </>
  );
}

export default Categories;
