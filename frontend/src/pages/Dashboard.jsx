import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import PeriodFilter from "../components/PeriodFilter";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import CategoryBreakdown from "../components/CategoryBreakdown";
import RecentTransactions from "../components/RecentTransactions";
import ProgressBar from "../components/ProgressBar";
import useTransactions from "../hooks/useTransactions";
import { buildBuckets, getRange, getRangeLabel, isInRange } from "../utils/dateRange";
import {
  buildCategoryBreakdown,
  buildChartData,
  sumExpensesForMonth,
  summarize,
} from "../utils/dashboard";
import { formatCurrency } from "../utils/format";
import { formatMonth, getBudgetStatus, getCurrentMonth } from "../utils/budget";

function Dashboard() {
  const { transactions, categories, budgets } = useTransactions();
  const [period, setPeriod] = useState("month"); // "week" | "month" | "year"

  // ----- Everything below is derived from the data and the selected period -----
  const range = useMemo(() => getRange(period), [period]);

  const periodTransactions = useMemo(
    () => transactions.filter((t) => isInRange(t.transaction_date, range)),
    [transactions, range]
  );

  const periodTotals = useMemo(() => summarize(periodTransactions), [periodTransactions]);
  const allTimeTotals = useMemo(() => summarize(transactions), [transactions]);

  const chartData = useMemo(
    () => buildChartData(periodTransactions, buildBuckets(period, range)),
    [periodTransactions, period, range]
  );

  const breakdown = useMemo(
    () => buildCategoryBreakdown(periodTransactions, categories),
    [periodTransactions, categories]
  );

  // The 5 newest transactions overall (not affected by the period filter)
  const recent = useMemo(
    () =>
      [...transactions]
        .sort(
          (a, b) =>
            b.transaction_date.localeCompare(a.transaction_date) ||
            b.transaction_id - a.transaction_id
        )
        .slice(0, 5),
    [transactions]
  );

  // ----- Remaining budget: always the CURRENT month, whatever period is selected -----
  const currentMonth = useMemo(() => getCurrentMonth(), []);
  const overallBudget = budgets.find(
    (b) => b.category_id === null && b.budget_month.slice(0, 7) === currentMonth
  );
  const monthSpent = sumExpensesForMonth(transactions, currentMonth);
  const budgetLimit = overallBudget ? overallBudget.amount_limit : 0;
  const remaining = budgetLimit - monthSpent;
  const budgetPercent = budgetLimit > 0 ? (monthSpent / budgetLimit) * 100 : 0;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Your financial overview at a glance." />

      <div className="dashboard-bar">
        <PeriodFilter value={period} onChange={setPeriod} />
        <span className="range-label">{getRangeLabel(period, range)}</span>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total balance"
          value={formatCurrency(allTimeTotals.balance)}
          hint="All time: income minus expenses"
          tone={allTimeTotals.balance < 0 ? "expense" : "neutral"}
        />
        <StatCard
          label="Income"
          value={formatCurrency(periodTotals.income)}
          hint="Selected period"
          tone="income"
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(periodTotals.expenses)}
          hint="Selected period"
          tone="expense"
        />
        {overallBudget ? (
          <StatCard
            label="Remaining budget"
            value={formatCurrency(remaining)}
            hint={`${formatMonth(currentMonth)}: ${formatCurrency(monthSpent)} of ${formatCurrency(budgetLimit)} spent`}
            tone={remaining < 0 ? "expense" : "neutral"}
          >
            <ProgressBar percent={budgetPercent} status={getBudgetStatus(budgetPercent)} />
          </StatCard>
        ) : (
          <StatCard
            label="Remaining budget"
            value="Not set"
            hint={`No overall budget for ${formatMonth(currentMonth)}. Set one on the Budgets page.`}
          />
        )}
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <h2 className="card-title">Income vs expenses</h2>
          <IncomeExpenseChart data={chartData} />
        </section>

        <section className="card">
          <h2 className="card-title">Spending by category</h2>
          <CategoryBreakdown data={breakdown} />
        </section>
      </div>

      <RecentTransactions transactions={recent} categories={categories} />
    </>
  );
}

export default Dashboard;
