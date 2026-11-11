// Reusable bar. The Dashboard will use it too.
function ProgressBar({ percent, status = "ok" }) {
  const width = Math.min(percent, 100); // never draw past 100%

  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={"progress-fill status-" + status} style={{ width: width + "%" }} />
    </div>
  );
}

export default ProgressBar;
