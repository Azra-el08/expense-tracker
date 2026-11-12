// Avatar colors are dark enough for white initials on top.
export const avatarColors = ["#b7791f", "#c2410c", "#2e7d4f", "#2f6f8f", "#a63d78", "#6b5b95"];

export function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function getFirstName(name) {
  return name.trim().split(/\s+/)[0] || name;
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
