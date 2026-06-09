import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ComplianceHistoryPoint } from "@/lib/mock-data";

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  value: number;
  payload: ComplianceHistoryPoint;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground mt-1">
        Score:{" "}
        <span className="font-semibold text-primary">
          {payload[0].value}%
        </span>
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {payload[0].payload.properties} properties tracked
      </p>
    </div>
  );
}

// ─── Loading State ───────────────────────────────────────────────────────────

function ComplianceChartSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="40%" height="1.25rem" />
          <Skeleton variant="text" width="20%" height="1rem" />
        </div>
        <Skeleton variant="rectangular" height="16rem" />
      </div>
    </Card>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ComplianceChartProps {
  data: ComplianceHistoryPoint[];
  isLoading?: boolean;
}

export function ComplianceChart({ data, isLoading }: ComplianceChartProps) {
  if (isLoading) return <ComplianceChartSkeleton />;

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <TrendingUp className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            Compliance data will appear here once properties are tracked.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Compliance Overview</CardTitle>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value: number) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="url(#complianceGradient)"
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
