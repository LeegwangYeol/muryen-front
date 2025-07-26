"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme, themes } from "../styles/theme";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // SSR/CSR hydration mismatch 방지를 위해, 초기값 undefined로 설정
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  if (!theme) {
    // 아직 테마 결정 전이면 아무것도 렌더하지 않음(로딩)
    return null;
  }

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
