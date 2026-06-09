import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertTriangle } from "lucide-react";
import { useDeleteProperty } from "@/hooks/use-properties";
import type { Property } from "@/types";

// ─── Delete Property Dialog ──────────────────────────────────────────────────

interface DeletePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onSuccess?: () => void;
}

export function DeletePropertyDialog({ open, onOpenChange, property, onSuccess }: DeletePropertyDialogProps) {
  const deleteMutation = useDeleteProperty();

  const handleDelete = async () => {
    if (!property) return;
    try {
      await deleteMutation.mutateAsync(property.id);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Delete Property</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{property?.name}</span>?
            All associated permits, documents, and night cap records will be permanently removed.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <LoadingSpinner size="sm" className="mr-2" />}
            Delete Property
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
