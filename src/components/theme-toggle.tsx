"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

// Compact icon button used in the nav. Until the provider mounts on the
// client, render a static placeholder so SSR + first-paint markup match
// the client exactly (no hydration mismatch on aria/title/children).
export default function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { theme, toggle, mounted } = useTheme();
  const isDark = theme === "dark";
  const px = size === "sm" ? "w-8 h-8" : "w-9 h-9";

  return (
    <button
      type="button"
      onClick={toggle}
      // Use a generic label until mounted so SSR/client agree
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
      title={mounted ? (isDark ? "Light mode" : "Dark mode") : "Toggle theme"}
      // Disable interaction until mounted so accidental clicks during SSR don't fire
      disabled={!mounted}
      className={`inline-flex items-center justify-center ${px} rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.06] transition disabled:opacity-60 disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className}`}
      suppressHydrationWarning
    >
      {!mounted ? (
        // Neutral placeholder — identical server and client
        <Sun size={15} aria-hidden="true" className="opacity-0" />
      ) : isDark ? (
        <Sun size={15} aria-hidden="true" />
      ) : (
        <Moon size={15} aria-hidden="true" />
      )}
    </button>
  );
}
