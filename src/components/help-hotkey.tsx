"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toggleHelpDrawer } from "@/components/help-drawer";

// ⌘/ or Ctrl+/ → toggle the contextual help drawer.
// On the dedicated /help page, send the user home instead (already at full guide).
export default function HelpHotkey() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key === "/";
      if (!isShortcut) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      e.preventDefault();
      if (pathname === "/help") {
        router.push("/");
        return;
      }
      toggleHelpDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, pathname]);

  return null;
}
