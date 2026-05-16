"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";

// Floating help bubble — anchored bottom-right on every marketing/tool page.
// Hidden in the builder/admin to avoid covering controls.
export default function HelpFab() {
  const pathname = usePathname() || "";

  // Don't show on routes where it would overlap product UI
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/build") ||
    pathname === "/help"
  ) {
    return null;
  }

  return (
    <Link
      href="/help"
      aria-label="Open help"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-gray-900 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.55)] hover:bg-black hover:-translate-y-0.5 transition-all duration-200"
    >
      <HelpCircle size={15} className="text-brand-300" />
      <span className="text-[13px] font-semibold tracking-tight">Help</span>
      <span className="hidden sm:inline-flex ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold text-gray-300 bg-white/10 border border-white/15">
        ⌘/
      </span>
    </Link>
  );
}
