"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles, Eye, X } from "lucide-react";
import { Portfolio } from "@/types/portfolio";

const SEEN_KEY = "hyredWelcomeSeen";

interface WelcomeModalProps {
  onStartFresh: () => void;
  onKeepDemo: () => void;
}

function makeEmptyPortfolio(): Portfolio {
  return {
    personalInfo: {
      name: "",
      title: "",
      bio: "",
      avatar: "",
      resume: "",
      tagline: "",
      yearsOfExperience: 0,
      openToWork: true,
      roles: [],
      highlights: [],
      brand: {
        accent: "#0d9488",
        gradientFrom: "#0d9488",
        gradientTo: "#84cc16",
      },
    },
    contact: { email: "", location: "" },
    projects: [],
    skills: [],
    experience: [],
    education: [],
    testimonials: [],
    certifications: [],
  };
}

export { makeEmptyPortfolio };

export default function WelcomeModal({ onStartFresh, onKeepDemo }: WelcomeModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) setShow(true);
  }, []);

  const close = (action: "fresh" | "demo" | "later") => {
    localStorage.setItem(SEEN_KEY, "1");
    if (action === "fresh") onStartFresh();
    if (action === "demo") onKeepDemo();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={() => close("later")}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-brand-600 to-coral-600 text-white p-6 md:p-8">
          <div className="text-4xl mb-2">👋</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome to Hyred
          </h2>
          <p className="opacity-90 text-sm md:text-base">
            Let&apos;s get you a portfolio in 7 minutes. Pick how you want to start:
          </p>
        </div>

        <div className="p-6 space-y-3">
          <button
            type="button"
            onClick={() => close("fresh")}
            className="w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-coral-50 hover:border-brand-400 transition group"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-brand-600 to-coral-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 mb-0.5 flex items-center gap-2">
                Start fresh — build mine from scratch
                <span className="text-xs px-1.5 py-0.5 rounded bg-brand-200 text-brand-900 font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Clear the demo data. Then paste your resume below to auto-fill, or edit field by field.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => close("demo")}
            className="w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white transition"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Eye size={20} className="text-gray-700" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 mb-0.5">
                Keep the demo data — explore first
              </div>
              <p className="text-sm text-gray-600">
                See a fully-built sample portfolio. Edit it as a template. (You can wipe it anytime in Quick Actions.)
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => close("later")}
            className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2"
          >
            Decide later
          </button>
        </div>

        <div className="px-6 pb-6 -mt-2">
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <FileText size={12} className="flex-shrink-0 mt-0.5" />
            <span>
              <strong>Your data stays in your browser.</strong> Nothing is uploaded. Export anytime as JSON.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
