"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { openHelpDrawer, subscribeHelpDrawer, isHelpDrawerOpen } from "@/components/help-drawer";

// Floating help bubble — visible on every page, opens the contextual drawer.
// Hides itself while the drawer is open to avoid the visual clash + stray clicks.
export default function HelpFab() {
  const pathname = usePathname() || "";
  const [drawerOpen, setDrawerOpen] = useState(() => isHelpDrawerOpen());

  useEffect(() => subscribeHelpDrawer(setDrawerOpen), []);

  // Hide on the dedicated /help page (it's the full doc)
  if (pathname === "/help") return null;

  return (
    <button
      type="button"
      onClick={openHelpDrawer}
      aria-label="Open help"
      data-touch
      aria-hidden={drawerOpen}
      className={`group fixed safe-fab-bottom safe-fab-right z-40 inline-flex items-center gap-2 pl-3 pr-3.5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.55)] hover:bg-black dark:hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        drawerOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <HelpCircle size={15} className="text-brand-300 dark:text-brand-600" />
      <span className="text-[13px] font-semibold tracking-tight">Help</span>
      <span className="hidden sm:inline-flex ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold text-gray-300 dark:text-gray-700 bg-white/10 dark:bg-gray-200 border border-white/15 dark:border-gray-300">
        ⌘/
      </span>
    </button>
  );
}
