import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../utils/format";
import { chartColors } from "../utils/dashboard";

// 12000 -> "12K" so the axis labels stay short
const formatTick = (value) =>
  new Intl.NumberFormat("en-PH", { notation: "compact" }).format(value);

function IncomeExpenseChart({ data }) {
  const hasData = data.some((d) => d.income > 0 || d.expenses > 0);

  if (!hasData) {
    return <p className="muted chart-empty">No transactions in this period.</p>;
  }

  return (
    // ResponsiveContainer makes the chart fill the width of its card
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} />
        <YAxis tickFormatter={formatTick} width={56} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Bar dataKey="income" name="Income" fill={chartColors.income} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill={chartColors.expense} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default IncomeExpenseChart;
