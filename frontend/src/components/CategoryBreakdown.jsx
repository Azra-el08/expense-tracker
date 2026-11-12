import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../utils/format";

function CategoryBreakdown({ data }) {
  if (data.length === 0) {
    return <p className="muted chart-empty">No spending in this period. Nice and quiet.</p>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {/* One Cell per slice so each slice gets its category color */}
            {data.map((item) => (
              <Cell key={item.name} fill={item.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{
              background: "var(--surface)",
              border: "1.5px solid var(--edge)",
              borderRadius: 10,
              color: "var(--ink)",
            }}
            itemStyle={{ color: "var(--ink)" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Our own legend, so amounts and percentages stay readable */}
      <ul className="breakdown-list">
        {data.map((item) => (
          <li key={item.name}>
            <span className="category-chip">
              <span className="dot" style={{ background: item.color }} />
              {item.name}
            </span>
            <span>
              {formatCurrency(item.value)} <span className="muted">({item.percent}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryBreakdown;
