"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from "lucide-react";

type ToastKind = "success" | "error" | "info" | "ai";

interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  ai: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Safe fallback for components rendered outside provider (e.g. early SSR)
    return {
      toast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      ai: () => {},
    };
  }
  return ctx;
}

const KIND_STYLES: Record<ToastKind, { icon: typeof CheckCircle2; bar: string; iconColor: string }> = {
  success: { icon: CheckCircle2, bar: "bg-emerald-500", iconColor: "text-emerald-500" },
  error: { icon: AlertCircle, bar: "bg-red-500", iconColor: "text-red-500" },
  info: { icon: Info, bar: "bg-blue-500", iconColor: "text-blue-500" },
  ai: { icon: Sparkles, bar: "bg-purple-500", iconColor: "text-purple-500" },
};

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++counter;
    const next: Toast = { id, duration: 4000, ...t };
    setToasts(prev => [...prev, next]);
    if (next.duration && next.duration > 0) {
      setTimeout(() => dismiss(id), next.duration);
    }
  }, [dismiss]);

  const value: ToastContextValue = {
    toast,
    success: (title, description) => toast({ kind: "success", title, description }),
    error: (title, description) => toast({ kind: "error", title, description, duration: 6000 }),
    info: (title, description) => toast({ kind: "info", title, description }),
    ai: (title, description) => toast({ kind: "ai", title, description }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map(t => {
          const s = KIND_STYLES[t.kind];
          const Icon = s.icon;
          return (
            <div
              key={t.id}
              className="pointer-events-auto bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden min-w-[280px] max-w-sm animate-in slide-in-from-right-4 duration-300"
              role="status"
            >
              <div className={`h-1 w-full ${s.bar}`} />
              <div className="p-3 flex items-start gap-3">
                <Icon className={`flex-shrink-0 mt-0.5 ${s.iconColor}`} size={18} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                  {t.description && (
                    <p className="text-xs text-gray-600 mt-0.5">{t.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-700"
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
