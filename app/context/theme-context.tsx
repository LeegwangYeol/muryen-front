"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme, themes } from "../styles/theme";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // determine initial theme synchronously (on client) to avoid FOUC
  const [theme, setTheme] = useState<Theme>(
    ((): Theme => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored === "dark" || stored === "light") return stored;
      }
      return "light";
    })()
  );

  // keep <html> class in sync
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
