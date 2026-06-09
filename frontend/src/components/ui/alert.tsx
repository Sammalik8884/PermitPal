import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/5",
        success:
          "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400 bg-green-50 dark:bg-green-950/20",
        warning:
          "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20",
        info: "border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400 bg-blue-50 dark:bg-blue-950/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ─── Icon Map ────────────────────────────────────────────────────────────────

const variantIconMap = {
  default: AlertCircle,
  destructive: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
} as const;

// ─── Alert ───────────────────────────────────────────────────────────────────

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", icon, dismissible, onDismiss, children, ...props }, ref) => {
    const [dismissed, setDismissed] = React.useState(false);

    if (dismissed) return null;

    const IconComponent = variantIconMap[variant ?? "default"];
    const iconElement = icon ?? <IconComponent className="h-4 w-4" />;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), dismissible && "pr-10", className)}
        {...props}
      >
        {iconElement}
        {children}
        {dismissible && (
          <button
            type="button"
            className="absolute right-3 top-3 rounded-md p-0.5 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => {
              setDismissed(true);
              onDismiss?.();
            }}
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

// ─── Alert Title ─────────────────────────────────────────────────────────────

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

// ─── Alert Description ───────────────────────────────────────────────────────

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
export type { AlertProps };
