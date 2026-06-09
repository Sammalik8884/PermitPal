import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockPermitStatusHistory, type PermitStatusHistoryEntry } from "@/lib/mock-data";
import type { Permit, PermitStatus } from "@/types";
import type { CreatePermitFormData } from "@/lib/validations/permit";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import toast from "react-hot-toast";

// ─── Backend DTO Types ───────────────────────────────────────────────────────

interface PermitResponse {
  id: string;
  propertyId: string;
  permitType: string;
  permitNumber?: string;
  status: PermitStatus;
  issuingAuthority?: string;
  issuedDate?: string;
  expiryDate?: string;
  renewalUrl?: string;
  daysUntilExpiry?: number;
  createdAt: string;
  notes?: string;
}

// Helper to map backend DTO to frontend Type
function mapPermitResponseToPermit(dto: PermitResponse): Permit {
  return {
    id: dto.id,
    propertyId: dto.propertyId,
    permitType: dto.permitType,
    permitNumber: dto.permitNumber ?? "",
    status: dto.status,
    issuedAt: dto.issuedDate ?? new Date().toISOString(),
    expiresAt: dto.expiryDate ?? new Date().toISOString(),
    issuingAuthority: dto.issuingAuthority ?? "",
    notes: dto.notes ?? null,
    documentId: null,
    createdAt: dto.createdAt,
    updatedAt: dto.createdAt,
  };
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export interface PermitFilters {
  search?: string;
  propertyId?: string | "all";
  status?: PermitStatus | "all";
  sortBy?: "expiresAt" | "propertyName";
  sortOrder?: "asc" | "desc";
}

// ─── Permits List Hook ───────────────────────────────────────────────────────

export function usePermits(filters: PermitFilters = {}) {
  return useQuery<Permit[]>({
    queryKey: ["permits", filters],
    queryFn: async () => {
      let url = "/permits";
      if (filters.propertyId && filters.propertyId !== "all") {
        url += `?propertyId=${filters.propertyId}`;
      }

      const dtos = await apiGet<PermitResponse[]>(url);
      let result = dtos.map(mapPermitResponseToPermit);

      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.permitType.toLowerCase().includes(search) ||
            p.permitNumber.toLowerCase().includes(search)
        );
      }

      // Status filter
      if (filters.status && filters.status !== "all") {
        result = result.filter((p) => p.status === filters.status);
      }

      // Sort
      const sortBy = filters.sortBy ?? "expiresAt";
      const sortOrder = filters.sortOrder ?? "asc";
      result.sort((a, b) => {
        let comparison = 0;
        if (sortBy === "expiresAt") {
          comparison = new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        } else if (sortBy === "propertyName") {
          // In real API, we'd sort in backend or join property name. Doing simple sort here.
          comparison = a.propertyId.localeCompare(b.propertyId);
        }
        return sortOrder === "desc" ? -comparison : comparison;
      });

      return result;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Single Permit Hook ──────────────────────────────────────────────────────

export function usePermit(id: string | undefined) {
  return useQuery<Permit | null>({
    queryKey: ["permit", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const dto = await apiGet<PermitResponse>(`/permits/${id}`);
        return mapPermitResponseToPermit(dto);
      } catch (error) {
        console.error("Failed to fetch permit", error);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Permit Status History Hook ──────────────────────────────────────────────

export function usePermitStatusHistory(permitId: string | undefined) {
  return useQuery<PermitStatusHistoryEntry[]>({
    queryKey: ["permit-status-history", permitId],
    queryFn: async () => {
      if (!permitId) return [];
      // Backend does not have a status history endpoint yet.
      // Mocking this specific part so UI doesn't crash.
      return mockPermitStatusHistory
        .filter((h) => h.permitId === permitId)
        .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
    },
    enabled: !!permitId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Create Permit Mutation ──────────────────────────────────────────────────

export function useCreatePermit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePermitFormData): Promise<Permit> => {
      const payload = {
        propertyId: data.propertyId,
        permitType: data.permitType,
        permitNumber: data.permitNumber || null,
        issuingAuthority: data.issuingAuthority || null,
        status: data.status,
        issuedDate: data.issuedAt ? data.issuedAt.split("T")[0] : null,
        expiryDate: data.expiresAt ? data.expiresAt.split("T")[0] : null,
        notes: data.notes || null,
      };

      const dto = await apiPost<PermitResponse>("/permits", payload);
      return mapPermitResponseToPermit(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permits"] });
      queryClient.invalidateQueries({ queryKey: ["property-permits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Permit created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create permit");
      console.error(error);
    },
  });
}

// ─── Update Permit Mutation ──────────────────────────────────────────────────

export function useUpdatePermit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePermitFormData> }): Promise<Permit> => {
      const payload = {
        permitType: data.permitType,
        permitNumber: data.permitNumber || null,
        issuingAuthority: data.issuingAuthority || null,
        status: data.status,
        issuedDate: data.issuedAt ? data.issuedAt.split("T")[0] : null,
        expiryDate: data.expiresAt ? data.expiresAt.split("T")[0] : null,
        notes: data.notes || null,
      };

      const dto = await apiPut<PermitResponse>(`/permits/${id}`, payload);
      return mapPermitResponseToPermit(dto);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["permits"] });
      queryClient.invalidateQueries({ queryKey: ["permit", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["property-permits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Permit updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update permit");
      console.error(error);
    },
  });
}

// ─── Delete Permit Mutation ──────────────────────────────────────────────────

export function useDeletePermit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiDelete(`/permits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permits"] });
      queryClient.invalidateQueries({ queryKey: ["property-permits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Permit deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete permit");
      console.error(error);
    },
  });
}

// ─── Renew Permit Mutation ───────────────────────────────────────────────────

export function useRenewPermit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // In a real app, this might call a specific /renew endpoint or open a form.
      // For now, we simulate a successful renewal action.
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permits"] });
      queryClient.invalidateQueries({ queryKey: ["property-permits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Permit renewal initiated");
    },
    onError: (error) => {
      toast.error("Failed to renew permit");
      console.error(error);
    },
  });
}
