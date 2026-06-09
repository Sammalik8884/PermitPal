import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Skeleton ────────────────────────────────────────────────────────────────

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = "text",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const defaultDimensions = {
    text: { width: "100%", height: "1rem" },
    circular: { width: "2.5rem", height: "2.5rem" },
    rectangular: { width: "100%", height: "4rem" },
  };

  const resolvedWidth = width ?? defaultDimensions[variant].width;
  const resolvedHeight = height ?? defaultDimensions[variant].height;

  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variantClasses[variant],
        className
      )}
      style={{
        width: typeof resolvedWidth === "number" ? `${resolvedWidth}px` : resolvedWidth,
        height: typeof resolvedHeight === "number" ? `${resolvedHeight}px` : resolvedHeight,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

// ─── Skeleton Compositions ───────────────────────────────────────────────────

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-3 rounded-lg border p-4", className)} {...props}>
      <Skeleton variant="rectangular" height="8rem" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {/* Header */}
      <div className="flex gap-4 border-b pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" height="0.75rem" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={`cell-${rowIdx}-${colIdx}`}
              variant="text"
              height="0.75rem"
              width={`${60 + Math.random() * 40}%`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonList({
  items = 3,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { items?: number }) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="50%" height="0.875rem" />
            <Skeleton variant="text" width="75%" height="0.75rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonList };
export type { SkeletonProps };
