import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  Calendar,
  FileText,
  Hash,
  Landmark,
  RefreshCw,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { mockDocuments } from "@/lib/mock-data";
import { useRenewPermit } from "@/hooks/use-permits";
import { useProperties } from "@/hooks/use-properties";
import { PermitStatusTimeline } from "./permit-status-timeline";
import type { Permit } from "@/types";

// ─── Status Badge Config ─────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400" },
  active: { label: "Active", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400" },
  expired: { label: "Expired", className: "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400" },
  revoked: { label: "Revoked", className: "bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400" },
};

// ─── Days Remaining Helper ───────────────────────────────────────────────────

function getDaysRemaining(expiresAt: string): { days: number; label: string; color: string } {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return { days, label: "Expired", color: "text-red-600" };
  if (days < 30) return { days, label: `${days} days`, color: "text-red-600" };
  if (days < 90) return { days, label: `${days} days`, color: "text-amber-600" };
  return { days, label: `${days} days`, color: "text-emerald-600" };
}

// ─── Permit Detail Sheet ─────────────────────────────────────────────────────

interface PermitDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permit: Permit | null;
}

export function PermitDetailSheet({ open, onOpenChange, permit }: PermitDetailSheetProps) {
  const renewMutation = useRenewPermit();
  const { data: properties } = useProperties();

  if (!permit) return null;

  const property = (properties || []).find((p) => p.id === permit.propertyId);
  const linkedDocuments = mockDocuments.filter(
    (d) => d.id === permit.documentId || (d.propertyId === permit.propertyId && d.documentType === "permit")
  );
  const status = statusConfig[permit.status] ?? statusConfig.pending;
  const daysRemaining = getDaysRemaining(permit.expiresAt);

  const handleRenew = async () => {
    await renewMutation.mutateAsync(permit.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between gap-4 pr-6">
            <div className="space-y-1">
              <SheetTitle className="text-xl">{permit.permitType}</SheetTitle>
              <SheetDescription>
                {permit.permitNumber || "No permit number"}
              </SheetDescription>
            </div>
            <Badge className={cn("shrink-0", status.className)}>
              {status.label}
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
          <div className="space-y-6">
            {/* Key Info */}
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Property</p>
                  <p className="text-sm font-medium">{property?.name ?? "Unknown"}</p>
                  {property && (
                    <p className="text-xs text-muted-foreground">{property.address}, {property.city}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Permit Number</p>
                  <p className="text-sm font-medium">{permit.permitNumber || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Landmark className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Issuing Authority</p>
                  <p className="text-sm font-medium">{permit.issuingAuthority || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Issued</p>
                    <p className="text-sm font-medium">{formatDate(permit.issuedAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Expires</p>
                    <p className="text-sm font-medium">{formatDate(permit.expiresAt)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">Days Remaining</p>
                <p className={cn("text-lg font-bold", daysRemaining.color)}>
                  {daysRemaining.label}
                </p>
              </div>

              {permit.notes && (
                <div className="flex items-start gap-3">
                  <StickyNote className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm">{permit.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Linked Documents */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Linked Documents</h4>
              {linkedDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents linked to this permit.</p>
              ) : (
                <div className="space-y-2">
                  {linkedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <FileText className="h-4 w-4 text-red-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(doc.uploadedAt)} • {(doc.fileSizeBytes / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Status Timeline */}
            <PermitStatusTimeline permitId={permit.id} />

            {/* Actions */}
            <div className="pt-4">
              <Button
                onClick={handleRenew}
                disabled={renewMutation.isPending}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {renewMutation.isPending ? "Renewing..." : "Renew Permit"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
