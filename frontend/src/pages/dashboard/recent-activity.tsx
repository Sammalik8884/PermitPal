import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  FileCheck,
  CalendarSync,
  Scale,
  ShieldAlert,
  Moon,
  Building2,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { ActivityItem } from "@/hooks/use-dashboard-data";
import type { LucideIcon } from "lucide-react";

// ─── Activity Type Config ────────────────────────────────────────────────────

const activityTypeConfig: Record<
  string,
  { icon: LucideIcon; bg: string; iconColor: string }
> = {
  permit: {
    icon: FileCheck,
    bg: "#f0f4ff",
    iconColor: "#2a4db3",
  },
  ical_sync: {
    icon: CalendarSync,
    bg: "#f0faf4",
    iconColor: "#1a7a40",
  },
  regulatory: {
    icon: Scale,
    bg: "#fff8e6",
    iconColor: "#8a5c00",
  },
  compliance: {
    icon: ShieldAlert,
    bg: "#f5f0ff",
    iconColor: "#7c3aed",
  },
  night_cap: {
    icon: Moon,
    bg: "#fff4ec",
    iconColor: "#b34a00",
  },
  property: {
    icon: Building2,
    bg: "#f0f4ff",
    iconColor: "#3b5bdb",
  },
  document: {
    icon: FileText,
    bg: "#edfcf9",
    iconColor: "#0d7a62",
  },
};

// ─── Loading State ───────────────────────────────────────────────────────────

function RecentActivitySkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="40%" height="1.25rem" />
          <Skeleton variant="text" width="15%" height="0.875rem" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-2">
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="80%" height="0.875rem" />
              <Skeleton variant="text" width="25%" height="0.75rem" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface RecentActivityProps {
  data: ActivityItem[];
  isLoading?: boolean;
}

export function RecentActivity({ data, isLoading }: RecentActivityProps) {
  if (isLoading) return <RecentActivitySkeleton />;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              No recent activity to display
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
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontSize: "16px", fontWeight: 600, color: "#222222", display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity style={{ width: "16px", height: "16px", color: "#929292" }} />
              Recent Activity
            </CardTitle>
            <a
              href="/alerts"
              style={{ fontSize: "14px", fontWeight: 500, color: "#ff385c", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              View all
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {data.slice(0, 8).map((item, index) => {
              // Determine type based on action string (AuditLog actions)
              let typeKey = "permit";
              if (item.action.toLowerCase().includes("user") || item.action.toLowerCase().includes("org")) typeKey = "property";
              if (item.action.toLowerCase().includes("document")) typeKey = "document";
              if (item.action.toLowerCase().includes("property")) typeKey = "property";
              
              const config = activityTypeConfig[typeKey] || { icon: Activity, bg: "#f7f7f7", iconColor: "#6a6a6a" };
              const Icon = config.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.06 * index }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px 8px",
                    borderRadius: "8px",
                    transition: "background-color 0.15s ease",
                    borderBottom: index < Math.min(data.length, 8) - 1 ? "1px solid #ebebeb" : "none",
                  }}
                  className="hover:bg-[#f7f7f7]"
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "9999px",
                      backgroundColor: config.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: "16px", height: "16px", color: config.iconColor }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", color: "#222222", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.action}
                    </p>
                    <p style={{ fontSize: "13px", color: "#929292", marginTop: "3px" }}>
                      {formatDate(item.date, "relative")}
                    </p>
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
