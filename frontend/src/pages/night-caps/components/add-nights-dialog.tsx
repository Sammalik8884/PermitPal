import { useState } from "react";
import { format } from "date-fns";
import { CalendarPlus, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useAddManualNights } from "@/hooks/use-night-caps";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AddNightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyName: string;
  initialDate?: string;
}

// ─── Add Nights Dialog ───────────────────────────────────────────────────────

export function AddNightsDialog({
  open,
  onOpenChange,
  propertyId,
  propertyName,
  initialDate,
}: AddNightsDialogProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>(
    initialDate ? [initialDate] : []
  );
  const [dateInput, setDateInput] = useState(initialDate ?? "");
  const [guestName, setGuestName] = useState("");
  const [notes, setNotes] = useState("");

  const addManualNights = useAddManualNights();

  function handleAddDate() {
    if (dateInput && !selectedDates.includes(dateInput)) {
      setSelectedDates([...selectedDates, dateInput].sort());
      setDateInput("");
    }
  }

  function handleRemoveDate(date: string) {
    setSelectedDates(selectedDates.filter((d) => d !== date));
  }

  function handleSubmit() {
    if (selectedDates.length === 0) return;

    addManualNights.mutate(
      {
        propertyId,
        dates: selectedDates,
        guestName: guestName || undefined,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setSelectedDates([]);
          setGuestName("");
          setNotes("");
          onOpenChange(false);
        },
      }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDate();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            Add Manual Nights
          </DialogTitle>
          <DialogDescription>
            Add manually tracked nights for {propertyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date-input">Select Dates</Label>
            <div className="flex gap-2">
              <Input
                id="date-input"
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddDate}
                disabled={!dateInput}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Selected Dates */}
          {selectedDates.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Dates ({selectedDates.length})</Label>
              <div className="flex flex-wrap gap-1.5">
                {selectedDates.map((date) => (
                  <Badge
                    key={date}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {format(new Date(date + "T00:00:00"), "MMM d, yyyy")}
                    <button
                      type="button"
                      onClick={() => handleRemoveDate(date)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Guest Name */}
          <div className="space-y-2">
            <Label htmlFor="guest-name">Guest Name (optional)</Label>
            <Input
              id="guest-name"
              placeholder="e.g., John Smith"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedDates.length === 0 || addManualNights.isPending}
          >
            {addManualNights.isPending
              ? "Adding..."
              : `Add ${selectedDates.length} Night${selectedDates.length !== 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
