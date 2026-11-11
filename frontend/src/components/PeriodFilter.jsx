const options = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

// A "controlled" component: the parent owns the value, this only reports clicks
function PeriodFilter({ value, onChange }) {
  return (
    <div className="segmented" role="group" aria-label="Time period">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={"segment" + (value === option.value ? " active" : "")}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default PeriodFilter;
