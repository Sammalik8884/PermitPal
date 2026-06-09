import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { AuFireSafetyRecord } from "@/lib/mock-data";

interface FireSafetyChecklistProps {
  record: AuFireSafetyRecord;
  onEdit: () => void;
}

export function FireSafetyChecklist({ record, onEdit }: FireSafetyChecklistProps) {
  const statusConfig = {
    compliant: {
      label: "Compliant",
      color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    },
    action_required: {
      label: "Action Required",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    },
    overdue: {
      label: "Overdue",
      color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
      icon: <XCircle className="h-4 w-4 text-red-500" />,
    },
  };

  const config = statusConfig[record.overallStatus];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            {record.propertyName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", config.color)}>
              {config.icon}
              <span className="ml-1">{config.label}</span>
            </Badge>
            <Button variant="outline" size="sm" onClick={onEdit}>
              Update
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Checklist items */}
        <div className="space-y-3">
          <ChecklistItem
            label="Smoke Alarms Installed"
            checked={record.smokeAlarmsInstalled}
            detail={
              record.smokeAlarmsLastTested
                ? `Last tested: ${formatDate(record.smokeAlarmsLastTested)}`
                : "Not tested"
            }
          />
          <ChecklistItem
            label="Fire Extinguisher Present"
            checked={record.fireExtinguisherPresent}
            detail={
              record.fireExtinguisherExpiry
                ? `Expires: ${formatDate(record.fireExtinguisherExpiry)}`
                : "No expiry date"
            }
          />
          <ChecklistItem
            label="Evacuation Plan Displayed"
            checked={record.evacuationPlanDisplayed}
          />
        </div>

        {/* Inspection dates */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Last Inspection
            </p>
            <p className="text-sm font-medium">
              {record.lastInspectionDate
                ? formatDate(record.lastInspectionDate)
                : "Never"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Next Inspection Due
            </p>
            <p
              className={cn(
                "text-sm font-medium",
                record.nextInspectionDue &&
                  new Date(record.nextInspectionDue) < new Date() &&
                  "text-red-600 dark:text-red-400"
              )}
            >
              {record.nextInspectionDue
                ? formatDate(record.nextInspectionDue)
                : "Not scheduled"}
            </p>
          </div>
        </div>

        {/* Action items */}
        {record.actionItems.length > 0 && (
          <div className="pt-2 border-t space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Action Items
            </p>
            <div className="space-y-2">
              {record.actionItems.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2 text-sm p-2 rounded-md",
                    item.priority === "high" && "bg-red-50 dark:bg-red-950/20",
                    item.priority === "medium" && "bg-yellow-50 dark:bg-yellow-950/20",
                    item.priority === "low" && "bg-blue-50 dark:bg-blue-950/20"
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      "h-3.5 w-3.5 mt-0.5 shrink-0",
                      item.priority === "high" && "text-red-500",
                      item.priority === "medium" && "text-yellow-500",
                      item.priority === "low" && "text-blue-500"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Deadline: {formatDate(item.deadline)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChecklistItem({
  label,
  checked,
  detail,
}: {
  label: string;
  checked: boolean;
  detail?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {checked ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <span className="text-sm">{label}</span>
      </div>
      {detail && (
        <span className="text-xs text-muted-foreground">{detail}</span>
      )}
    </div>
  );
}
