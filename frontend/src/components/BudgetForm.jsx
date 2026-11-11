import { useState } from "react";

function BudgetForm({
  initialValues,
  isEditing,
  targetLabel,
  availableCategories,
  canAddOverall,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialValues); // { target, amount }
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.target) newErrors.target = "Choose what this budget is for.";
    if (!form.amount || Number(form.amount) <= 0) {
      newErrors.amount = "Enter a limit greater than 0.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      category_id: form.target === "overall" ? null : Number(form.target),
      amount_limit: Number(form.amount),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="target">Budget for</label>

        {isEditing ? (
          // The target of an existing budget cannot change, only its limit
          <p className="static-field">{targetLabel}</p>
        ) : (
          <>
            <select
              id="target"
              name="target"
              className="input"
              value={form.target}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              {canAddOverall && <option value="overall">Overall monthly budget</option>}
              {availableCategories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.target && <p className="error-text">{errors.target}</p>}
          </>
        )}
      </div>

      <div className="field">
        <label htmlFor="amount">Monthly limit</label>
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

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Save changes" : "Set budget"}
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;
