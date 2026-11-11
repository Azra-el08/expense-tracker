// All dates are plain "YYYY-MM-DD" strings, so they can be compared with <= and >=.
// We build them from local date parts (not toISOString) to avoid timezone shifts.

const pad = (n) => String(n).padStart(2, "0");

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// period: "week" (Monday to Sunday), "month", or "year". The range is inclusive.
export function getRange(period, today = new Date()) {
  const y = today.getFullYear();
  const m = today.getMonth();

  if (period === "week") {
    const daysSinceMonday = (today.getDay() + 6) % 7; // Monday = 0 ... Sunday = 6
    const start = new Date(y, m, today.getDate() - daysSinceMonday);
    const end = new Date(y, m, today.getDate() - daysSinceMonday + 6);
    return { start: toISODate(start), end: toISODate(end) };
  }

  if (period === "year") {
    return { start: `${y}-01-01`, end: `${y}-12-31` };
  }

  const lastDay = new Date(y, m + 1, 0).getDate(); // day 0 of next month = last day of this month
  return { start: `${y}-${pad(m + 1)}-01`, end: `${y}-${pad(m + 1)}-${pad(lastDay)}` };
}

export function isInRange(dateString, range) {
  return dateString >= range.start && dateString <= range.end;
}

// Text shown next to the filter, e.g. "November 2026"
export function getRangeLabel(period, range) {
  const format = (dateString, options) =>
    new Date(dateString + "T00:00:00").toLocaleDateString("en-PH", options);

  if (period === "week") {
    const from = format(range.start, { month: "short", day: "numeric" });
    const to = format(range.end, { month: "short", day: "numeric", year: "numeric" });
    return `${from} to ${to}`;
  }
  if (period === "year") return range.start.slice(0, 4);
  return format(range.start, { month: "long", year: "numeric" });
}

// Splits the range into bars for the chart:
// week -> 7 days, month -> 7-day blocks, year -> 12 months
export function buildBuckets(period, range) {
  const start = new Date(range.start + "T00:00:00");
  const y = start.getFullYear();
  const m = start.getMonth();
  const buckets = [];

  if (period === "week") {
    for (let i = 0; i < 7; i++) {
      const day = new Date(y, m, start.getDate() + i);
      const iso = toISODate(day);
      buckets.push({
        label: day.toLocaleDateString("en-PH", { weekday: "short" }),
        start: iso,
        end: iso,
      });
    }
  } else if (period === "year") {
    for (let month = 0; month < 12; month++) {
      const first = new Date(y, month, 1);
      const last = new Date(y, month + 1, 0);
      buckets.push({
        label: first.toLocaleDateString("en-PH", { month: "short" }),
        start: toISODate(first),
        end: toISODate(last),
      });
    }
  } else {
    const lastDay = new Date(y, m + 1, 0).getDate();
    for (let from = 1; from <= lastDay; from += 7) {
      const to = Math.min(from + 6, lastDay);
      buckets.push({
        label: `${from}-${to}`,
        start: toISODate(new Date(y, m, from)),
        end: toISODate(new Date(y, m, to)),
      });
    }
  }

  return buckets;
}
