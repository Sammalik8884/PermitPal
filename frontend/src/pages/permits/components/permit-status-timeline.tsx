import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { usePermitStatusHistory } from "@/hooks/use-permits";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// ─── Status Colors ───────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  pending: "bg-amber-500",
  active: "bg-emerald-500",
  expired: "bg-red-500",
  revoked: "bg-slate-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  expired: "Expired",
  revoked: "Revoked",
};

// ─── Permit Status Timeline ──────────────────────────────────────────────────

interface PermitStatusTimelineProps {
  permitId: string;
}

export function PermitStatusTimeline({ permitId }: PermitStatusTimelineProps) {
  const { data: history, isLoading } = usePermitStatusHistory(permitId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No status history available.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Status History</h4>
      <ol className="relative border-l border-border ml-3">
        {history.map((entry) => (
          <li key={entry.id} className="mb-6 ml-6">
            {/* Timeline dot */}
            <span
              className={cn(
                "absolute -left-[7px] flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-background",
                statusColors[entry.toStatus] ?? "bg-gray-400"
              )}
            />

            {/* Content */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                {entry.fromStatus && (
                  <>
                    <span className="text-xs font-medium text-muted-foreground">
                      {statusLabels[entry.fromStatus] ?? entry.fromStatus}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </>
                )}
                <span className="text-sm font-semibold">
                  {statusLabels[entry.toStatus] ?? entry.toStatus}
                </span>
              </div>

              {entry.note && (
                <p className="text-sm text-muted-foreground">{entry.note}</p>
              )}

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDate(entry.changedAt, "long")}</span>
                <span className="text-muted-foreground/60">•</span>
                <span>{entry.changedBy}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
