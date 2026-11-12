// Temporary frontend calculations. From Stage 10 the PHP API will return these numbers.

const chartPalettes = {
  light: { income: "#23784a", expense: "#cf4527" },
  dark: { income: "#58c486", expense: "#ff7f5c" },
};

export function getChartColors(theme) {
  return chartPalettes[theme] ?? chartPalettes.light;
}

// Avoids tiny floating-point errors such as 0.1 + 0.2 = 0.30000000000000004
const round2 = (n) => Math.round(n * 100) / 100;

// Total Income, Total Expenses, Net Balance (income minus expenses)
export function summarize(transactions) {
  let income = 0;
  let expenses = 0;

  transactions.forEach((t) => {
    if (t.transaction_type === "income") income += t.amount;
    else expenses += t.amount;
  });

  return {
    income: round2(income),
    expenses: round2(expenses),
    balance: round2(income - expenses),
  };
}

// One { label, income, expenses } object per chart bar
export function buildChartData(transactions, buckets) {
  return buckets.map((bucket) => {
    const inBucket = transactions.filter(
      (t) => t.transaction_date >= bucket.start && t.transaction_date <= bucket.end
    );
    const { income, expenses } = summarize(inBucket);
    return { label: bucket.label, income, expenses };
  });
}

// Expense totals per category, biggest first, for the donut chart
export function buildCategoryBreakdown(transactions, categories) {
  const totals = {};

  transactions.forEach((t) => {
    if (t.transaction_type !== "expense") return;
    totals[t.category_id] = (totals[t.category_id] ?? 0) + t.amount;
  });

  const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);

  return categories
    .filter((c) => totals[c.category_id])
    .map((c) => ({
      name: c.name,
      color: c.color,
      value: round2(totals[c.category_id]),
      percent: grandTotal > 0 ? Math.round((totals[c.category_id] / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

// Expenses in one month ("YYYY-MM"), used for the remaining budget
export function sumExpensesForMonth(transactions, monthKey) {
  const total = transactions
    .filter((t) => t.transaction_type === "expense" && t.transaction_date.slice(0, 7) === monthKey)
    .reduce((sum, t) => sum + t.amount, 0);
  return round2(total);
}
