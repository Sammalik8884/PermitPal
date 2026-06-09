import { motion } from "framer-motion";
import { Moon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { NightCapSummary, Property } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getBarColor(percentage: number): string {
  if (percentage >= 100) return "bg-red-500";
  if (percentage >= 80) return "bg-amber-500";
  return "bg-emerald-500";
}

function getBarBgColor(percentage: number): string {
  if (percentage >= 100) return "bg-red-100 dark:bg-red-950/30";
  if (percentage >= 80) return "bg-amber-100 dark:bg-amber-950/30";
  return "bg-emerald-100 dark:bg-emerald-950/30";
}

function getTextColor(percentage: number): string {
  if (percentage >= 100) return "text-red-600 dark:text-red-400";
  if (percentage >= 80) return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}

// ─── Loading State ───────────────────────────────────────────────────────────

function NightCapBarsSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" height="1.25rem" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" width="30%" height="0.875rem" />
              <Skeleton variant="text" width="10%" height="0.875rem" />
            </div>
            <Skeleton variant="rectangular" height="0.5rem" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface NightCapBarsProps {
  nightCaps: NightCapSummary[];
  properties: Property[];
  isLoading?: boolean;
}

export function NightCapBars({ nightCaps, properties, isLoading }: NightCapBarsProps) {
  if (isLoading) return <NightCapBarsSkeleton />;

  // Sort by percentage (highest first)
  const sortedCaps = [...nightCaps].sort((a, b) => b.percentage - a.percentage);

  // Map property names
  const propertyMap = new Map(properties.map((p) => [p.id, p.name]));

  if (sortedCaps.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="h-4 w-4 text-muted-foreground" />
            Night Cap Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Moon className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              No night cap data available
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
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              Night Cap Usage
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {new Date().getFullYear()} Annual Usage
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCaps.map((cap, index) => {
              const propertyName = propertyMap.get(cap.propertyId) ?? "Unknown Property";
              const displayPercentage = Math.min(cap.percentage, 100);

              return (
                <motion.div
                  key={cap.propertyId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 * index }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate max-w-[60%]">
                      {propertyName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {cap.nightsUsed}/{cap.nightCap}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold tabular-nums min-w-[3rem] text-right",
                          getTextColor(cap.percentage)
                        )}
                      >
                        {cap.percentage}%
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "h-2 w-full rounded-full overflow-hidden",
                      getBarBgColor(cap.percentage)
                    )}
                  >
                    <motion.div
                      className={cn("h-full rounded-full", getBarColor(cap.percentage))}
                      initial={{ width: 0 }}
                      animate={{ width: `${displayPercentage}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.1 * index,
                        ease: "easeOut",
                      }}
                    />
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
