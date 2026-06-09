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
import { useRecordLevyPayment } from "@/hooks/use-au-compliance";

interface LevyPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
}

export function LevyPaymentDialog({
  open,
  onOpenChange,
  propertyId,
}: LevyPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");

  const recordPayment = useRecordLevyPayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !reference) return;

    recordPayment.mutate(
      {
        propertyId,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        reference,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setAmount("");
          setDate(new Date().toISOString().split("T")[0]);
          setReference("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Levy Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Amount (AUD)</Label>
            <Input
              id="payment-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-date">Payment Date</Label>
            <Input
              id="payment-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-reference">Reference</Label>
            <Input
              id="payment-reference"
              placeholder="e.g., LEV-NSW-2026-Q2"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
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
            <Button type="submit" disabled={recordPayment.isPending}>
              {recordPayment.isPending ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
