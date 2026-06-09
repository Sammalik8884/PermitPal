import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ComplianceScoreCircle } from "./property-card";
import type { ComplianceBreakdown as ComplianceBreakdownType, ComplianceStatus } from "@/types";

// ─── Status Icon ─────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: ComplianceStatus }) {
  if (status === "compliant") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  if (status === "non_compliant") return <XCircle className="h-4 w-4 text-red-500" />;
  return <AlertTriangle className="h-4 w-4 text-gray-400" />;
}

// ─── Compliance Breakdown Component ──────────────────────────────────────────

interface ComplianceBreakdownProps {
  data: ComplianceBreakdownType;
}

export function ComplianceBreakdown({ data }: ComplianceBreakdownProps) {
  const getProgressColor = (earned: number, max: number) => {
    const pct = (earned / max) * 100;
    if (pct > 66) return "bg-green-500";
    if (pct > 33) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Overall Score */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Compliance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <ComplianceScoreCircle score={data.totalScore} size="lg" />
            <div className="flex-1">
              <p className="text-2xl font-bold">{data.totalScore}<span className="text-sm font-normal text-muted-foreground">/100</span></p>
              <p className="text-sm text-muted-foreground mt-1">
                {data.totalScore >= 90 ? "Excellent compliance" :
                 data.totalScore >= 70 ? "Good compliance — minor actions needed" :
                 data.totalScore >= 50 ? "Needs attention — action required" :
                 "Critical — immediate action required"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.components.map((component, index) => (
            <motion.div
              key={component.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon status={component.status} />
                  <span className="text-sm font-medium">{component.name}</span>
                </div>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {component.earnedPoints}/{component.maxPoints} pts
                </span>
              </div>
              <Progress
                value={(component.earnedPoints / component.maxPoints) * 100}
                size="sm"
                indicatorClassName={getProgressColor(component.earnedPoints, component.maxPoints)}
              />
              <p className="text-xs text-muted-foreground">{component.description}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={cn(
                    "flex items-start gap-2 text-sm p-2 rounded-md",
                    rec.startsWith("CRITICAL") || rec.startsWith("URGENT")
                      ? "bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300"
                      : "bg-muted/50"
                  )}
                >
                  <span className="shrink-0 mt-0.5">•</span>
                  <span>{rec}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
