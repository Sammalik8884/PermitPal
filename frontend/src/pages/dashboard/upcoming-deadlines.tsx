import { motion } from "framer-motion";
import { Clock, FileText, RotateCcw, DollarSign, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import type { UpcomingDeadline } from "@/hooks/use-dashboard-data";
import type { LucideIcon } from "lucide-react";

// ─── Deadline Type Config ─────────────────────────────────────────────────────

const deadlineTypeConfig: Record<
  string,
  { icon: LucideIcon; bg: string; iconColor: string; label: string }
> = {
  "permit_renewal": {
    icon: FileText,
    bg: "#f0f4ff",
    iconColor: "#2a4db3",
    label: "Permit Renewal",
  },
  "night_cap_reset": {
    icon: RotateCcw,
    bg: "#f5f0ff",
    iconColor: "#7c3aed",
    label: "Night Cap Reset",
  },
  "levy_due": {
    icon: DollarSign,
    bg: "#fff8e6",
    iconColor: "#8a5c00",
    label: "Levy Due",
  },
  "registration": {
    icon: ClipboardList,
    bg: "#f0faf4",
    iconColor: "#1a7a40",
    label: "Registration",
  },
};

function getDaysUrgency(days: number): { bg: string; color: string } {
  if (days < 7)  return { bg: "#fff0ef", color: "#c13515" };
  if (days < 30) return { bg: "#fff8e6", color: "#8a5c00" };
  return { bg: "#f0faf4", color: "#1a7a40" };
}

// ─── Loading State ────────────────────────────────────────────────────────────

function UpcomingDeadlinesSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton variant="text" width="50%" height="1.25rem" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="65%" height="0.875rem" />
                <Skeleton variant="text" width="45%" height="0.75rem" />
              </div>
              <Skeleton variant="text" width={36} height={22} className="rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface UpcomingDeadlinesProps {
  data: UpcomingDeadline[];
  isLoading?: boolean;
}

export function UpcomingDeadlines({ data, isLoading }: UpcomingDeadlinesProps) {
  if (isLoading) return <UpcomingDeadlinesSkeleton />;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle
            style={{ fontSize: "16px", fontWeight: 600, color: "#222222", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Clock style={{ width: "16px", height: "16px", color: "#929292" }} />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 0",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "9999px",
                backgroundColor: "#f7f7f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <Clock style={{ width: "22px", height: "22px", color: "#929292" }} />
            </div>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#222222", marginBottom: "4px" }}>
              All clear
            </p>
            <p style={{ fontSize: "14px", color: "#6a6a6a" }}>
              No upcoming deadlines
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle
            style={{ fontSize: "16px", fontWeight: 600, color: "#222222", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Clock style={{ width: "16px", height: "16px", color: "#929292" }} />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {data.slice(0, 5).map((deadline, index) => {
              const config = deadlineTypeConfig[deadline.deadlineType] || {
                icon: FileText,
                bg: "#f7f7f7",
                iconColor: "#6a6a6a",
                label: deadline.deadlineType,
              };
              const Icon = config.icon;
              const urgency = getDaysUrgency(deadline.daysRemaining);

              return (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 * index }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "12px 8px",
                    borderRadius: "8px",
                    transition: "background-color 0.15s ease",
                    cursor: "default",
                    borderBottom: index < Math.min(data.length, 5) - 1 ? "1px solid #ebebeb" : "none",
                  }}
                  className="hover:bg-[#f7f7f7]"
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "9999px",
                      backgroundColor: config.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: "18px", height: "18px", color: config.iconColor }} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "#222222", lineHeight: "1.3", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {config.label !== deadline.deadlineType ? config.label : deadline.deadlineType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </p>
                    <p style={{ fontSize: "13px", color: "#6a6a6a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {deadline.propertyName}
                    </p>
                    <p style={{ fontSize: "13px", color: "#929292", marginTop: "1px" }}>
                      {format(new Date(deadline.date), "MMM d, yyyy")}
                    </p>
                  </div>

                  {/* Days badge */}
                  <div
                    style={{
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      backgroundColor: urgency.bg,
                      color: urgency.color,
                      fontSize: "13px",
                      fontWeight: 600,
                      lineHeight: "1",
                      marginTop: "2px",
                    }}
                  >
                    {deadline.daysRemaining}d
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
