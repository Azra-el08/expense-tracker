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
import { getChartColors } from "../utils/dashboard";
import useTheme from "../hooks/useTheme";

// 12000 -> "12K" so the axis labels stay short
const formatTick = (value) =>
  new Intl.NumberFormat("en-PH", { notation: "compact" }).format(value);

const tooltipStyle = {
  background: "var(--surface)",
  border: "1.5px solid var(--edge)",
  borderRadius: 10,
  color: "var(--ink)",
};

function IncomeExpenseChart({ data }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  const hasData = data.some((d) => d.income > 0 || d.expenses > 0);

  if (!hasData) {
    return <p className="muted chart-empty">Quiet period. Nothing came in or went out.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} />
        <YAxis tickFormatter={formatTick} width={56} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={tooltipStyle}
          labelStyle={{ color: "var(--ink)" }}
          cursor={{ fill: "var(--surface-2)" }}
        />
        <Legend />
        <Bar dataKey="income" name="Income" fill={colors.income} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill={colors.expense} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default IncomeExpenseChart;
