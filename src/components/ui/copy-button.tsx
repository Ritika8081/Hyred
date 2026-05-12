"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ value, label, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select-and-copy
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
      document.body.removeChild(textarea);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium transition ${className}`}
      aria-label={label ? `Copy ${label}` : "Copy"}
    >
      {copied ? (
        <>
          <Check size={14} className="text-green-600" />
          <span className="text-green-700">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>{label || "Copy"}</span>
        </>
      )}
    </button>
  );
}
