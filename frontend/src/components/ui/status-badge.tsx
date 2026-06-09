import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Status Configuration ────────────────────────────────────────────────────

type StatusType =
  | "compliant"
  | "warning"
  | "non_compliant"
  | "pending"
  | "active"
  | "expired"
  | "exceeded";

interface StatusConfig {
  label: string;
  description: string;
  dotColor: string;
  bgColor: string;
  textColor: string;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  compliant: {
    label: "Compliant",
    description: "All requirements are met",
    dotColor: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-700 dark:text-green-400",
  },
  warning: {
    label: "Warning",
    description: "Action required soon",
    dotColor: "bg-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    textColor: "text-yellow-700 dark:text-yellow-400",
  },
  non_compliant: {
    label: "Non-Compliant",
    description: "Immediate action required",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-400",
  },
  pending: {
    label: "Pending",
    description: "Awaiting review or approval",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-400",
  },
  active: {
    label: "Active",
    description: "Currently active and valid",
    dotColor: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-700 dark:text-green-400",
  },
  expired: {
    label: "Expired",
    description: "No longer valid, renewal needed",
    dotColor: "bg-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-950/30",
    textColor: "text-gray-700 dark:text-gray-400",
  },
  exceeded: {
    label: "Exceeded",
    description: "Limit has been exceeded",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-400",
  },
};

// ─── Status Badge ────────────────────────────────────────────────────────────

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  showDot?: boolean;
  showTooltip?: boolean;
}

function StatusBadge({
  status,
  showDot = true,
  showTooltip = true,
  className,
  ...props
}: StatusBadgeProps) {
  const config = statusConfigs[status];

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        config.bgColor,
        config.textColor,
        className
      )}
      {...props}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              config.dotColor
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              config.dotColor
            )}
          />
        </span>
      )}
      {config.label}
    </span>
  );

  if (!showTooltip) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>
        <p>{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export { StatusBadge, statusConfigs };
export type { StatusBadgeProps, StatusType };
