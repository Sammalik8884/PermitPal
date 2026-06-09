import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
    variant: {
      default: "text-muted-foreground",
      primary: "text-primary",
      white: "text-white",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

// ─── Loading Spinner ─────────────────────────────────────────────────────────

interface LoadingSpinnerProps
  extends React.SVGAttributes<SVGElement>,
    VariantProps<typeof spinnerVariants> {
  overlay?: boolean;
}

function LoadingSpinner({
  className,
  size,
  variant,
  overlay,
  ...props
}: LoadingSpinnerProps) {
  const spinner = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={cn(spinnerVariants({ size, variant }), className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// ─── Page Loading ────────────────────────────────────────────────────────────

function PageLoading() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" variant="primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export { LoadingSpinner, PageLoading };
export type { LoadingSpinnerProps };
