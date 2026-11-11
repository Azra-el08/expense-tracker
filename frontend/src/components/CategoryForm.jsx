import { useState } from "react";

function CategoryForm({ initialValues, isEditing, existingCategories, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = form.name.trim();

    if (!name) {
      setError("Enter a category name.");
      return;
    }

    // Same type + same name (ignoring upper/lower case) is a duplicate.
    // When editing, the category is allowed to match itself.
    const isDuplicate = existingCategories.some(
      (c) =>
        c.type === form.type &&
        c.name.toLowerCase() === name.toLowerCase() &&
        c.category_id !== initialValues.category_id
    );
    if (isDuplicate) {
      setError(`You already have a ${form.type} category with that name.`);
      return;
    }

    onSubmit({ name, type: form.type, color: form.color });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {isEditing ? (
        <p className="muted small">
          Type: <strong>{form.type}</strong> (cannot be changed, because existing
          transactions depend on it)
        </p>
      ) : (
        <div className="type-toggle">
          <button
            type="button"
            className={"type-btn" + (form.type === "expense" ? " active-expense" : "")}
            onClick={() => setForm((prev) => ({ ...prev, type: "expense" }))}
          >
            Expense
          </button>
          <button
            type="button"
            className={"type-btn" + (form.type === "income" ? " active-income" : "")}
            onClick={() => setForm((prev) => ({ ...prev, type: "income" }))}
          >
            Income
          </button>
        </div>
      )}

      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={50}
          className="input"
          value={form.name}
          onChange={handleChange}
        />
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="field">
        <label htmlFor="color">Color</label>
        <input
          id="color"
          name="color"
          type="color"
          className="color-input"
          value={form.color}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Save changes" : "Add category"}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;
