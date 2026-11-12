import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";
import { KEYS, readJSON, writeJSON } from "../utils/storage";

// Use the saved choice, otherwise follow the computer's light/dark setting
function getInitialTheme() {
  const saved = readJSON(KEYS.theme, null);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // The CSS reads <html data-theme="...">, so one attribute re-colors the whole site
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeJSON(KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
