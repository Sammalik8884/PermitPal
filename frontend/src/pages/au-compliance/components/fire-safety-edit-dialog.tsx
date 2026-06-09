import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateFireSafety } from "@/hooks/use-au-compliance";
import type { AuFireSafetyRecord } from "@/lib/mock-data";

interface FireSafetyEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AuFireSafetyRecord;
}

export function FireSafetyEditDialog({
  open,
  onOpenChange,
  record,
}: FireSafetyEditDialogProps) {
  const [smokeAlarms, setSmokeAlarms] = useState(record.smokeAlarmsInstalled);
  const [smokeAlarmsDate, setSmokeAlarmsDate] = useState(
    record.smokeAlarmsLastTested?.split("T")[0] ?? ""
  );
  const [fireExtinguisher, setFireExtinguisher] = useState(record.fireExtinguisherPresent);
  const [extinguisherExpiry, setExtinguisherExpiry] = useState(
    record.fireExtinguisherExpiry?.split("T")[0] ?? ""
  );
  const [evacuationPlan, setEvacuationPlan] = useState(record.evacuationPlanDisplayed);
  const [lastInspection, setLastInspection] = useState(
    record.lastInspectionDate?.split("T")[0] ?? ""
  );
  const [nextInspection, setNextInspection] = useState(
    record.nextInspectionDue?.split("T")[0] ?? ""
  );

  const updateFireSafety = useUpdateFireSafety();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateFireSafety.mutate(
      {
        propertyId: record.propertyId,
        smokeAlarmsInstalled: smokeAlarms,
        smokeAlarmsLastTested: smokeAlarmsDate ? new Date(smokeAlarmsDate).toISOString() : null,
        fireExtinguisherPresent: fireExtinguisher,
        fireExtinguisherExpiry: extinguisherExpiry ? new Date(extinguisherExpiry).toISOString() : null,
        evacuationPlanDisplayed: evacuationPlan,
        lastInspectionDate: lastInspection ? new Date(lastInspection).toISOString() : null,
        nextInspectionDue: nextInspection ? new Date(nextInspection).toISOString() : null,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Fire Safety — {record.propertyName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="smoke-alarms">Smoke Alarms Installed</Label>
            <Switch
              id="smoke-alarms"
              checked={smokeAlarms}
              onCheckedChange={setSmokeAlarms}
            />
          </div>
          {smokeAlarms && (
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <Label htmlFor="smoke-date">Last Tested Date</Label>
              <Input
                id="smoke-date"
                type="date"
                value={smokeAlarmsDate}
                onChange={(e) => setSmokeAlarmsDate(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="fire-ext">Fire Extinguisher Present</Label>
            <Switch
              id="fire-ext"
              checked={fireExtinguisher}
              onCheckedChange={setFireExtinguisher}
            />
          </div>
          {fireExtinguisher && (
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <Label htmlFor="ext-expiry">Expiry Date</Label>
              <Input
                id="ext-expiry"
                type="date"
                value={extinguisherExpiry}
                onChange={(e) => setExtinguisherExpiry(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="evac-plan">Evacuation Plan Displayed</Label>
            <Switch
              id="evac-plan"
              checked={evacuationPlan}
              onCheckedChange={setEvacuationPlan}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="last-inspection">Last Inspection</Label>
              <Input
                id="last-inspection"
                type="date"
                value={lastInspection}
                onChange={(e) => setLastInspection(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-inspection">Next Inspection Due</Label>
              <Input
                id="next-inspection"
                type="date"
                value={nextInspection}
                onChange={(e) => setNextInspection(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateFireSafety.isPending}>
              {updateFireSafety.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
