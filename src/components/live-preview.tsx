"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, X, RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from "lucide-react";
import { buildShareUrl } from "@/lib/share";
import { Portfolio } from "@/types/portfolio";

interface LivePreviewProps {
  portfolio: Portfolio;
}

type Device = "mobile" | "tablet" | "desktop";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const DEVICE_WIDTHS: Record<Device, number> = {
  mobile: 390,
  tablet: 768,
  desktop: 1280,
};

export default function LivePreview({ portfolio }: LivePreviewProps) {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Prefer the local /preview route — it reads the user's localStorage directly so the preview
  // always matches the live builder state. The share URL is still used for the "Open in new tab" link.
  const url = `${BASE}/preview`;
  const shareUrl = buildShareUrl(portfolio);

  // Re-render iframe when portfolio changes (debounced via React's batching, plus key bump)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setRefreshKey(k => k + 1), 300);
    return () => clearTimeout(t);
    // We want to re-mount when content changes — stringify to compare
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(portfolio), open]);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-24 z-30 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-gray-900 text-white shadow-lg hover:shadow-xl hover:scale-105 transition text-sm font-medium"
        aria-label="Toggle live preview"
      >
        <Eye size={14} />
        <span className="hidden sm:inline">{open ? "Hide" : "Live preview"}</span>
      </button>

      {open && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[55vw] lg:w-[50vw] z-40 bg-white shadow-2xl border-l border-gray-200 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="font-bold text-sm text-gray-900">Live preview</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="inline-flex rounded-md bg-white border border-gray-200 p-0.5">
                {([
                  { id: "mobile" as const, Icon: Smartphone },
                  { id: "tablet" as const, Icon: Tablet },
                  { id: "desktop" as const, Icon: Monitor },
                ]).map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDevice(d.id)}
                    className={`p-1.5 rounded ${device === d.id ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"}`}
                    aria-label={d.id}
                  >
                    <d.Icon size={13} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setRefreshKey(k => k + 1)}
                className="p-1.5 rounded text-gray-500 hover:text-gray-900"
                aria-label="Refresh"
                title="Refresh"
              >
                <RefreshCw size={13} />
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded text-gray-500 hover:text-gray-900"
                title="Open in new tab (shareable snapshot)"
              >
                <ExternalLink size={13} />
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded text-gray-500 hover:text-gray-900"
                aria-label="Close"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Frame */}
          <div className="flex-1 overflow-auto bg-gray-100 p-3">
            <div
              className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden h-full transition-all"
              style={{
                width: device === "desktop" ? "100%" : DEVICE_WIDTHS[device],
                maxWidth: "100%",
              }}
            >
              <iframe
                key={refreshKey}
                ref={iframeRef}
                src={url}
                title="Portfolio preview"
                className="w-full h-full border-0"
                style={{ minHeight: "100%" }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>

          <div className="px-3 py-1.5 text-[10px] text-gray-500 border-t bg-gray-50 text-center">
            💡 Auto-refreshes ~300ms after each edit. Renders from a snapshot URL — same code path that other people will see.
          </div>
        </div>
      )}
    </>
  );
}
