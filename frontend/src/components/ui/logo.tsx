import * as React from "react";
import { cn } from "@/lib/utils";

// ─── PermitPal Brand Icon ─────────────────────────────────────────────────────

export function PermitPalIcon({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Rounded square background */}
      <rect width="32" height="32" rx="8" fill="#ff385c" />
      {/* Shield */}
      <path
        d="M16 5L7 9v6.5C7 20.75 10.9 25.6 16 27c5.1-1.4 9-6.25 9-11.5V9L16 5z"
        fill="white"
      />
      {/* Checkmark */}
      <path
        d="M12 16.5l2.5 2.5 5.5-5.5"
        stroke="#ff385c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── PermitPal Full Wordmark ──────────────────────────────────────────────────

export function PermitPalWordmark({
  size = 32,
  className,
  showText = true,
}: {
  size?: number;
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <PermitPalIcon size={size} />
      {showText && (
        <span
          style={{
            fontSize: Math.round(size * 0.6) + "px",
            fontWeight: 700,
            color: "#ff385c",
            letterSpacing: "-0.3px",
            lineHeight: 1,
          }}
        >
          permitpal
        </span>
      )}
    </div>
  );
}
