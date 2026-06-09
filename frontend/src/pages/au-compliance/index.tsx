import { useState } from "react";
import { Scale, Plus, DollarSign, Flame, MessageSquare, History, CheckCircle2, Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LevySummary } from "./components/levy-summary";
import { LevyPaymentDialog } from "./components/levy-payment-dialog";
import { FireSafetyChecklist } from "./components/fire-safety-checklist";
import { FireSafetyEditDialog } from "./components/fire-safety-edit-dialog";
import { ComplaintsTable } from "./components/complaints-table";
import { LogComplaintDialog, UpdateComplaintDialog } from "./components/complaint-dialog";
import {
  useAllAuLevySummaries,
  useAuLevyHistory,
  useAllAuFireSafety,
  useAuComplaints,
} from "@/hooks/use-au-compliance";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { AuFireSafetyRecord, AuComplaint } from "@/lib/mock-data";

import { useProperties } from "@/hooks/use-properties";

function AuCompliancePage() {
  const [selectedYear] = useState(2026);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [levyDialogOpen, setLevyDialogOpen] = useState(false);
  const [fireSafetyEditRecord, setFireSafetyEditRecord] = useState<AuFireSafetyRecord | null>(null);
  const [logComplaintOpen, setLogComplaintOpen] = useState(false);
  const [updateComplaint, setUpdateComplaint] = useState<AuComplaint | null>(null);
  const [complaintPropertyFilter, setComplaintPropertyFilter] = useState<string>("all");
  const [complaintStatusFilter, setComplaintStatusFilter] = useState<string>("all");

  // Data hooks
  const { data: allProperties, isLoading: propertiesLoading } = useProperties();
  const auProperties = allProperties?.filter((p) => p.countryCode === "AU") || [];

  // Automatically select the first AU property if none is selected
  if (!selectedProperty && auProperties.length > 0) {
    setSelectedProperty(auProperties[0].id);
  }

  const { data: levySummaries, isLoading: levyLoading } = useAllAuLevySummaries(selectedYear);
  const { data: levyHistory } = useAuLevyHistory(selectedProperty);
  const { data: fireSafetyRecords, isLoading: fireLoading } = useAllAuFireSafety();
  const { data: complaints, isLoading: complaintsLoading } = useAuComplaints();

  const selectedLevySummary = levySummaries?.find((s) => s.propertyId === selectedProperty);

  // Filter complaints
  const filteredComplaints = complaints?.filter((c) => {
    if (complaintPropertyFilter !== "all" && c.propertyId !== complaintPropertyFilter) return false;
    if (complaintStatusFilter !== "all" && c.status !== complaintStatusFilter) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="AU Compliance"
        description="Australian short-term rental compliance"
      />

      <Tabs defaultValue="levy" className="space-y-6">
        <TabsList>
          <TabsTrigger value="levy" className="gap-1.5">
            <DollarSign className="h-3.5 w-3.5" />
            Levy Tracker
          </TabsTrigger>
          <TabsTrigger value="fire-safety" className="gap-1.5">
            <Flame className="h-3.5 w-3.5" />
            Fire Safety
          </TabsTrigger>
          <TabsTrigger value="complaints" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            Complaints Log
          </TabsTrigger>
        </TabsList>

        {/* ─── Levy Tracker Tab ──────────────────────────────────────────── */}
        <TabsContent value="levy" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[220px] h-9">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {auProperties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs">
              {selectedYear}
            </Badge>
            <div className="ml-auto">
              <Button size="sm" onClick={() => setLevyDialogOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Record Payment
              </Button>
            </div>
          </div>

          {/* Summary Card */}
          {propertiesLoading || levyLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : auProperties.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/20">
              <Scale className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No AU Properties Found</h3>
              <p className="text-sm max-w-md mx-auto mt-2">
                You don't have any properties located in Australia. Add a property with an AU country code to track compliance here.
              </p>
            </div>
          ) : selectedLevySummary ? (
            <LevySummary summary={selectedLevySummary} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No levy data for this property/year.</p>
            </div>
          )}

          {/* Payment History */}
          {levyHistory && levyHistory.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4 px-1">
                <div style={{ padding: "6px", backgroundColor: "#f0f4ff", borderRadius: "6px" }}>
                  <History style={{ width: "16px", height: "16px", color: "#2a4db3" }} />
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#222222" }}>Payment History</h3>
              </div>
              <div style={{ border: "1px solid #ebebeb", backgroundColor: "#ffffff", borderRadius: "14px", overflow: "hidden" }}>
                <Table>
                  <TableHeader style={{ backgroundColor: "#f7f7f7", borderBottom: "1px solid #ebebeb" }}>
                    <TableRow className="hover:bg-transparent" style={{ borderBottom: "none" }}>
                      <TableHead style={{ fontWeight: 500, color: "#6a6a6a" }}>Date</TableHead>
                      <TableHead style={{ fontWeight: 500, color: "#6a6a6a" }}>Amount</TableHead>
                      <TableHead style={{ fontWeight: 500, color: "#6a6a6a" }}>Reference</TableHead>
                      <TableHead style={{ fontWeight: 500, color: "#6a6a6a", textAlign: "right" }} className="pr-6">Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {levyHistory.map((payment, idx) => (
                      <TableRow key={payment.id} className="hover:bg-[#f7f7f7]" style={{ borderBottom: idx === levyHistory.length - 1 ? "none" : "1px solid #ebebeb", transition: "background-color 0.15s ease" }}>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div style={{ height: "32px", width: "32px", borderRadius: "9999px", backgroundColor: "#f0faf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <CheckCircle2 style={{ width: "16px", height: "16px", color: "#1a7a40" }} />
                            </div>
                            <span style={{ fontSize: "14px", fontWeight: 500, color: "#222222" }}>{formatDate(payment.date)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: "#222222", letterSpacing: "-0.2px" }}>
                            {formatCurrency(payment.amount, "AUD")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Receipt style={{ width: "14px", height: "14px", color: "#929292" }} />
                            <span style={{ fontSize: "12px", fontFamily: "monospace", backgroundColor: "#ffffff", color: "#6a6a6a", border: "1px solid #dddddd", padding: "2px 8px", borderRadius: "6px" }}>
                              {payment.reference || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Badge variant="outline" style={{ fontSize: "12px", backgroundColor: "#f0f4ff", color: "#2a4db3", border: "none", padding: "4px 10px" }}>
                            {payment.quarter} {payment.year}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <LevyPaymentDialog
            open={levyDialogOpen}
            onOpenChange={setLevyDialogOpen}
            propertyId={selectedProperty}
          />
        </TabsContent>

        {/* ─── Fire Safety Tab ───────────────────────────────────────────── */}
        <TabsContent value="fire-safety" className="space-y-6">
          {fireLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : fireSafetyRecords && fireSafetyRecords.length > 0 ? (
            <div className="space-y-4">
              {fireSafetyRecords.map((record) => (
                <FireSafetyChecklist
                  key={record.id}
                  record={record}
                  onEdit={() => setFireSafetyEditRecord(record)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Flame className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No fire safety records found.</p>
            </div>
          )}

          {fireSafetyEditRecord && (
            <FireSafetyEditDialog
              open={!!fireSafetyEditRecord}
              onOpenChange={(open) => {
                if (!open) setFireSafetyEditRecord(null);
              }}
              record={fireSafetyEditRecord}
            />
          )}
        </TabsContent>

        {/* ─── Complaints Tab ────────────────────────────────────────────── */}
        <TabsContent value="complaints" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <Select value={complaintPropertyFilter} onValueChange={setComplaintPropertyFilter}>
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {auProperties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={complaintStatusFilter} onValueChange={setComplaintStatusFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <Button size="sm" onClick={() => setLogComplaintOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Log Complaint
              </Button>
            </div>
          </div>

          {complaintsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <ComplaintsTable
              complaints={filteredComplaints ?? []}
              onUpdateComplaint={(complaint) => setUpdateComplaint(complaint)}
            />
          )}

          <LogComplaintDialog
            open={logComplaintOpen}
            onOpenChange={setLogComplaintOpen}
            properties={auProperties.map(p => ({ id: p.id, name: p.name }))}
          />

          <UpdateComplaintDialog
            open={!!updateComplaint}
            onOpenChange={(open) => {
              if (!open) setUpdateComplaint(null);
            }}
            complaint={updateComplaint}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default AuCompliancePage;
