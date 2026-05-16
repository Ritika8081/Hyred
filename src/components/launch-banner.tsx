"use client";

import { useEffect, useState } from "react";
import { Zap, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { MONETIZATION } from "@/lib/monetization";

const DISMISS_KEY = "hyredLaunchBannerDismissed";

function timeLeft(target: string): string {
  const now = Date.now();
  const t = new Date(target + "T23:59:59Z").getTime();
  const diff = t - now;
  if (diff <= 0) return "";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

export default function LaunchBanner() {
  const [show, setShow] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;
    const left = timeLeft(MONETIZATION.launchPriceEndsAt);
    if (!left) return;
    setShow(true);
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!show) return null;
  const left = timeLeft(MONETIZATION.launchPriceEndsAt);
  if (!left) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  return (
    <div className="relative bg-gradient-to-r from-brand-600 via-coral-600 to-orange-500 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-3 flex-wrap">
        <Zap size={14} fill="currentColor" />
        <span className="font-semibold">Launch pricing:</span>
        <span>
          <strong>{MONETIZATION.proPriceUSD}</strong>{" "}
          <span className="line-through opacity-70">{MONETIZATION.proRegularPriceUSD}</span>
        </span>
        <span className="opacity-90">·</span>
        <span className="opacity-90">{left}</span>
        <Link href="/pricing" className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-semibold transition">
          Claim it
          <ArrowRight size={11} />
        </Link>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-1/2 right-2 -translate-y-1/2 text-white/60 hover:text-white"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
      <span data-tick={tick} className="hidden" />
    </div>
  );
}
