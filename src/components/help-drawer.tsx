"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HelpCircle,
  X,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Keyboard,
} from "lucide-react";
import { getPageHelp } from "@/lib/page-help";

// Singleton open/close — the FAB, the ⌘/ hotkey, and the drawer all read
// from the same source so they stay in sync without prop drilling.
type Listener = (open: boolean) => void;
const listeners = new Set<Listener>();
let isOpenState = false;
export function isHelpDrawerOpen() { return isOpenState; }
export function subscribeHelpDrawer(cb: Listener): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
export function openHelpDrawer() {
  if (isOpenState) return;
  isOpenState = true;
  listeners.forEach(fn => fn(true));
}
export function closeHelpDrawer() {
  if (!isOpenState) return;
  isOpenState = false;
  listeners.forEach(fn => fn(false));
}
export function toggleHelpDrawer() {
  isOpenState ? closeHelpDrawer() : openHelpDrawer();
}

// Body-scroll lock with a reference counter so other modals coexist safely.
let scrollLockCount = 0;
let prevBodyOverflow = "";
function lockBodyScroll() {
  if (scrollLockCount === 0) {
    prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  scrollLockCount++;
}
function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = prevBodyOverflow;
  }
}

export default function HelpDrawer() {
  const [open, setOpen] = useState(() => isOpenState);
  const pathname = usePathname() || "/";
  const help = useMemo(() => getPageHelp(pathname), [pathname]);
  const panelRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const isFirstRender = useRef(true);

  // Subscribe to singleton state (re-sync in case it changed before mount)
  useEffect(() => {
    setOpen(isOpenState);
    return subscribeHelpDrawer(setOpen);
  }, []);

  // Close on route change — skip the initial mount so deep-links/keyboard
  // opens that fire during the same render aren't immediately dismissed.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    closeHelpDrawer();
  }, [pathname]);

  // Esc-to-close, body-scroll lock, focus management
  useEffect(() => {
    if (!open) return;

    // Save the previously-focused element so we can restore it on close
    restoreFocusRef.current = (document.activeElement as HTMLElement) || null;

    lockBodyScroll();

    // Move focus into the drawer for screen readers + keyboard users
    requestAnimationFrame(() => {
      const closeBtn = panelRef.current?.querySelector<HTMLElement>("[data-drawer-close]");
      closeBtn?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeHelpDrawer();
        return;
      }
      // Lightweight focus trap on Tab
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      unlockBodyScroll();
      // Restore focus to the element that opened the drawer
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeHelpDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-drawer-title"
        className={`fixed top-0 right-0 z-[61] h-full w-full sm:max-w-md bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 will-change-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/70 dark:border-gray-800/70">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                <HelpCircle size={15} className="text-brand-300 dark:text-brand-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">
                  On this page
                </div>
                <div
                  id="help-drawer-title"
                  className="font-display text-base font-semibold text-gray-900 dark:text-white -mt-0.5 truncate"
                >
                  {help.title}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={closeHelpDrawer}
              aria-label="Close help"
              data-drawer-close
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-thin">
            <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed">
              {help.intro}
            </p>

            <ol className="space-y-3">
              {help.tips.map((t, i) => (
                <li
                  key={t.title}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 dark:bg-white/[0.03] border border-gray-200/70 dark:border-gray-800/70"
                >
                  <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-100 dark:text-brand-300 dark:bg-brand-500/10 dark:border-brand-500/20">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-gray-900 dark:text-white">
                      {t.title}
                    </div>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">
                      {t.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {help.cta && (
              <Link
                href={help.cta.href}
                onClick={closeHelpDrawer}
                className="group flex items-center justify-between w-full px-4 py-3 rounded-xl text-[13px] font-semibold text-white bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="inline-flex items-center gap-2">
                  <BookOpen size={14} className="text-brand-300 dark:text-brand-600" />
                  {help.cta.label}
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}

            <div className="pt-2 border-t border-gray-200/70 dark:border-gray-800/70" />

            <div className="space-y-2">
              <Link
                href="/help"
                onClick={closeHelpDrawer}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.04] transition"
              >
                <span className="inline-flex items-center gap-2">
                  <BookOpen size={14} className="text-gray-400 dark:text-gray-500" />
                  Browse the full guide
                </span>
                <ArrowRight size={13} className="text-gray-400 dark:text-gray-500" />
              </Link>
              <Link
                href="/contact"
                onClick={closeHelpDrawer}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.04] transition"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle size={14} className="text-gray-400 dark:text-gray-500" />
                  Talk to a human
                </span>
                <ArrowRight size={13} className="text-gray-400 dark:text-gray-500" />
              </Link>
              <div className="flex items-center justify-between px-3 py-2.5 text-[12px] text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-2">
                  <Keyboard size={13} className="text-gray-400 dark:text-gray-500" />
                  Shortcut
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold text-gray-700 bg-gray-100 border border-gray-200 dark:text-gray-200 dark:bg-white/[0.08] dark:border-gray-700">
                    ⌘
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold text-gray-700 bg-gray-100 border border-gray-200 dark:text-gray-200 dark:bg-white/[0.08] dark:border-gray-700">
                    /
                  </kbd>
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
