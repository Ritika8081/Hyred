"use client";

import { Shield, Lock, Sparkles, Heart } from "lucide-react";

// Honest trust signals only — facts about how the product works, not made-up customer claims.
// When you have real customer logos / university partnerships, swap this content.

const FACTS = [
  { icon: Lock, label: "Your data never leaves your browser" },
  { icon: Shield, label: "No account · No tracking · No upsell ambush" },
  { icon: Sparkles, label: "Bring your own AI key — or use Pro" },
  { icon: Heart, label: "One-time pricing · No subscriptions ever" },
];

export default function TrustBand() {
  return (
    <section className="border-y border-gray-200/60 bg-white/80 backdrop-blur-sm py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-x-6 md:gap-x-10 gap-y-2 flex-wrap text-xs md:text-sm text-gray-600">
          {FACTS.map(f => {
            const Icon = f.icon;
            return (
              <span key={f.label} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Icon size={12} className="text-brand-500 flex-shrink-0" />
                {f.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
