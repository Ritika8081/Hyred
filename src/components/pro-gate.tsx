"use client";

import { useEffect, useState, ReactNode } from "react";
import { Lock, Crown } from "lucide-react";
import { hasPro } from "@/lib/monetization";
import { useUpgrade } from "@/components/upgrade-modal";
import ProBadge from "@/components/pro-badge";

interface ProGateProps {
  feature: string; // shown in upgrade modal — e.g. "Unlock Application Tracker"
  children: ReactNode;
  variant?: "overlay" | "block";
}

export default function ProGate({ feature, children, variant = "overlay" }: ProGateProps) {
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const { prompt } = useUpgrade();

  useEffect(() => {
    setIsPro(hasPro());
    const interval = setInterval(() => setIsPro(hasPro()), 2000);
    return () => clearInterval(interval);
  }, []);

  if (isPro === null) {
    // SSR — assume unlocked to avoid flash; recheck on client
    return <>{children}</>;
  }

  if (isPro) return <>{children}</>;

  if (variant === "block") {
    return (
      <div className="rounded-xl border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center">
        <Crown size={32} className="text-amber-500 mx-auto mb-3" fill="currentColor" />
        <h3 className="font-bold text-gray-900 mb-1">{feature}</h3>
        <p className="text-sm text-gray-600 mb-4">A Pro feature. Pay once, use forever.</p>
        <button
          type="button"
          onClick={() => prompt(feature)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow hover:shadow-lg transition"
        >
          <Crown size={14} fill="currentColor" />
          Unlock Pro · $9
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="filter blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <button
        type="button"
        onClick={() => prompt(feature)}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl"
      >
        <ProBadge size="md" />
        <div className="text-center max-w-xs">
          <p className="font-bold text-gray-900 flex items-center justify-center gap-1.5">
            <Lock size={14} />
            {feature}
          </p>
          <p className="text-xs text-gray-600 mt-1">Click to unlock for $9 once.</p>
        </div>
      </button>
    </div>
  );
}
