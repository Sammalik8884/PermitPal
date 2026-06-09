import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { mockJurisdictions } from "@/lib/mock-data";
import type { RegulatoryChange } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RegulatoryChangeCardProps {
  change: RegulatoryChange;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSeverityVariant(severity: string): "destructive" | "warning" | "info" | "secondary" {
  switch (severity) {
    case "high":
    case "critical":
      return "destructive";
    case "medium":
      return "warning";
    case "low":
      return "info";
    default:
      return "secondary";
  }
}

function getJurisdictionInfo(jurisdictionId: string) {
  const jur = mockJurisdictions.find((j) => j.id === jurisdictionId);
  if (!jur) return { name: "Unknown", flag: "🏳️" };

  const flags: Record<string, string> = {
    US: "🇺🇸",
    FR: "🇫🇷",
    AU: "🇦🇺",
    CH: "🇨🇭",
    ES: "🇪🇸",
  };

  return { name: jur.name, flag: flags[jur.countryCode] ?? "🏳️" };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RegulatoryChangeCard({ change }: RegulatoryChangeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const jurisdiction = getJurisdictionInfo(change.jurisdictionId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="border rounded-lg overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          {/* Severity badge */}
          <Badge variant={getSeverityVariant(change.severity)} size="sm" className="mt-0.5 capitalize">
            {change.severity}
          </Badge>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{jurisdiction.flag}</span>
              <span className="text-xs text-muted-foreground font-medium">
                {jurisdiction.name}
              </span>
            </div>
            <h4 className="text-sm font-semibold">{change.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Effective: {formatDate(change.effectiveDate, "long")}
            </p>
          </div>

          {/* Expand toggle */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t">
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {change.summary}
              </p>
              {change.detailUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-2"
                  asChild
                >
                  <a href={change.detailUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Official Source
                  </a>
                </Button>
              )}
              {change.isAcknowledged && (
                <p className="text-xs text-muted-foreground mt-2">
                  ✓ Acknowledged on {formatDate(change.acknowledgedAt!, "short")}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
