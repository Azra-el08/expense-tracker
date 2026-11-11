// At or above this percentage we show a warning.
export const WARNING_THRESHOLD = 80;

// "ok" below 80%, "warning" from 80% to 99%, "exceeded" at 100% or more
export function getBudgetStatus(percent) {
  if (percent >= 100) return "exceeded";
  if (percent >= WARNING_THRESHOLD) return "warning";
  return "ok";
}

// Current month as "YYYY-MM", which is what <input type="month"> uses
export function getCurrentMonth() {
  return new Date().toLocaleDateString("en-CA").slice(0, 7);
}

// "2026-11" -> "November 2026"
export function formatMonth(monthKey) {
  return new Date(monthKey + "-01T00:00:00").toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
}
