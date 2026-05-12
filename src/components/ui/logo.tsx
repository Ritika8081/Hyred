"use client";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  variant?: "default" | "mono" | "white";
  className?: string;
}

export default function Logo({
  size = 32,
  showWordmark = true,
  variant = "default",
  className = "",
}: LogoProps) {
  const gradId = `logo-grad-${variant}`;
  const fillStart = variant === "white" ? "#ffffff" : variant === "mono" ? "#0f172a" : "#7c3aed";
  const fillEnd = variant === "white" ? "#ffffff" : variant === "mono" ? "#0f172a" : "#ec4899";
  const textColor = variant === "white" ? "text-white" : "text-gray-900";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={fillStart} />
            <stop offset="100%" stopColor={fillEnd} />
          </linearGradient>
        </defs>
        {/* Rounded square mark */}
        <rect x="0" y="0" width="40" height="40" rx="10" fill={`url(#${gradId})`} />
        {/* H-shape: two verticals connected by an upward-pointing arrow (the "get hired" lift) */}
        <path
          d="M11 11 L11 29 M29 11 L29 29 M11 20 L29 20 M22 14 L29 20 L22 26"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span
          className={`font-display text-xl font-bold tracking-tight ${textColor}`}
          style={{ letterSpacing: "-0.02em" }}
        >
          Hyred
        </span>
      )}
    </span>
  );
}
