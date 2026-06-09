import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockAuLevySummaries,
  mockAuLevyPayments,
  mockAuFireSafety,
  mockAuComplaints,
  type AuLevySummaryData,
  type AuLevyPayment,
  type AuFireSafetyRecord,
  type AuComplaint,
} from "@/lib/mock-data";
import { generateId } from "@/lib/utils";
import toast from "react-hot-toast";

import { apiGet, apiPost, apiPut } from "@/lib/api";

// ─── Toggle for mock vs real API ─────────────────────────────────────────────

const USE_MOCK = false;

// ─── Simulated API delay ─────────────────────────────────────────────────────

function simulateDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ─── AU Levy Summary ─────────────────────────────────────────────────────────

export function useAuLevySummary(propertyId: string | undefined, year: number) {
  return useQuery<AuLevySummaryData | null>({
    queryKey: ["au-levy-summary", propertyId, year],
    queryFn: async () => {
      if (!propertyId) return null;
      if (USE_MOCK) {
        const summary = mockAuLevySummaries.find(
          (s) => s.propertyId === propertyId && s.year === year
        );
        return simulateDelay(summary ?? null);
      }
      
      const response = await apiGet<any>(`/au-compliance/levy/${propertyId}?year=${year}`);
      return {
        propertyId: response.propertyId,
        propertyName: "",
        year: response.year,
        totalNights: response.totalNights || 0,
        levyRatePerNight: response.levyRatePerNight || 0,
        totalOwed: response.totalOwed || 0,
        totalPaid: response.totalPaid || 0,
        balance: response.balance || 0,
        status: response.status?.toLowerCase() || "unknown",
      } as AuLevySummaryData;
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── All AU Levy Summaries ───────────────────────────────────────────────────

export function useAllAuLevySummaries(year: number) {
  return useQuery<AuLevySummaryData[]>({
    queryKey: ["au-levy-summaries", year],
    queryFn: async () => {
      if (USE_MOCK) {
        const summaries = mockAuLevySummaries.filter((s) => s.year === year);
        return simulateDelay(summaries);
      }
      const properties = await apiGet<any[]>("/properties");
      const auProps = properties.filter(p => p.countryCode === "AU");
      
      const summaries = await Promise.all(auProps.map(async (p) => {
        try {
           const response = await apiGet<any>(`/au-compliance/levy/${p.id}?year=${year}`);
           return {
              propertyId: response.propertyId,
              propertyName: p.name,
              year: response.year,
              totalNights: response.totalNights || 0,
              levyRatePerNight: response.levyRatePerNight || 0,
              totalOwed: response.totalOwed || 0,
              totalPaid: response.totalPaid || 0,
              balance: response.balance || 0,
              status: response.status?.toLowerCase() || "unknown",
            } as AuLevySummaryData;
        } catch (e) {
           return {
              propertyId: p.id,
              propertyName: p.name,
              year: year,
              totalNights: 0,
              levyRatePerNight: 0,
              totalOwed: 0,
              totalPaid: 0,
              balance: 0,
              status: "unknown",
           } as AuLevySummaryData;
        }
      }));
      return summaries;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── AU Levy Payment History ─────────────────────────────────────────────────

export function useAuLevyHistory(propertyId: string | undefined) {
  return useQuery<AuLevyPayment[]>({
    queryKey: ["au-levy-history", propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      if (USE_MOCK) {
        const payments = mockAuLevyPayments.filter(
          (p) => p.propertyId === propertyId
        );
        return simulateDelay(payments);
      }
      
      const response = await apiGet<any[]>(`/au-compliance/levy/${propertyId}/history`);
      return response.map(p => {
        const parts = p.period ? p.period.split(" ") : ["", ""];
        return {
          id: p.id,
          propertyId: propertyId,
          amount: p.amount,
          date: p.paidDate,
          reference: p.reference,
          quarter: parts[0],
          year: parseInt(parts[1]) || 2026,
          status: "completed"
        };
      }) as AuLevyPayment[];
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Record Levy Payment Mutation ────────────────────────────────────────────

export interface RecordLevyPaymentInput {
  propertyId: string;
  amount: number;
  date: string;
  reference: string;
}

export function useRecordLevyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RecordLevyPaymentInput): Promise<AuLevyPayment> => {
      if (USE_MOCK) {
        const newPayment: AuLevyPayment = {
          id: `lp-${generateId().slice(0, 8)}`,
          propertyId: input.propertyId,
          amount: input.amount,
          date: input.date,
          reference: input.reference,
          quarter: "Q2",
          year: 2026,
        };
        mockAuLevyPayments.unshift(newPayment);
        return simulateDelay(newPayment, 600);
      }
      
      const response = await apiPost<any>(`/au-compliance/levy/${input.propertyId}/payment`, {
        amount: input.amount,
        paidDate: input.date,
        reference: input.reference
      });
      
      const parts = response.period ? response.period.split(" ") : ["", ""];
      return {
        id: response.id,
        propertyId: input.propertyId,
        amount: response.amount,
        date: response.paidDate,
        reference: response.reference,
        quarter: parts[0],
        year: parseInt(parts[1]) || 2026,
        status: "completed"
      } as AuLevyPayment;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["au-levy-history", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["au-levy-summary", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["au-levy-summaries"] });
      toast.success("Payment recorded successfully");
    },
    onError: () => {
      toast.error("Failed to record payment");
    },
  });
}

// ─── AU Fire Safety ──────────────────────────────────────────────────────────

export function useAuFireSafety(propertyId: string | undefined) {
  return useQuery<AuFireSafetyRecord | null>({
    queryKey: ["au-fire-safety", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      if (USE_MOCK) {
        const record = mockAuFireSafety.find(
          (r) => r.propertyId === propertyId
        );
        return simulateDelay(record ?? null);
      }
      
      const response = await apiGet<any>(`/au-compliance/fire-safety/${propertyId}`);
      return {
        propertyId: propertyId,
        lastInspectionDate: response.lastInspectionDate,
        nextInspectionDate: response.nextInspectionDate,
        isCompliant: response.isCompliant,
        certificateUrl: response.certificateUrl,
        notes: response.notes
      } as AuFireSafetyRecord;
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── All AU Fire Safety Records ──────────────────────────────────────────────

export function useAllAuFireSafety() {
  return useQuery<AuFireSafetyRecord[]>({
    queryKey: ["au-fire-safety-all"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay(mockAuFireSafety);
      }
      
      const properties = await apiGet<any[]>("/properties");
      const auProps = properties.filter(p => p.countryCode === "AU");
      
      const records = await Promise.all(auProps.map(async (p) => {
        try {
          const response = await apiGet<any>(`/au-compliance/fire-safety/${p.id}`);
          return {
            id: response.id || p.id,
            propertyId: p.id,
            propertyName: p.name,
            smokeAlarmsInstalled: response.smokeAlarmsInstalled || false,
            smokeAlarmsLastTested: response.smokeAlarmsLastTested || null,
            fireExtinguisherPresent: response.fireExtinguisherPresent || false,
            fireExtinguisherExpiry: response.fireExtinguisherExpiryDate || null,
            evacuationPlanDisplayed: response.evacuationPlanDisplayed || false,
            lastInspectionDate: response.lastInspectionDate || null,
            nextInspectionDue: response.nextInspectionDue || null,
            overallStatus: response.complianceStatus?.toLowerCase() || "action_required",
            actionItems: (response.actionItems || []).map((desc: string) => ({
              description: desc,
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              priority: "medium"
            }))
          } as AuFireSafetyRecord;
        } catch (e) {
          return {
            id: p.id,
            propertyId: p.id,
            propertyName: p.name,
            smokeAlarmsInstalled: false,
            smokeAlarmsLastTested: null,
            fireExtinguisherPresent: false,
            fireExtinguisherExpiry: null,
            evacuationPlanDisplayed: false,
            lastInspectionDate: null,
            nextInspectionDue: null,
            overallStatus: "action_required",
            actionItems: []
          } as AuFireSafetyRecord;
        }
      }));
      return records;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Update Fire Safety Mutation ─────────────────────────────────────────────

export interface UpdateFireSafetyInput {
  propertyId: string;
  smokeAlarmsInstalled: boolean;
  smokeAlarmsLastTested: string | null;
  fireExtinguisherPresent: boolean;
  fireExtinguisherExpiry: string | null;
  evacuationPlanDisplayed: boolean;
  lastInspectionDate: string | null;
  nextInspectionDue: string | null;
}

export function useUpdateFireSafety() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateFireSafetyInput): Promise<void> => {
      if (USE_MOCK) {
        const record = mockAuFireSafety.find((r) => r.propertyId === input.propertyId);
        if (record) {
          record.smokeAlarmsInstalled = input.smokeAlarmsInstalled;
          record.smokeAlarmsLastTested = input.smokeAlarmsLastTested;
          record.fireExtinguisherPresent = input.fireExtinguisherPresent;
          record.fireExtinguisherExpiry = input.fireExtinguisherExpiry;
          record.evacuationPlanDisplayed = input.evacuationPlanDisplayed;
        }
        return simulateDelay(undefined, 800);
      }
      
      await apiPut(`/au-compliance/fire-safety/${input.propertyId}`, {
        smokeAlarmsInstalled: input.smokeAlarmsInstalled,
        smokeAlarmsLastTested: input.smokeAlarmsLastTested,
        fireExtinguisherPresent: input.fireExtinguisherPresent,
        fireExtinguisherExpiryDate: input.fireExtinguisherExpiry,
        evacuationPlanDisplayed: input.evacuationPlanDisplayed,
        lastInspectionDate: input.lastInspectionDate,
        nextInspectionDue: input.nextInspectionDue
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["au-fire-safety", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["au-fire-safety-all"] });
      toast.success("Fire safety record updated");
    },
    onError: () => {
      toast.error("Failed to update fire safety record");
    },
  });
}

// ─── AU Complaints ───────────────────────────────────────────────────────────

export function useAuComplaints(propertyId?: string) {
  return useQuery<AuComplaint[]>({
    queryKey: ["au-complaints", propertyId],
    queryFn: async () => {
      if (USE_MOCK) {
        let complaints = mockAuComplaints;
        if (propertyId) {
          complaints = complaints.filter((c) => c.propertyId === propertyId);
        }
        return simulateDelay(complaints);
      }
      
      if (propertyId) {
        try {
          const response = await apiGet<any[]>(`/au-compliance/complaints/${propertyId}`);
          return response.map(c => ({
            id: c.id,
            propertyId: propertyId,
            propertyName: "", // We might not have it here
            date: c.dateReceived,
            type: c.complaintType,
            description: c.description,
            status: c.status?.toLowerCase() || "open",
            resolution: c.resolution,
            resolvedAt: c.resolvedAt || null
          })) as AuComplaint[];
        } catch {
          return [];
        }
      } else {
        const properties = await apiGet<any[]>("/properties");
        const auProps = properties.filter(p => p.countryCode === "AU");
        
        const allComplaints = await Promise.all(auProps.map(async (p) => {
          try {
            const response = await apiGet<any[]>(`/au-compliance/complaints/${p.id}`);
            return response.map(c => ({
              id: c.id,
              propertyId: p.id,
              propertyName: p.name,
              date: c.dateReceived,
              type: c.complaintType,
              description: c.description,
              status: c.status?.toLowerCase() || "open",
              resolution: c.resolution,
              resolvedAt: c.resolvedAt || null
            })) as AuComplaint[];
          } catch {
            return [];
          }
        }));
        
        return allComplaints.flat();
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Log Complaint Mutation ──────────────────────────────────────────────────

export interface LogComplaintInput {
  propertyId: string;
  propertyName: string;
  type: "noise" | "parking" | "waste" | "other";
  description: string;
}

export function useLogComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogComplaintInput): Promise<AuComplaint> => {
      if (USE_MOCK) {
        const newComplaint: AuComplaint = {
          id: `comp-${generateId().slice(0, 8)}`,
          propertyId: input.propertyId,
          propertyName: input.propertyName,
          date: new Date().toISOString(),
          type: input.type,
          description: input.description,
          status: "open",
          resolution: null,
          resolvedAt: null,
        };
        mockAuComplaints.unshift(newComplaint);
        return simulateDelay(newComplaint, 700);
      }
      
      const response = await apiPost<any>(`/au-compliance/complaints/${input.propertyId}`, {
        complaintType: input.type,
        description: input.description,
        dateReceived: new Date().toISOString()
      });
      
      return {
        id: response.id,
        propertyId: input.propertyId,
        propertyName: input.propertyName,
        date: response.dateReceived,
        type: response.complaintType,
        description: response.description,
        status: response.status?.toLowerCase() || "open",
        resolution: response.resolution,
        resolvedAt: response.resolvedAt || null
      } as AuComplaint;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["au-complaints"] });
      toast.success("Complaint logged successfully");
    },
    onError: () => {
      toast.error("Failed to log complaint");
    },
  });
}

// ─── Update Complaint Mutation ───────────────────────────────────────────────

export interface UpdateComplaintInput {
  complaintId: string;
  status: "open" | "responded" | "resolved" | "escalated";
  resolution?: string;
}

export function useUpdateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateComplaintInput): Promise<void> => {
      if (USE_MOCK) {
        const complaint = mockAuComplaints.find((c) => c.id === input.complaintId);
        if (complaint) {
          complaint.status = input.status;
          complaint.resolution = input.resolution ?? null;
          if (input.status === "resolved" || input.status === "dismissed") {
            complaint.resolvedAt = new Date().toISOString();
          }
        }
        return simulateDelay(undefined, 800);
      }
      
      const isResolved = input.status === "resolved" || input.status === "dismissed";
      await apiPut(`/au-compliance/complaints/${input.complaintId}`, {
        status: input.status,
        resolution: input.resolution,
        resolvedAt: isResolved ? new Date().toISOString() : null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["au-complaints"] });
      toast.success("Complaint updated successfully");
    },
    onError: () => {
      toast.error("Failed to update complaint");
    },
  });
}
