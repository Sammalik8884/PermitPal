import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { PropertyAtRisk } from "@/hooks/use-dashboard-data";

// ─── Loading State ───────────────────────────────────────────────────────────

function PropertiesAtRiskSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Skeleton variant="text" width="50%" height="1.25rem" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="space-y-2 flex-1">
              <Skeleton variant="text" width="60%" height="0.875rem" />
              <Skeleton variant="text" width="30%" height="0.75rem" />
            </div>
            <Skeleton variant="text" width="4rem" height="1.5rem" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface PropertiesAtRiskProps {
  data: PropertyAtRisk[];
  isLoading?: boolean;
}

export function PropertiesAtRisk({ data, isLoading }: PropertiesAtRiskProps) {
  if (isLoading) return <PropertiesAtRiskSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Properties at Risk
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {data.length} {data.length === 1 ? "issue" : "issues"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="flex items-center gap-3 py-6 text-center justify-center">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <p className="text-sm text-muted-foreground">
                All properties are in good standing ✓
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {data.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Link
                    to={`/properties/${item.id}`}
                    className={cn(
                      "flex items-center justify-between py-3 px-3 rounded-lg",
                      "hover:bg-muted/50 transition-colors group"
                    )}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {item.propertyName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <Badge
                        variant={item.severity === "high" ? "destructive" : "warning"}
                        size="sm"
                      >
                        {item.issue}
                      </Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
