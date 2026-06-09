import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLogComplaint, useUpdateComplaint } from "@/hooks/use-au-compliance";
import type { AuComplaint } from "@/lib/mock-data";

// ─── Log New Complaint Dialog ────────────────────────────────────────────────

interface LogComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: { id: string; name: string }[];
}

export function LogComplaintDialog({
  open,
  onOpenChange,
  properties,
}: LogComplaintDialogProps) {
  const [propertyId, setPropertyId] = useState("");
  const [type, setType] = useState<"noise" | "parking" | "waste" | "other">("noise");
  const [description, setDescription] = useState("");

  const logComplaint = useLogComplaint();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !description) return;

    const property = properties.find((p) => p.id === propertyId);

    logComplaint.mutate(
      {
        propertyId,
        propertyName: property?.name ?? "Unknown",
        type,
        description,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setPropertyId("");
          setType("noise");
          setDescription("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Complaint</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Property</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Complaint Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noise">Noise</SelectItem>
                <SelectItem value="parking">Parking</SelectItem>
                <SelectItem value="waste">Waste</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="complaint-desc">Description</Label>
            <Textarea
              id="complaint-desc"
              placeholder="Describe the complaint..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={logComplaint.isPending}>
              {logComplaint.isPending ? "Logging..." : "Log Complaint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Update Complaint Dialog ─────────────────────────────────────────────────

interface UpdateComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: AuComplaint | null;
}

export function UpdateComplaintDialog({
  open,
  onOpenChange,
  complaint,
}: UpdateComplaintDialogProps) {
  const [status, setStatus] = useState<AuComplaint["status"]>(complaint?.status ?? "open");
  const [resolution, setResolution] = useState(complaint?.resolution ?? "");

  const updateComplaint = useUpdateComplaint();

  useEffect(() => {
    if (complaint && open) {
      setStatus(complaint.status);
      setResolution(complaint.resolution ?? "");
    }
  }, [complaint, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    updateComplaint.mutate(
      {
        complaintId: complaint.id,
        status,
        resolution: resolution || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Complaint</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
            <p className="font-medium text-foreground">{complaint.propertyName}</p>
            <p className="mt-1">{complaint.description}</p>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AuComplaint["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(status === "resolved" || status === "dismissed") && (
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Textarea
                id="resolution"
                placeholder="Describe how this was resolved..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={3}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateComplaint.isPending}>
              {updateComplaint.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
