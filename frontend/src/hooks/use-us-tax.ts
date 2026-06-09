import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockUsTaxSummaries,
  mockUsTaxPayments,
  type UsTaxSummaryData,
  type UsTaxPayment,
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

// ─── US Tax Summary ──────────────────────────────────────────────────────────

export function useUsTaxSummary(propertyId: string | undefined, year: number) {
  return useQuery<UsTaxSummaryData | null>({
    queryKey: ["us-tax-summary", propertyId, year],
    queryFn: async () => {
      if (!propertyId) return null;
      if (USE_MOCK) {
        const summary = mockUsTaxSummaries.find(
          (s) => s.propertyId === propertyId && s.year === year
        );
        return simulateDelay(summary ?? null);
      }
      
      const response = await apiGet<any>(`/us-tax/${propertyId}/summary?year=${year}`);
      return {
        propertyId: response.propertyId,
        year: response.year,
        taxType: response.taxType || "Lodging",
        taxRate: response.taxRate || 0,
        totalRevenue: response.totalRevenue || 0,
        totalTaxOwed: response.totalTaxOwed || 0,
        totalTaxPaid: response.totalTaxPaid || 0,
        balance: response.balance || 0,
        status: response.status?.toLowerCase() || "unpaid",
      } as UsTaxSummaryData;
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── All US Tax Summaries ────────────────────────────────────────────────────

export function useAllUsTaxSummaries(year: number) {
  return useQuery<UsTaxSummaryData[]>({
    queryKey: ["us-tax-summaries", year],
    queryFn: async () => {
      if (USE_MOCK) {
        const summaries = mockUsTaxSummaries.filter((s) => s.year === year);
        return simulateDelay(summaries);
      }
      const properties = await apiGet<any[]>("/properties");
      const usProps = properties.filter(p => {
        const code = p.countryCode?.toUpperCase();
        return code === "US" || code === "USA";
      });

      const summaries = await Promise.all(usProps.map(async (p) => {
        try {
          const response = await apiGet<any>(`/us-tax/${p.id}/summary?year=${year}`);
          return {
            propertyId: response.propertyId,
            year: response.year,
            taxType: response.taxType || "Lodging",
            taxRate: response.taxRate || 0,
            totalRevenue: response.totalRevenue || 0,
            totalTaxOwed: response.totalTaxOwed || 0,
            totalTaxPaid: response.totalTaxPaid || 0,
            balance: response.balance || 0,
            status: response.status?.toLowerCase() || "unpaid",
          } as UsTaxSummaryData;
        } catch (e) {
          return {
            propertyId: p.id,
            year: year,
            taxType: "Lodging",
            taxRate: 0,
            totalRevenue: 0,
            totalTaxOwed: 0,
            totalTaxPaid: 0,
            balance: 0,
            status: "unpaid",
          } as UsTaxSummaryData;
        }
      }));
      return summaries;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── US Tax Payment History ──────────────────────────────────────────────────

export function useUsTaxHistory(propertyId: string | undefined) {
  return useQuery<UsTaxPayment[]>({
    queryKey: ["us-tax-history", propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      if (USE_MOCK) {
        const payments = mockUsTaxPayments.filter(
          (p) => p.propertyId === propertyId
        );
        return simulateDelay(payments);
      }
      
      const response = await apiGet<any[]>(`/us-tax/${propertyId}/history`);
      return response.map(p => ({
        id: p.id,
        propertyId: propertyId,
        amount: p.amount,
        date: p.paidDate,
        reference: p.reference,
        period: p.period || "Current",
        year: new Date(p.paidDate).getFullYear() || 2026,
        status: "completed"
      })) as UsTaxPayment[];
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Record Tax Payment Mutation ─────────────────────────────────────────────

export interface RecordTaxPaymentInput {
  propertyId: string;
  amount: number;
  date: string;
  reference: string;
}

export function useRecordTaxPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RecordTaxPaymentInput): Promise<UsTaxPayment> => {
      if (USE_MOCK) {
        const newPayment: UsTaxPayment = {
          id: `tp-${generateId().slice(0, 8)}`,
          propertyId: input.propertyId,
          amount: input.amount,
          date: input.date,
          reference: input.reference,
          period: "Q2 2026",
          year: 2026,
        };
        mockUsTaxPayments.unshift(newPayment);
        return simulateDelay(newPayment, 600);
      }
      
      const response = await apiPost<any>(`/us-tax/${input.propertyId}/payment`, {
        amount: input.amount,
        paidDate: input.date,
        reference: input.reference,
        taxType: "Lodging",
        period: "Q1 2026",
      });
      
      return {
        id: response.id,
        propertyId: input.propertyId,
        amount: response.amount,
        date: response.paidDate,
        reference: response.reference,
        period: response.period || "Current",
        year: new Date(response.paidDate).getFullYear() || 2026,
        status: "completed"
      } as UsTaxPayment;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["us-tax-history", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["us-tax-summary", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["us-tax-summaries"] });
      toast.success("Tax payment recorded successfully");
    },
    onError: () => {
      toast.error("Failed to record tax payment");
    },
  });
}
