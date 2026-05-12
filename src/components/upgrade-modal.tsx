"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { X, Crown, Check, ArrowRight, Shield, Infinity } from "lucide-react";
import { MONETIZATION, openCheckout } from "@/lib/monetization";

interface UpgradeContextValue {
  prompt: (reason: string) => void;
}

const UpgradeContext = createContext<UpgradeContextValue | null>(null);

export function useUpgrade(): UpgradeContextValue {
  const ctx = useContext(UpgradeContext);
  if (!ctx) return { prompt: () => {} };
  return ctx;
}

export function UpgradeProvider({ children }: { children: ReactNode }) {
  const [reason, setReason] = useState<string | null>(null);

  const prompt = useCallback((r: string) => setReason(r), []);

  return (
    <UpgradeContext.Provider value={{ prompt }}>
      {children}
      {reason && <UpgradeModal reason={reason} onClose={() => setReason(null)} />}
    </UpgradeContext.Provider>
  );
}

function UpgradeModal({ reason, onClose }: { reason: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 text-white p-6">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={24} fill="currentColor" />
            <span className="text-xs font-bold uppercase tracking-wider">Pro Feature</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">{reason}</h2>
          <p className="text-sm opacity-90">
            Upgrade once. Use forever. No subscriptions.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <ul className="space-y-2">
            {[
              "Hosted AI — no API key needed",
              "Application tracker (save jobs + status)",
              "AI Career Coach chat",
              "Unlimited AI tool runs",
              "One-click deploy to your domain",
              "Remove the Hyred footer badge",
              "Priority email support",
            ].map(f => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{f}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => openCheckout("pro")}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl transition"
            >
              Upgrade to Pro · {MONETIZATION.proPriceUSD} once
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => openCheckout("lifetime")}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-amber-300 bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 transition"
            >
              <Infinity size={16} />
              Lifetime · {MONETIZATION.lifetimePriceUSD}
              <span className="text-xs opacity-70 line-through ml-1">{MONETIZATION.lifetimeRegularPriceUSD}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Shield size={12} />
              {MONETIZATION.moneyBackDays}-day refund
            </span>
            <span>·</span>
            <span>One-time payment</span>
            <span>·</span>
            <span>No subscription</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-xs text-gray-400 hover:text-gray-700 py-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
