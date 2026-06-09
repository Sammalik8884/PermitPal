import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { createPermitSchema, type CreatePermitFormData } from "@/lib/validations/permit";
import { useCreatePermit, useUpdatePermit } from "@/hooks/use-permits";
import { useProperties } from "@/hooks/use-properties";
import type { Permit } from "@/types";

// ─── Permit Form Dialog ──────────────────────────────────────────────────────

interface PermitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permit?: Permit | null;
  defaultPropertyId?: string;
}

export function PermitFormDialog({ open, onOpenChange, permit, defaultPropertyId }: PermitFormDialogProps) {
  const isEditing = !!permit;
  const createMutation = useCreatePermit();
  const updateMutation = useUpdatePermit();
  const { data: properties } = useProperties();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePermitFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPermitSchema) as any,
    defaultValues: {
      propertyId: "",
      permitType: "",
      permitNumber: "",
      status: "pending",
      issuedAt: "",
      expiresAt: "",
      issuingAuthority: "",
      notes: "",
    },
  });

  const watchedPropertyId = watch("propertyId");
  const watchedStatus = watch("status");

  // Reset form when dialog opens/closes or permit changes
  useEffect(() => {
    if (open && permit) {
      reset({
        propertyId: permit.propertyId,
        permitType: permit.permitType,
        permitNumber: permit.permitNumber || "",
        status: permit.status as CreatePermitFormData["status"],
        issuedAt: permit.issuedAt.split("T")[0],
        expiresAt: permit.expiresAt.split("T")[0],
        issuingAuthority: permit.issuingAuthority || "",
        notes: permit.notes || "",
      });
    } else if (open && !permit) {
      reset({
        propertyId: defaultPropertyId || "",
        permitType: "",
        permitNumber: "",
        status: "pending",
        issuedAt: "",
        expiresAt: "",
        issuingAuthority: "",
        notes: "",
      });
    }
  }, [open, permit, reset, defaultPropertyId]);

  const onSubmit: SubmitHandler<CreatePermitFormData> = async (data) => {
    try {
      if (isEditing && permit) {
        await updateMutation.mutateAsync({ id: permit.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Permit" : "Add Permit"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this permit."
              : "Add a new permit to track for your property."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Select */}
          <div className="space-y-2">
            <Label htmlFor="propertyId">Property *</Label>
            <Select
              value={watchedPropertyId}
              onValueChange={(value) => setValue("propertyId", value, { shouldValidate: true })}
            >
              <SelectTrigger id="propertyId" aria-invalid={!!errors.propertyId}>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && (
              <p className="text-xs text-destructive">{errors.propertyId.message}</p>
            )}
          </div>

          {/* Permit Type & Number */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="permitType">Permit Type *</Label>
              <Input
                id="permitType"
                placeholder="e.g., Short-Term Rental Permit"
                {...register("permitType")}
                aria-invalid={!!errors.permitType}
              />
              {errors.permitType && (
                <p className="text-xs text-destructive">{errors.permitType.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="permitNumber">Permit Number</Label>
              <Input
                id="permitNumber"
                placeholder="Optional"
                {...register("permitNumber")}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={watchedStatus}
              onValueChange={(value) => setValue("status", value as CreatePermitFormData["status"], { shouldValidate: true })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="issuedAt">Issued Date *</Label>
              <Input
                id="issuedAt"
                type="date"
                {...register("issuedAt")}
                aria-invalid={!!errors.issuedAt}
              />
              {errors.issuedAt && (
                <p className="text-xs text-destructive">{errors.issuedAt.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date *</Label>
              <Input
                id="expiresAt"
                type="date"
                {...register("expiresAt")}
                aria-invalid={!!errors.expiresAt}
              />
              {errors.expiresAt && (
                <p className="text-xs text-destructive">{errors.expiresAt.message}</p>
              )}
            </div>
          </div>

          {/* Issuing Authority */}
          <div className="space-y-2">
            <Label htmlFor="issuingAuthority">Issuing Authority</Label>
            <Input
              id="issuingAuthority"
              placeholder="e.g., City of Los Angeles"
              {...register("issuingAuthority")}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this permit..."
              {...register("notes")}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
              {isEditing ? "Save Changes" : "Create Permit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
