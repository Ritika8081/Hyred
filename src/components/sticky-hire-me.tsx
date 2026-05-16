"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { isPortfolioRoute } from "@/lib/zone";

export default function StickyHireMe() {
  const { data } = usePortfolioData();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after user scrolls past hero (~600px)
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only appears on the user's portfolio pages — not on Hyred marketing/builder.
  if (!isPortfolioRoute(pathname)) return null;

  // And not on /contact or /resume (already at destination)
  if (pathname?.includes("/contact") || pathname?.includes("/resume")) return null;

  if (!data.personalInfo.openToWork) return null;

  const gradFrom = data.personalInfo.brand?.gradientFrom || "#2563eb";
  const gradTo = data.personalInfo.brand?.gradientTo || "#0d9488";

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      }`}
    >
      <Link href="/contact">
        <button
          className="group flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl text-white font-semibold hover:scale-105 active:scale-95 transition"
          style={{
            background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
          }}
          aria-label="Hire Me"
        >
          <Mail size={18} />
          <span className="hidden sm:inline">Hire Me</span>
        </button>
      </Link>
    </div>
  );
}
