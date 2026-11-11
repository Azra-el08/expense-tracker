// One card listing categories of a single type. Used twice: expense and income.
function CategorySection({ title, categories, usageCounts, onAdd, onEdit, onDelete }) {
  return (
    <section className="card">
      <div className="section-header">
        <h2>{title}</h2>
        <button className="btn btn-small" onClick={onAdd}>
          + Add
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="muted">No categories yet.</p>
      ) : (
        <ul className="category-list">
          {categories.map((c) => {
            const count = usageCounts[c.category_id] ?? 0;

            return (
              <li key={c.category_id} className="category-row">
                <span className="dot dot-lg" style={{ background: c.color }} />
                <div className="category-info">
                  <span className="category-name">{c.name}</span>
                  <span className="muted small">
                    {count} transaction{count === 1 ? "" : "s"}
                  </span>
                </div>
                <button className="btn btn-small" onClick={() => onEdit(c)}>
                  Edit
                </button>
                <button
                  className="btn btn-small btn-danger"
                  disabled={count > 0}
                  title={
                    count > 0
                      ? "Used by transactions, so it cannot be deleted"
                      : "Delete category"
                  }
                  onClick={() => onDelete(c)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default CategorySection;
