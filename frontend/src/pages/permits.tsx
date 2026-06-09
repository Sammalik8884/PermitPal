import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, FileCheck, Calendar, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { usePermits, type PermitFilters } from "@/hooks/use-permits";
import { useDebounce } from "@/hooks/use-debounce";
import { useProperties } from "@/hooks/use-properties";
import { PermitFormDialog } from "./permits/components/permit-form-dialog";
import { PermitDetailSheet } from "./permits/components/permit-detail-sheet";
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

  if (days < 0) return { days, label: `${Math.abs(days)}d overdue`, color: "text-red-600" };
  if (days < 30) return { days, label: `${days}d left`, color: "text-red-600" };
  if (days < 90) return { days, label: `${days}d left`, color: "text-amber-600" };
  return { days, label: `${days}d left`, color: "text-emerald-600" };
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function PermitsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-4 flex items-center gap-4">
          <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" height="0.875rem" />
            <Skeleton variant="text" width="25%" height="0.75rem" />
          </div>
          <Skeleton variant="text" width="80px" height="1.5rem" className="rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Permits Page ────────────────────────────────────────────────────────────

function PermitsPage() {
  // Search & filters
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingPermit, setEditingPermit] = useState<Permit | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null);

  // Build filters
  const filters: PermitFilters = useMemo(() => ({
    search: debouncedSearch || undefined,
    propertyId: propertyFilter as PermitFilters["propertyId"],
    status: statusFilter as PermitFilters["status"],
    sortBy: "expiresAt",
    sortOrder: "asc",
  }), [debouncedSearch, propertyFilter, statusFilter]);

  const { data: permits, isLoading } = usePermits(filters);
  const { data: properties } = useProperties();

  // Handlers
  const handleEdit = (permit: Permit) => {
    setEditingPermit(permit);
    setFormDialogOpen(true);
  };

  const handleViewDetail = (permit: Permit) => {
    setSelectedPermit(permit);
    setDetailSheetOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setFormDialogOpen(open);
    if (!open) setEditingPermit(null);
  };

  // Stats
  const activeCount = permits?.filter((p) => p.status === "active").length ?? 0;
  const expiringCount = permits?.filter((p) => {
    const days = Math.ceil((new Date(p.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 30;
  }).length ?? 0;
  const expiredCount = permits?.filter((p) => p.status === "expired").length ?? 0;

  return (
    <>
      <PageHeader
        title="Permits"
        description="Track and manage your rental permits"
      >
        <Button onClick={() => setFormDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Permit
        </Button>
      </PageHeader>

      {/* Quick Stats */}
      {permits && permits.length > 0 && (
        <div className="grid gap-3 grid-cols-3 mb-6">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{expiringCount}</p>
            <p className="text-xs text-muted-foreground">Expiring Soon</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
            <p className="text-xs text-muted-foreground">Expired</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permits..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {properties?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <PermitsListSkeleton />
      ) : !permits || permits.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No permits found"
          description={
            debouncedSearch || propertyFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters to find what you're looking for."
              : "Add a property first, then you can track permits, their expiry dates, and renewal requirements."
          }
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {permits.map((permit) => {
              const property = properties?.find((p) => p.id === permit.propertyId);
              const status = statusConfig[permit.status] ?? statusConfig.pending;
              const daysInfo = getDaysRemaining(permit.expiresAt);

              return (
                <motion.div
                  key={permit.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="group rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
                  onClick={() => handleViewDetail(permit)}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      {permit.status === "expired" ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : (
                        <FileCheck className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{permit.permitType}</p>
                        <Badge className={cn("shrink-0 text-[10px] px-1.5 py-0", status.className)}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground truncate">
                          {property?.name ?? "Unknown"} • {permit.permitNumber || "No number"}
                        </p>
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="hidden sm:flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(permit.expiresAt)}
                        </span>
                      </div>
                      <span className={cn("text-xs font-medium mt-0.5", daysInfo.color)}>
                        {daysInfo.label}
                      </span>
                    </div>

                    {/* Edit button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(permit);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {/* Dialogs */}
      <PermitFormDialog
        open={formDialogOpen}
        onOpenChange={handleFormClose}
        permit={editingPermit}
      />
      <PermitDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        permit={selectedPermit}
      />
    </>
  );
}

export default PermitsPage;
