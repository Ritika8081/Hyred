"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Global ⌘/ (or Ctrl+/) → jump to /help.
// Lightweight component, no UI — mounted once in the root layout.
export default function HelpHotkey() {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key === "/";
      if (!isShortcut) return;
      // Don't hijack the shortcut while the user is typing in an input
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      e.preventDefault();
      router.push("/help");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return null;
}
