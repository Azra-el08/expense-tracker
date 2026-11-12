import { useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import { KEYS, readJSON, removeKey, writeJSON } from "../utils/storage";
import { createSalt, hashPassword } from "../utils/security";
import { avatarColors } from "../utils/profile";
import { toISODate } from "../utils/dateRange";
import { dummyBudgets, dummyCategories, dummyTransactions } from "../data/dummyData";

// Accounts live in this browser only (localStorage) until the PHP backend arrives in Stage 7.
// The shape of the functions below is what the real API version will keep.

const DEMO_ID = "demo";
const DEMO_EMAIL = "demo@kaban.app";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const makeId = () => "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readJSON(KEYS.users, []));
  const [sessionId, setSessionId] = useState(() => readJSON(KEYS.session, null));

  const saveUsers = (next) => {
    setUsers(next);
    writeJSON(KEYS.users, next);
  };

  const startSession = (id) => {
    setSessionId(id);
    writeJSON(KEYS.session, id);
  };

  // The stored record has the password hash. Components only ever see this safe copy.
  const record = users.find((u) => u.id === sessionId) ?? null;
  const user = useMemo(
    () =>
      record
        ? { id: record.id, name: record.name, email: record.email, color: record.color, joined: record.joined }
        : null,
    [record]
  );

  const register = async ({ name, email, password }) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) return { ok: false, error: "Enter your name." };
    if (!EMAIL_PATTERN.test(cleanEmail)) return { ok: false, error: "Enter a valid email address." };
    if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    if (cleanEmail === DEMO_EMAIL || users.some((u) => u.email === cleanEmail)) {
      return { ok: false, error: "That email is already registered." };
    }

    const salt = createSalt();
    const passwordHash = await hashPassword(password, salt);
    const newUser = {
      id: makeId(),
      name: cleanName,
      email: cleanEmail,
      salt,
      passwordHash,
      color: avatarColors[users.length % avatarColors.length],
      joined: toISODate(new Date()),
    };

    saveUsers([...users, newUser]);
    startSession(newUser.id);
    return { ok: true };
  };

  const login = async ({ email, password }) => {
    const found = users.find((u) => u.email === email.trim().toLowerCase());
    const wrong = { ok: false, error: "Wrong email or password." }; // same message for both, on purpose

    if (!found) return wrong;
    const hash = await hashPassword(password, found.salt);
    if (hash !== found.passwordHash) return wrong;

    startSession(found.id);
    return { ok: true };
  };

  // One-click account filled with sample data, so the app can be explored right away
  const loginAsDemo = async () => {
    let demo = users.find((u) => u.id === DEMO_ID);

    if (!demo) {
      const salt = createSalt();
      demo = {
        id: DEMO_ID,
        name: "Demo User",
        email: DEMO_EMAIL,
        salt,
        passwordHash: await hashPassword(makeId(), salt), // nobody knows it: the demo is entered by button only
        color: avatarColors[0],
        joined: toISODate(new Date()),
      };
      saveUsers([...users, demo]);
      writeJSON(KEYS.data(DEMO_ID), {
        transactions: dummyTransactions,
        categories: dummyCategories,
        budgets: dummyBudgets,
      });
    }

    startSession(demo.id);
    return { ok: true };
  };

  const logout = () => {
    setSessionId(null);
    removeKey(KEYS.session);
  };

  const updateProfile = ({ name, color }) => {
    const cleanName = name.trim();
    if (!cleanName) return { ok: false, error: "Name cannot be empty." };

    saveUsers(users.map((u) => (u.id === sessionId ? { ...u, name: cleanName, color } : u)));
    return { ok: true };
  };

  const changePassword = async ({ current, next }) => {
    if (!record) return { ok: false, error: "You are not logged in." };
    if (record.id === DEMO_ID) return { ok: false, error: "The demo account's password cannot be changed." };

    const currentHash = await hashPassword(current, record.salt);
    if (currentHash !== record.passwordHash) return { ok: false, error: "Your current password is wrong." };
    if (next.length < 8) return { ok: false, error: "New password must be at least 8 characters." };

    const salt = createSalt();
    const passwordHash = await hashPassword(next, salt);
    saveUsers(users.map((u) => (u.id === record.id ? { ...u, salt, passwordHash } : u)));
    return { ok: true };
  };

  const deleteAccount = () => {
    if (!record) return { ok: false, error: "You are not logged in." };
    if (record.id === DEMO_ID) return { ok: false, error: "The demo account cannot be deleted." };

    removeKey(KEYS.data(record.id)); // this account's transactions, categories and budgets
    saveUsers(users.filter((u) => u.id !== record.id));
    setSessionId(null);
    removeKey(KEYS.session);
    return { ok: true };
  };

  const value = {
    user,
    isDemo: user?.id === DEMO_ID,
    register,
    login,
    loginAsDemo,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
