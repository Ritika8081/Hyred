"use client";

import { Crown } from "lucide-react";

interface ProBadgeProps {
  size?: "xs" | "sm" | "md";
  className?: string;
}

export default function ProBadge({ size = "xs", className = "" }: ProBadgeProps) {
  const sizes = {
    xs: "text-[10px] px-1.5 py-0.5 gap-0.5",
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
  };
  const iconSize = size === "xs" ? 10 : size === "sm" ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm uppercase tracking-wider ${sizes[size]} ${className}`}
    >
      <Crown size={iconSize} fill="currentColor" />
      Pro
    </span>
  );
}
