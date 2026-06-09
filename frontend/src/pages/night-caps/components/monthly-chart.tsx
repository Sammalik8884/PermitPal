import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { MonthlyBreakdown } from "@/lib/mock-data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MonthlyChartProps {
  data: MonthlyBreakdown["months"];
  nightCap: number;
  propertyName: string;
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{payload[0].value}</span> nights booked
        </p>
      </div>
    );
  }
  return null;
}

// ─── Monthly Chart ───────────────────────────────────────────────────────────

export function MonthlyChart({ data, nightCap, propertyName }: MonthlyChartProps) {
  const monthlyAverage = Math.round(nightCap / 12);

  const chartData = data.map((m) => ({
    name: m.monthName,
    nights: m.nightsBooked,
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold">{propertyName} — Monthly Breakdown</h4>
          <p className="text-xs text-muted-foreground">
            Monthly average cap: {monthlyAverage} nights/month
          </p>
        </div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={monthlyAverage}
              stroke="hsl(var(--destructive))"
              strokeDasharray="4 4"
              label={{
                value: `Avg cap (${monthlyAverage})`,
                position: "insideTopRight",
                fontSize: 11,
                fill: "hsl(var(--destructive))",
              }}
            />
            <Bar
              dataKey="nights"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
