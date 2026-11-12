// Small helpers around localStorage. Every call is wrapped in try/catch because
// storage can be blocked or full, and the app should keep working either way.

export const KEYS = {
  users: "kaban:users",
  session: "kaban:session",
  theme: "kaban:theme",
  data: (userId) => `kaban:data:${userId}`, // one data bucket per account
};

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: nothing we can do, keep going
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
