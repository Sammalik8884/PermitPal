import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2.5",
        lg: "h-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// ─── Color Helper ────────────────────────────────────────────────────────────

function getColorClass(value: number): string {
  if (value > 66) return "bg-green-500";
  if (value > 33) return "bg-yellow-500";
  return "bg-red-500";
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  showLabel?: boolean;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, size, showLabel, indicatorClassName, ...props }, ref) => {
  const safeValue = Math.max(0, Math.min(100, value ?? 0));
  const colorClass = getColorClass(safeValue);

  return (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ size }), className)}
        value={safeValue}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full flex-1 rounded-full transition-all duration-500 ease-in-out",
            colorClass,
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - safeValue}%)` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <span
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums",
            size === "lg" ? "pr-2 text-white mix-blend-difference" : "-top-5 text-muted-foreground"
          )}
        >
          {Math.round(safeValue)}%
        </span>
      )}
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
export type { ProgressProps };
