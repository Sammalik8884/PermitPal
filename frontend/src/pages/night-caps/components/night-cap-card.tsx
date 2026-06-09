import { motion } from "framer-motion";
import { Calendar, Clock, Rss, Plus, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { NightCapDetail } from "@/hooks/use-night-caps";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NightCapCardProps {
  data: NightCapDetail;
  onAddNight: (propertyId: string) => void;
  onViewCalendar: (propertyId: string) => void;
  onManageFeeds: (propertyId: string) => void;
}

// ─── Color Helpers ───────────────────────────────────────────────────────────

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return "#ef4444"; // red
  if (percentage >= 80) return "#f97316"; // orange
  if (percentage >= 60) return "#eab308"; // yellow
  return "#22c55e"; // green
}

function getStatusBadge(status: string) {
  switch (status) {
    case "on_track":
      return { label: "On Track", variant: "default" as const, icon: CheckCircle2 };
    case "warning":
      return { label: "Warning", variant: "secondary" as const, icon: AlertTriangle };
    case "critical":
      return { label: "Exceeded", variant: "destructive" as const, icon: XCircle };
    default:
      return { label: "Unknown", variant: "outline" as const, icon: Clock };
  }
}

// ─── Circular Progress Component ─────────────────────────────────────────────

function CircularProgress({
  percentage,
  nightsUsed,
  nightCap,
}: {
  percentage: number;
  nightsUsed: number;
  nightCap: number;
}) {
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(percentage, 100);
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;
  const color = getProgressColor(percentage);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold tabular-nums">{nightsUsed}</span>
        <span className="text-xs text-muted-foreground">/ {nightCap}</span>
      </div>
    </div>
  );
}

// ─── Night Cap Card ──────────────────────────────────────────────────────────

export function NightCapCard({ data, onAddNight, onViewCalendar, onManageFeeds }: NightCapCardProps) {
  const statusInfo = getStatusBadge(data.status);
  const StatusIcon = statusInfo.icon;
  const progressColor = getProgressColor(data.percentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-base">{data.propertyName}</h3>
            <p className="text-xs text-muted-foreground">{data.jurisdictionName}</p>
          </div>
          <Badge variant={statusInfo.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>

        {/* Circular Progress */}
        <div className="flex items-center justify-center py-4">
          <CircularProgress
            percentage={data.percentage}
            nightsUsed={data.nightsUsed}
            nightCap={data.nightCap}
          />
        </div>

        {/* Progress Bar (compact alternative) */}
        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{data.percentage}% used</span>
            <span>
              {data.nightsRemaining > 0
                ? `${data.nightsRemaining} nights remaining`
                : `Exceeded by ${Math.abs(data.nightsRemaining)} nights`}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: progressColor }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(data.percentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Last Sync */}
        {data.lastSyncAt && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <Rss className="h-3 w-3" />
            <span>Last sync: {formatDate(data.lastSyncAt, "relative")}</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className={cn("flex items-center gap-2 mt-4 pt-4 border-t")}>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onAddNight(data.propertyId)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Night
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onViewCalendar(data.propertyId)}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Calendar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onManageFeeds(data.propertyId)}
          >
            <Rss className="h-3 w-3 mr-1" />
            Feeds
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
