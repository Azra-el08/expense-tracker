import { useState } from "react";
import { paymentMethods } from "../utils/format";

function getEmptyForm() {
  return {
    transaction_type: "expense",
    category_id: "",
    amount: "",
    description: "",
    payment_method: "cash",
    transaction_date: new Date().toLocaleDateString("en-CA"), // today as YYYY-MM-DD
  };
}

function TransactionForm({ initialValues, categories, onSubmit, onCancel }) {
  // Editing: start with the existing values. Adding: start empty.
  const [form, setForm] = useState(
    initialValues
      ? { ...initialValues, amount: String(initialValues.amount) }
      : getEmptyForm()
  );
  const [errors, setErrors] = useState({});

  // One handler for all normal inputs: the input's "name" tells us which field to update
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Switching income/expense also clears the category (categories differ by type)
  const handleTypeChange = (type) => {
    setForm((prev) => ({ ...prev, transaction_type: type, category_id: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.category_id) newErrors.category_id = "Choose a category.";
    if (!form.amount || Number(form.amount) <= 0) {
      newErrors.amount = "Enter an amount greater than 0.";
    }
    if (!form.transaction_date) newErrors.transaction_date = "Pick a date.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      transaction_type: form.transaction_type,
      category_id: Number(form.category_id),
      amount: Number(form.amount),
      description: form.description.trim(),
      payment_method: form.payment_method,
      transaction_date: form.transaction_date,
    });
  };

  // Only show categories that match the selected type
  const availableCategories = categories.filter(
    (c) => c.type === form.transaction_type
  );

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="type-toggle">
        <button
          type="button"
          className={
            "type-btn" + (form.transaction_type === "expense" ? " active-expense" : "")
          }
          onClick={() => handleTypeChange("expense")}
        >
          Expense
        </button>
        <button
          type="button"
          className={
            "type-btn" + (form.transaction_type === "income" ? " active-income" : "")
          }
          onClick={() => handleTypeChange("income")}
        >
          Income
        </button>
      </div>

      <div className="field">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className="input"
          value={form.amount}
          onChange={handleChange}
        />
        {errors.amount && <p className="error-text">{errors.amount}</p>}
      </div>

      <div className="field">
        <label htmlFor="category_id">Category</label>
        <select
          id="category_id"
          name="category_id"
          className="input"
          value={form.category_id}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          {availableCategories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category_id && <p className="error-text">{errors.category_id}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description (optional)</label>
        <input
          id="description"
          name="description"
          type="text"
          maxLength={255}
          className="input"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="payment_method">Payment method</label>
          <select
            id="payment_method"
            name="payment_method"
            className="input"
            value={form.payment_method}
            onChange={handleChange}
          >
            {paymentMethods.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="transaction_date">Date</label>
          <input
            id="transaction_date"
            name="transaction_date"
            type="date"
            className="input"
            value={form.transaction_date}
            onChange={handleChange}
          />
          {errors.transaction_date && (
            <p className="error-text">{errors.transaction_date}</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialValues ? "Save changes" : "Add transaction"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
