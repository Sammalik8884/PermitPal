import { DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { AuLevySummaryData } from "@/lib/mock-data";

interface LevySummaryProps {
  summary: AuLevySummaryData;
}

export function LevySummary({ summary }: LevySummaryProps) {
  const statusConfig = {
    paid: { label: "Paid", color: "bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-800" },
    partial: { label: "Partial", color: "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-800" },
    unpaid: { label: "Unpaid", color: "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800" },
    overpaid: { label: "Overpaid", color: "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800" },
    unknown: { label: "Unknown", color: "bg-gray-500/10 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-800" },
  };

  const config = statusConfig[summary.status] || statusConfig["unknown"];

  return (
    <Card className="relative overflow-hidden border-[#ebebeb] shadow-airbnb transition-all">
      
      <CardHeader className="pb-4" style={{ borderBottom: "1px solid #ebebeb" }}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle style={{ fontSize: "18px", fontWeight: 600, color: "#222222", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ backgroundColor: "#fff0ef", padding: "6px", borderRadius: "6px" }}>
                <DollarSign style={{ width: "16px", height: "16px", color: "#ff385c" }} />
              </div>
              Levy Summary <span style={{ color: "#929292", fontWeight: 400, marginLeft: "4px" }}>— {summary.year}</span>
            </CardTitle>
            <p style={{ fontSize: "14px", color: "#6a6a6a", marginLeft: "36px" }}>{summary.propertyName}</p>
          </div>
          <Badge
            variant="outline"
            style={{
              fontSize: "12px",
              padding: "4px 12px",
              fontWeight: 500,
              backgroundColor: "#ffffff",
              color: "#222222",
              border: "1px solid #dddddd",
            }}
          >
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <SummaryItem
            label="Total Nights"
            value={summary.totalNights ? String(summary.totalNights) : "0"}
            icon={<TrendingUp style={{ width: "16px", height: "16px", color: "#2a4db3" }} />}
            iconBg="#f0f4ff"
            tooltipText="Total number of booked nights subject to the short-stay levy."
          />
          <SummaryItem
            label="Levy Rate"
            value={formatCurrency(summary.levyRatePerNight, "AUD") + "/night"}
            icon={<Minus style={{ width: "16px", height: "16px", color: "#6a6a6a" }} />}
            iconBg="#f7f7f7"
            tooltipText="Government tax rate charged per booked night."
          />
          <SummaryItem
            label="Total Owed"
            value={formatCurrency(summary.totalOwed, "AUD")}
            icon={<TrendingUp style={{ width: "16px", height: "16px", color: "#c13515" }} />}
            iconBg="#fff0ef"
            tooltipText="Total levy tax amount owed for the selected year."
          />
          <SummaryItem
            label="Total Paid"
            value={formatCurrency(summary.totalPaid, "AUD")}
            icon={<TrendingDown style={{ width: "16px", height: "16px", color: "#1a7a40" }} />}
            iconBg="#f0faf4"
            tooltipText="Total levy tax already paid to the government."
          />
          <SummaryItem
            label="Balance"
            value={formatCurrency(summary.balance, "AUD")}
            icon={
              summary.balance > 0 ? (
                <TrendingUp style={{ width: "16px", height: "16px", color: "#c13515" }} />
              ) : (
                <TrendingDown style={{ width: "16px", height: "16px", color: "#1a7a40" }} />
              )
            }
            iconBg={summary.balance > 0 ? "#fff0ef" : "#f0faf4"}
            highlight={summary.balance > 0}
            tooltipText="Outstanding balance. Negative amount indicates you have overpaid."
          />
        </div>
      </CardContent>
    </Card>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

function SummaryItem({
  label,
  value,
  icon,
  iconBg,
  highlight,
  tooltipText,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  highlight?: boolean;
  tooltipText?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #ebebeb",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          style={{
            height: "32px",
            width: "32px",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: iconBg,
          }}
        >
          {icon}
        </div>
        <div className="flex items-center gap-1.5">
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#6a6a6a" }}>
            {label}
          </p>
          {tooltipText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info style={{ width: "14px", height: "14px", color: "#929292", cursor: "help" }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p style={{ maxWidth: "200px", fontSize: "12px" }}>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <p style={{ fontSize: "20px", fontWeight: 700, color: highlight ? "#c13515" : "#222222", letterSpacing: "-0.5px" }}>
        {value}
      </p>
    </div>
  );
}
