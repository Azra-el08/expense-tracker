import { getRange, getRangeLabel, shiftAnchor, toISODate } from "../utils/dateRange";

const periods = [
  { value: "all", label: "All time" },
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

// period: "all" | "day" | "week" | "month". anchor: any date inside the period ("YYYY-MM-DD").
function DateFilter({ period, anchor, onPeriodChange, onAnchorChange }) {
  const range = period === "all" ? null : getRange(period, new Date(anchor + "T00:00:00"));

  return (
    <div className="date-filter">
      <div className="segmented" role="group" aria-label="Date filter">
        {periods.map((p) => (
          <button
            key={p.value}
            type="button"
            className={"segment" + (period === p.value ? " active" : "")}
            aria-pressed={period === p.value}
            onClick={() => onPeriodChange(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {range && (
        <>
          <div className="date-nav">
            <button
              type="button"
              className="btn btn-small"
              aria-label="Previous period"
              onClick={() => onAnchorChange(shiftAnchor(anchor, period, -1))}
            >
              &lsaquo;
            </button>

            {period === "month" ? (
              <input
                className="input"
                type="month"
                aria-label="Pick a month"
                value={anchor.slice(0, 7)}
                onChange={(e) => e.target.value && onAnchorChange(e.target.value + "-01")}
              />
            ) : (
              <input
                className="input"
                type="date"
                aria-label={period === "week" ? "Pick any day in the week" : "Pick a day"}
                value={anchor}
                onChange={(e) => e.target.value && onAnchorChange(e.target.value)}
              />
            )}

            <button
              type="button"
              className="btn btn-small"
              aria-label="Next period"
              onClick={() => onAnchorChange(shiftAnchor(anchor, period, 1))}
            >
              &rsaquo;
            </button>

            <button
              type="button"
              className="btn btn-small"
              onClick={() => onAnchorChange(toISODate(new Date()))}
            >
              Today
            </button>
          </div>

          <span className="range-label">{getRangeLabel(period, range)}</span>
        </>
      )}
    </div>
  );
}

export default DateFilter;
