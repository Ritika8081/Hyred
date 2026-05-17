"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "hyredTheme";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start as "light" so SSR + initial client render produce IDENTICAL
  // markup (no hydration mismatch). The inline boot script in <head> already
  // applied the correct `.dark` class to <html>, so the page looks right
  // before React hydrates. We sync our state in the first effect.
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const isFirstApply = useRef(true);

  useEffect(() => {
    setThemeState(readInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isFirstApply.current) {
      isFirstApply.current = false;
      // Reconcile: ensure <html> class matches our state after first sync.
      const root = document.documentElement;
      const wantDark = theme === "dark";
      const hasDark = root.classList.contains("dark");
      if (wantDark !== hasDark) {
        if (wantDark) root.classList.add("dark");
        else root.classList.remove("dark");
      }
      return;
    }
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggle = useCallback(() => setThemeState(t => (t === "dark" ? "light" : "dark")), []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "light" as Theme,
      setTheme: () => {},
      toggle: () => {},
      mounted: false,
    };
  }
  return ctx;
}
