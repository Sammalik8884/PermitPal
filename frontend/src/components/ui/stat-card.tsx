import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  icon: LucideIcon;
  trend?: {
    direction: TrendDirection;
    value: string;
  };
  iconColor?: string;
}

// ─── Stat Card (Airbnb property-card style) ───────────────────────────────────

function StatCard({
  value,
  label,
  icon: Icon,
  trend,
  iconColor = "text-[#ff385c]",
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn("airbnb-hover", className)}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #dddddd",
        borderRadius: "14px",
        padding: "24px",
      }}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#6a6a6a",
              lineHeight: "1.29",
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#222222",
              lineHeight: "1.43",
              letterSpacing: "0",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === "up" && (
                <TrendingUp className="h-3.5 w-3.5 text-[#1a7a40]" />
              )}
              {trend.direction === "down" && (
                <TrendingDown className="h-3.5 w-3.5 text-[#c13515]" />
              )}
              {trend.direction === "neutral" && (
                <Minus className="h-3.5 w-3.5 text-[#6a6a6a]" />
              )}
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color:
                    trend.direction === "up"
                      ? "#1a7a40"
                      : trend.direction === "down"
                      ? "#c13515"
                      : "#6a6a6a",
                }}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "9999px",
            backgroundColor: "#fff0f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}

export { StatCard };
export type { StatCardProps, TrendDirection };
