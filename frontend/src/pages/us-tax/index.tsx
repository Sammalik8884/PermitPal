import { useState } from "react";
import { Receipt, Plus, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAllUsTaxSummaries, useUsTaxHistory, useRecordTaxPayment } from "@/hooks/use-us-tax";
import { useProperties } from "@/hooks/use-properties";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { CalendarIcon, DollarSignIcon, BuildingIcon, FileTextIcon } from "lucide-react";

// ─── Tax Status Config ────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  paid:    { label: "Paid",    variant: "success" },
  partial: { label: "Partial", variant: "warning" },
  unpaid:  { label: "Unpaid",  variant: "destructive" },
  unknown: { label: "Unknown", variant: "secondary" },
};

// ─── Summary Item ─────────────────────────────────────────────────────────────

function SummaryItem({
  label,
  value,
  icon,
  iconBg = "#fff0f2",
  iconColor = "#ff385c",
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="airbnb-hover"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #dddddd",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "9999px",
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "#6a6a6a", lineHeight: "1.29" }}>
          {label}
        </p>
      </div>
      <p
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: highlight ? "#c13515" : "#222222",
          lineHeight: "1.43",
          letterSpacing: "0",
        }}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Tax Payment Dialog ───────────────────────────────────────────────────────

function TaxPaymentDialog({
  open,
  onOpenChange,
  initialPropertyId,
  properties,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPropertyId: string;
  properties: { id: string; name: string }[];
}) {
  const [propertyId, setPropertyId] = useState(initialPropertyId);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");

  const recordPayment = useRecordTaxPayment();

  if (open && initialPropertyId !== propertyId && !amount && !reference) {
    setPropertyId(initialPropertyId);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !amount || !date || !reference) return;
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
      <DialogContent
        style={{
          maxWidth: "500px",
          padding: 0,
          border: "1px solid #dddddd",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0",
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px 24px 0" }}>
          <DialogTitle style={{ fontSize: "22px", fontWeight: 700, color: "#222222", lineHeight: "1.43" }}>
            Record Tax Payment
          </DialogTitle>
          <p style={{ fontSize: "14px", color: "#6a6a6a", marginTop: "4px", lineHeight: "1.43" }}>
            Log a new US lodging tax payment to the municipal authority.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Property */}
          <div>
            <Label
              htmlFor="tax-property"
              style={{ fontSize: "14px", fontWeight: 500, color: "#6a6a6a", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}
            >
              <BuildingIcon className="h-3.5 w-3.5" /> Property
            </Label>
            <Select value={propertyId} onValueChange={setPropertyId} required>
              <SelectTrigger id="tax-property" style={{ height: "56px", borderRadius: "8px", border: "1px solid #dddddd", fontSize: "16px" }}>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount & Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <Label htmlFor="tax-amount" style={{ fontSize: "14px", fontWeight: 500, color: "#6a6a6a", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <DollarSignIcon className="h-3.5 w-3.5" /> Amount (USD)
              </Label>
              <Input
                id="tax-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                inputSize="default"
                prefix={<span style={{ fontSize: "16px", color: "#6a6a6a", paddingLeft: "4px" }}>$</span>}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="tax-date" style={{ fontSize: "14px", fontWeight: 500, color: "#6a6a6a", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <CalendarIcon className="h-3.5 w-3.5" /> Payment Date
              </Label>
              <input
                id="tax-date"
                type="date"
                style={{
                  height: "56px",
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #dddddd",
                  backgroundColor: "#ffffff",
                  padding: "14px 12px",
                  fontSize: "16px",
                  color: "#222222",
                  outline: "none",
                }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Reference */}
          <div>
            <Label htmlFor="tax-reference" style={{ fontSize: "14px", fontWeight: 500, color: "#6a6a6a", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <FileTextIcon className="h-3.5 w-3.5" /> Receipt Reference
            </Label>
            <Input
              id="tax-reference"
              placeholder="e.g., TOT-LA-2026-Q2-CONFIRMATION"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
            />
            <p style={{ fontSize: "12px", color: "#929292", marginTop: "6px" }}>
              Keep the reference number from your municipal tax portal.
            </p>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
              borderTop: "1px solid #ebebeb",
              paddingTop: "16px",
            }}
          >
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={recordPayment.isPending}>
              Record Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── US Tax Page ──────────────────────────────────────────────────────────────

function UsTaxPage() {
  const [selectedYear] = useState(2026);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const { data: allProperties, isLoading: propertiesLoading } = useProperties();
  const usProperties = allProperties?.filter((p) => {
    const code = p.countryCode?.toUpperCase();
    return code === "US" || code === "USA";
  }) || [];

  if (!selectedProperty && usProperties.length > 0) {
    setSelectedProperty(usProperties[0].id);
  }

  const { data: taxSummaries, isLoading: taxLoading } = useAllUsTaxSummaries(selectedYear);
  const { data: taxHistory } = useUsTaxHistory(selectedProperty);

  const isLoading = propertiesLoading || taxLoading;
  const selectedSummary = taxSummaries?.find((s) => s.propertyId === selectedProperty);

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#222222", lineHeight: "1.43", marginBottom: "4px" }}>
              US Tax
            </h1>
            <p style={{ fontSize: "16px", fontWeight: 400, color: "#6a6a6a", lineHeight: "1.5" }}>
              Track and manage your US lodging tax obligations
            </p>
          </div>
          <Button onClick={() => setPaymentDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
          <SelectTrigger
            style={{
              width: "240px",
              height: "48px",
              borderRadius: "8px",
              border: "1px solid #dddddd",
              backgroundColor: "#ffffff",
              fontSize: "16px",
            }}
          >
            <SelectValue placeholder="Select property" />
          </SelectTrigger>
          <SelectContent>
            {usProperties.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          style={{
            padding: "10px 16px",
            borderRadius: "9999px",
            border: "1px solid #dddddd",
            backgroundColor: "#f7f7f7",
            fontSize: "14px",
            fontWeight: 500,
            color: "#222222",
          }}
        >
          {selectedYear}
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
          <LoadingSpinner />
        </div>
      ) : usProperties.length === 0 ? (
        /* Empty State */
        <div
          style={{
            textAlign: "center",
            padding: "64px 24px",
            border: "1px solid #dddddd",
            borderRadius: "14px",
            backgroundColor: "#f7f7f7",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "9999px",
              backgroundColor: "#fff0f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Receipt className="h-6 w-6 text-[#ff385c]" />
          </div>
          <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#222222", marginBottom: "8px" }}>
            No US Properties Found
          </h3>
          <p style={{ fontSize: "16px", color: "#6a6a6a", maxWidth: "400px", margin: "0 auto", lineHeight: "1.5" }}>
            You don't have any properties located in the US. Add a property with a US country code to track tax obligations here.
          </p>
        </div>
      ) : selectedProperty && selectedSummary ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Summary Cards */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 500, color: "#222222", letterSpacing: "-0.44px" }}>
                Tax Summary
              </h2>
              <Badge variant={statusConfig[selectedSummary.status]?.variant || "secondary"}>
                {statusConfig[selectedSummary.status]?.label || "Unknown"}
              </Badge>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
              <SummaryItem
                label="Total Revenue"
                value={formatCurrency(selectedSummary.totalRevenue || 0, "USD")}
                icon={<TrendingUp className="h-5 w-5" style={{ color: "#1a7a40" }} />}
                iconBg="#f0faf4"
              />
              <SummaryItem
                label={`Tax Rate (${selectedSummary.taxType || "Lodging"})`}
                value={`${selectedSummary.taxRate || 0}%`}
                icon={<Receipt className="h-5 w-5" style={{ color: "#6a6a6a" }} />}
                iconBg="#f7f7f7"
              />
              <SummaryItem
                label="Tax Owed"
                value={formatCurrency(selectedSummary.totalTaxOwed || 0, "USD")}
                icon={<AlertCircle className="h-5 w-5" style={{ color: "#8a5c00" }} />}
                iconBg="#fff8e6"
              />
              <SummaryItem
                label="Tax Paid"
                value={formatCurrency(selectedSummary.totalTaxPaid || 0, "USD")}
                icon={<CheckCircle2 className="h-5 w-5" style={{ color: "#1a7a40" }} />}
                iconBg="#f0faf4"
              />
              <SummaryItem
                label="Balance Due"
                value={formatCurrency(selectedSummary.balance || 0, "USD")}
                icon={
                  selectedSummary.balance > 0
                    ? <TrendingUp className="h-5 w-5" style={{ color: "#c13515" }} />
                    : <TrendingDown className="h-5 w-5" style={{ color: "#1a7a40" }} />
                }
                iconBg={selectedSummary.balance > 0 ? "#fff0ef" : "#f0faf4"}
                highlight={selectedSummary.balance > 0}
              />
            </div>
          </div>

          {/* Payment History */}
          {taxHistory && taxHistory.length > 0 && (
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: 500, color: "#222222", letterSpacing: "-0.44px", marginBottom: "16px" }}>
                Payment History
              </h2>
              <div
                style={{
                  border: "1px solid #dddddd",
                  borderRadius: "14px",
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                }}
              >
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: "#f7f7f7", borderBottom: "1px solid #dddddd" }}>
                      <TableHead style={{ fontSize: "14px", fontWeight: 500, color: "#6a6a6a", padding: "14px 20px" }}>Date</TableHead>
                      <TableHead style={{ fontSize: "14px", fontWeight: 500, color: "#6a6a6a", padding: "14px 20px" }}>Amount</TableHead>
                      <TableHead style={{ fontSize: "14px", fontWeight: 500, color: "#6a6a6a", padding: "14px 20px" }}>Reference</TableHead>
                      <TableHead style={{ fontSize: "14px", fontWeight: 500, color: "#6a6a6a", padding: "14px 20px", textAlign: "right" }}>Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxHistory.map((payment) => (
                      <TableRow
                        key={payment.id}
                        style={{ borderBottom: "1px solid #ebebeb" }}
                        className="hover:bg-[#f7f7f7] transition-colors"
                      >
                        <TableCell style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "9999px",
                                backgroundColor: "#f0faf4",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4" style={{ color: "#1a7a40" }} />
                            </div>
                            <span style={{ fontSize: "16px", fontWeight: 500, color: "#222222" }}>
                              {formatDate(payment.date)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "16px", fontWeight: 600, color: "#222222" }}>
                            {formatCurrency(payment.amount, "USD")}
                          </span>
                        </TableCell>
                        <TableCell style={{ padding: "16px 20px" }}>
                          <span
                            style={{
                              fontSize: "13px",
                              fontFamily: "monospace",
                              backgroundColor: "#f7f7f7",
                              border: "1px solid #ebebeb",
                              borderRadius: "4px",
                              padding: "3px 8px",
                              color: "#6a6a6a",
                            }}
                          >
                            {payment.reference || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell style={{ padding: "16px 20px", textAlign: "right" }}>
                          <Badge variant="secondary">
                            {payment.period}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#6a6a6a" }}>
          <Receipt className="h-10 w-10 mx-auto mb-3" style={{ opacity: 0.4 }} />
          <p style={{ fontSize: "16px" }}>No tax data for this property or year.</p>
        </div>
      )}

      {/* Dialog */}
      <TaxPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        initialPropertyId={selectedProperty}
        properties={usProperties}
      />
    </>
  );
}

export default UsTaxPage;
