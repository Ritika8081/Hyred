"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Star } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { MONETIZATION } from "@/lib/monetization";
import { isPortfolioRoute } from "@/lib/zone";
import { STORAGE_KEYS, migrateLegacyKeys } from "@/lib/storage-keys";

const STORAGE_KEY = STORAGE_KEYS.feedbackHistory;

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const pathname = usePathname();
  const toast = useToast();

  useEffect(() => {
    migrateLegacyKeys();
  }, []);

  // Hide on builder pages (visual clutter) AND on the user's portfolio pages
  // (the widget is for Hyred-product feedback, not visitors of someone's portfolio).
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/build")) return null;
  if (isPortfolioRoute(pathname)) return null;

  const sendFeedback = () => {
    if (rating === 0 && message.trim().length < 5) return;
    setSending(true);

    // Save locally for the user's record
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      history.push({ rating, message, name, page: pathname, at: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {}

    // Open mailto with prefilled body — the cleanest no-backend feedback channel
    const subject = encodeURIComponent(`Hyred feedback (${rating}★) from ${name || "anonymous"}`);
    const body = encodeURIComponent(
      `Rating: ${rating}/5\nPage: ${pathname}\nFrom: ${name || "(anonymous)"}\n\n${message}\n\n--\nSent from Hyred feedback widget`
    );
    window.location.href = `mailto:${MONETIZATION.feedbackEmail}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSending(false);
      setOpen(false);
      setRating(0);
      setMessage("");
      setName("");
      toast.success("Thanks for the feedback!", "Your email client should have opened to send it.");
    }, 600);
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-gray-800 border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition text-sm font-medium"
        aria-label="Send feedback"
      >
        <MessageCircle size={16} />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-20 left-6 z-50 w-[calc(100vw-3rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="bg-gradient-to-br from-brand-600 to-coral-600 text-white p-4 flex items-start justify-between">
            <div>
              <h3 className="font-bold">How&apos;s Hyred for you?</h3>
              <p className="text-xs opacity-90 mt-0.5">
                Your honest feedback shapes the product. We read every message.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Rate your experience
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className="p-1 hover:scale-110 transition"
                    aria-label={`${n} star`}
                  >
                    <Star
                      size={28}
                      className={n <= rating ? "text-yellow-400" : "text-gray-300"}
                      fill={n <= rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="What worked? What didn't? What would make you tell your friends?"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <button
              type="button"
              onClick={sendFeedback}
              disabled={sending || (rating === 0 && message.trim().length < 5)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-coral-600 text-white font-semibold text-sm hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              Send feedback
            </button>

            <p className="text-[10px] text-gray-400 text-center">
              Opens your email client. No data is sent to us automatically.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
