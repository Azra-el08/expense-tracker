// Field names match the MySQL columns we designed, so connecting the API later is easy.

export const dummyCategories = [
  { category_id: 1, name: "Food & Dining", type: "expense", color: "#f97316" },
  { category_id: 2, name: "Transportation", type: "expense", color: "#3b82f6" },
  { category_id: 3, name: "Shopping", type: "expense", color: "#ec4899" },
  { category_id: 4, name: "Bills & Utilities", type: "expense", color: "#eab308" },
  { category_id: 5, name: "Education", type: "expense", color: "#8b5cf6" },
  { category_id: 6, name: "Entertainment", type: "expense", color: "#14b8a6" },
  { category_id: 7, name: "Healthcare", type: "expense", color: "#ef4444" },
  { category_id: 8, name: "Personal Care", type: "expense", color: "#f472b6" },
  { category_id: 9, name: "Others", type: "expense", color: "#64748b" },
  { category_id: 10, name: "Salary", type: "income", color: "#16a34a" },
  { category_id: 11, name: "Allowance", type: "income", color: "#22c55e" },
  { category_id: 12, name: "Freelance", type: "income", color: "#10b981" },
  { category_id: 13, name: "Business", type: "income", color: "#059669" },
  { category_id: 14, name: "Investments", type: "income", color: "#0d9488" },
  { category_id: 15, name: "Other Income", type: "income", color: "#4ade80" },
];

export const dummyTransactions = [
  { transaction_id: 1, transaction_type: "income", category_id: 11, amount: 5000, description: "Monthly allowance", payment_method: "e_wallet", transaction_date: "2026-11-01" },
  { transaction_id: 2, transaction_type: "expense", category_id: 1, amount: 185.5, description: "Lunch at canteen", payment_method: "cash", transaction_date: "2026-11-03" },
  { transaction_id: 3, transaction_type: "expense", category_id: 2, amount: 120, description: "Jeepney and MRT fare", payment_method: "cash", transaction_date: "2026-11-04" },
  { transaction_id: 4, transaction_type: "expense", category_id: 4, amount: 899, description: "Internet bill", payment_method: "e_wallet", transaction_date: "2026-11-05" },
  { transaction_id: 5, transaction_type: "income", category_id: 12, amount: 3500, description: "Landing page project", payment_method: "bank_transfer", transaction_date: "2026-11-06" },
  { transaction_id: 6, transaction_type: "expense", category_id: 3, amount: 1299, description: "New sneakers", payment_method: "card", transaction_date: "2026-11-07" },
  { transaction_id: 7, transaction_type: "expense", category_id: 6, amount: 350, description: "Movie night", payment_method: "cash", transaction_date: "2026-11-08" },
  { transaction_id: 8, transaction_type: "expense", category_id: 5, amount: 450, description: "Printing and notebooks", payment_method: "cash", transaction_date: "2026-11-09" },
  { transaction_id: 9, transaction_type: "expense", category_id: 7, amount: 275, description: "Pharmacy", payment_method: "cash", transaction_date: "2026-10-28" },
  { transaction_id: 10, transaction_type: "income", category_id: 11, amount: 5000, description: "Monthly allowance", payment_method: "e_wallet", transaction_date: "2026-10-01" },
];

// category_id: null means the overall monthly budget.
// budget_month is always the first day of the month.
export const dummyBudgets = [
  { budget_id: 1, category_id: null, budget_month: "2026-11-01", amount_limit: 5000 },
  { budget_id: 2, category_id: 1, budget_month: "2026-11-01", amount_limit: 1000 },
  { budget_id: 3, category_id: 2, budget_month: "2026-11-01", amount_limit: 500 },
  { budget_id: 4, category_id: 3, budget_month: "2026-11-01", amount_limit: 1000 },
  { budget_id: 5, category_id: 4, budget_month: "2026-11-01", amount_limit: 1000 },
  { budget_id: 6, category_id: 6, budget_month: "2026-11-01", amount_limit: 400 },
];
