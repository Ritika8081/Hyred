"use client";

import Image from "next/image";
import { useState } from "react";
import { withBasePath } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  rounded?: "full" | "2xl";
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  priority?: boolean;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  src,
  name,
  size = 288,
  rounded = "full",
  className = "",
  gradientFrom,
  gradientTo,
  priority = false,
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const hasImage = !!(src && src.trim().length > 0) && !errored;
  const radius = rounded === "full" ? "rounded-full" : "rounded-2xl";

  if (hasImage) {
    return (
      <div
        className={`relative overflow-hidden ${radius} ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={withBasePath(src!)}
          alt={name}
          fill
          sizes={`${size}px`}
          priority={priority}
          className="object-cover"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  const initials = getInitials(name);
  const from = gradientFrom || "#2563eb";
  const to = gradientTo || "#7c3aed";

  return (
    <div
      className={`flex items-center justify-center font-bold text-white ${radius} ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        fontSize: Math.max(24, size * 0.32),
        letterSpacing: "-0.02em",
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
