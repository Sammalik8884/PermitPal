import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePermits } from "./use-permits";
import { useDocuments } from "./use-documents";
import {
  mockProperties,
  mockPropertyDetails,
  mockComplianceBreakdowns,
  mockPermits,
  mockNightCaps,
  mockDocuments,
  mockPropertyActivity,
  mockJurisdictions,
  type PropertyDetail,
  type ActivityItem,
} from "@/lib/mock-data";
import type {
  Property,
  Permit,
  NightCapSummary,
  ComplianceBreakdown,
  ComplianceStatus,
  PropertyType,
  Document,
} from "@/types";
import type { CreatePropertyFormData } from "@/lib/validations/property";
import { generateId } from "@/lib/utils";
import toast from "react-hot-toast";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

// ─── Toggle for mock vs real API ─────────────────────────────────────────────

const USE_MOCK = false;

// ─── Simulated API delay ─────────────────────────────────────────────────────

function simulateDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export interface PropertyFilters {
  search?: string;
  propertyType?: PropertyType | "all";
  complianceStatus?: ComplianceStatus | "all";
  sortBy?: "name" | "complianceScore" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// ─── Properties List Hook ────────────────────────────────────────────────────

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery<Property[]>({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let result: Property[] = [];
      if (USE_MOCK) {
        result = [...mockProperties];
      } else {
        const apiResponse = await apiGet<any[]>("/properties");
        result = apiResponse.map((p) => ({
          id: p.id,
          organisationId: "",
          name: p.name,
          address: p.addressLine1 + (p.addressLine2 ? `, ${p.addressLine2}` : ""),
          city: p.city,
          stateRegion: p.stateRegion || "",
          countryCode: p.countryCode,
          postalCode: p.postcode,
          propertyType: p.propertyType === "condo" ? "apartment" : (p.propertyType?.toLowerCase() || "other"),
          jurisdictionId: p.jurisdictionId || "",
          complianceScore: p.complianceScore ?? 0,
          complianceStatus: p.complianceStatus?.toLowerCase() || "unknown",
          latitude: null,
          longitude: null,
          bedroomCount: p.bedroomCount ?? 1,
          maxGuests: p.maxGuests ?? 2,
          isActive: true,
          createdAt: p.createdAt,
          updatedAt: p.createdAt,
        }));
      }

      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.address.toLowerCase().includes(search) ||
            p.city.toLowerCase().includes(search)
        );
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType !== "all") {
        result = result.filter((p) => p.propertyType === filters.propertyType);
      }

      // Compliance status filter
      if (filters.complianceStatus && filters.complianceStatus !== "all") {
        result = result.filter((p) => p.complianceStatus === filters.complianceStatus);
      }

      // Sort
      const sortBy = filters.sortBy ?? "name";
      const sortOrder = filters.sortOrder ?? "asc";
      result.sort((a, b) => {
        let comparison = 0;
        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "complianceScore") {
          comparison = a.complianceScore - b.complianceScore;
        } else if (sortBy === "createdAt") {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === "desc" ? -comparison : comparison;
      });

      return USE_MOCK ? simulateDelay(result) : result;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Single Property Hook ────────────────────────────────────────────────────

export function useProperty(id: string | undefined) {
  return useQuery<PropertyDetail | null>({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id) return null;
      if (USE_MOCK) {
        const property = mockPropertyDetails.find((p) => p.id === id) ?? null;
        return simulateDelay(property);
      }
      
      try {
        const p = await apiGet<any>(`/properties/${id}`);
        return {
          id: p.id,
          organisationId: "",
          name: p.name,
          address: p.addressLine1 + (p.addressLine2 ? `, ${p.addressLine2}` : ""),
          city: p.city,
          stateRegion: p.stateRegion || "",
          countryCode: p.countryCode,
          postalCode: p.postcode,
          propertyType: p.propertyType === "condo" ? "apartment" : (p.propertyType?.toLowerCase() || "other"),
          jurisdictionId: p.jurisdictionId || "",
          complianceScore: p.complianceScore ?? 0,
          complianceStatus: p.complianceStatus?.toLowerCase() || "unknown",
          latitude: null,
          longitude: null,
          bedroomCount: p.bedroomCount ?? 1,
          maxGuests: p.maxGuests ?? 2,
          bathroomCount: p.bathroomCount ?? 1,
          isActive: true,
          createdAt: p.createdAt,
          jurisdictionName: p.jurisdictionName || "Unknown",
          notes: p.notes ?? "",
          registrationNumber: p.registrationNumber ?? "",
        } as PropertyDetail;
      } catch (err) {
        return null;
      }
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Property Compliance Hook ────────────────────────────────────────────────

export function usePropertyCompliance(id: string | undefined) {
  return useQuery<ComplianceBreakdown | null>({
    queryKey: ["property-compliance", id],
    queryFn: async () => {
      if (!id) return null;
      const breakdown = mockComplianceBreakdowns.find((c) => c.propertyId === id) ?? null;
      return simulateDelay(breakdown);
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePropertyPermits(propertyId: string | undefined) {
  return usePermits({ propertyId });
}

// ─── Property Night Cap Hook ─────────────────────────────────────────────────

export function usePropertyNightCap(propertyId: string | undefined) {
  return useQuery<NightCapSummary | null>({
    queryKey: ["property-nightcap", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      
      try {
        const year = new Date().getFullYear();
        const response = await apiGet<any>(`/nightcaps/summary?propertyId=${propertyId}&year=${year}`);
        return {
          propertyId: response.propertyId,
          year: response.year,
          nightCap: response.nightCap,
          nightsUsed: response.nightsUsed,
          nightsRemaining: response.nightsRemaining,
          percentage: response.percentage,
          status: response.status
        };
      } catch (e) {
        return null;
      }
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Property Documents Hook ─────────────────────────────────────────────────

export function usePropertyDocuments(propertyId: string | undefined) {
  return useDocuments({ propertyId });
}

// ─── Property Activity Hook ──────────────────────────────────────────────────

export function usePropertyActivity(propertyId: string | undefined) {
  return useQuery<ActivityItem[]>({
    queryKey: ["property-activity", propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      
      // Get base mock activities
      const activities = [...(mockPropertyActivity[propertyId] ?? [])];
      
      // Fetch real permits and inject them as activities
      try {
        if (!USE_MOCK) {
          const permits = await apiGet<any[]>(`/permits?propertyId=${propertyId}`);
          permits.forEach((p) => {
            activities.push({
              id: `act-permit-${p.id}`,
              type: "permit",
              description: `Permit ${p.permitType || 'Application'} was created or updated.`,
              timestamp: p.createdAt,
            });
          });

          const docs = await apiGet<any[]>(`/documents?propertyId=${propertyId}`);
          docs.forEach((d) => {
            activities.push({
              id: `act-doc-${d.id}`,
              type: "document",
              description: `Document "${d.name || d.fileName || 'Unnamed'}" was uploaded.`,
              timestamp: d.createdAt,
            });
          });
        }
      } catch (e) {
        // Ignore if API fails to fetch
      }
      
      // Sort activities descending by date
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return simulateDelay(activities);
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Jurisdictions Hook ──────────────────────────────────────────────────────

export function useJurisdictions() {
  return useQuery({
    queryKey: ["jurisdictions"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay(mockJurisdictions);
      }
      try {
        const response = await apiGet<any[]>("/jurisdictions");
        return response;
      } catch (e) {
        return mockJurisdictions; // fallback if API fails
      }
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Create Property Mutation ────────────────────────────────────────────────

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePropertyFormData): Promise<Property> => {
      if (USE_MOCK) {
        const newProperty: Property = {
          id: `prop-${generateId().slice(0, 8)}`,
          organisationId: "org-001",
          name: data.name,
          address: data.addressLine1 + (data.addressLine2 ? `, ${data.addressLine2}` : ""),
          city: data.city,
          stateRegion: data.state,
          countryCode: data.countryCode,
          postalCode: data.postcode,
          propertyType: data.propertyType,
          jurisdictionId: data.jurisdictionId ?? "",
          complianceScore: 50,
          complianceStatus: "warning",
          latitude: null,
          longitude: null,
          bedroomCount: data.bedrooms ?? 1,
          maxGuests: (data.bedrooms ?? 1) * 2,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockProperties.push(newProperty);
        mockPropertyDetails.push({
          ...newProperty,
          bathroomCount: data.bathrooms ?? 1,
          jurisdictionName: mockJurisdictions.find(j => j.id === data.jurisdictionId)?.name ?? "Unknown",
          notes: data.notes ?? "",
          registrationNumber: data.registrationNumber ?? "",
        });
          return simulateDelay(newProperty, 800);
        }
        
        const payload = {
          name: data.name,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || null,
          city: data.city,
          stateRegion: data.state || null,
          postcode: data.postcode,
          countryCode: data.countryCode,
          propertyType: data.propertyType === "condo" ? "apartment" : data.propertyType,
          isPrimaryResidence: false,
          ownerOccupied: false,
          hostedType: "unhosted",
          bedroomCount: data.bedrooms ?? 1,
          bathroomCount: data.bathrooms ?? 1,
          maxGuests: (data.bedrooms ?? 1) * 2,
          jurisdictionId: data.jurisdictionId || null,
          notes: data.notes || null
        };
        const response = await apiPost<any>("/properties", payload);
        return {
          id: response.id,
          organisationId: "",
          name: response.name,
          address: response.addressLine1 + (response.addressLine2 ? `, ${response.addressLine2}` : ""),
          city: response.city,
          stateRegion: response.stateRegion || "",
          countryCode: response.countryCode,
          postalCode: response.postcode,
          propertyType: data.propertyType,
          jurisdictionId: data.jurisdictionId || "",
          complianceScore: response.complianceScore ?? 0,
          complianceStatus: response.complianceStatus?.toLowerCase() || "unknown",
          latitude: null,
          longitude: null,
          bedroomCount: response.bedroomCount ?? data.bedrooms ?? 1,
          bathroomCount: response.bathroomCount ?? data.bathrooms ?? 1,
          maxGuests: response.maxGuests ?? (data.bedrooms ?? 1) * 2,
          isActive: true,
          createdAt: response.createdAt,
          updatedAt: response.createdAt,
        };
      },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property created successfully");
    },
    onError: () => {
      toast.error("Failed to create property");
    },
  });
}

// ─── Update Property Mutation ────────────────────────────────────────────────

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePropertyFormData> }): Promise<Property> => {
      if (USE_MOCK) {
        const existing = mockProperties.find((p) => p.id === id);
        if (!existing) throw new Error("Property not found");
        const updated: Property = {
          ...existing,
          name: data.name ?? existing.name,
          address: data.addressLine1 ?? existing.address,
          city: data.city ?? existing.city,
          stateRegion: data.state ?? existing.stateRegion,
          countryCode: data.countryCode ?? existing.countryCode,
          postalCode: data.postcode ?? existing.postalCode,
          propertyType: data.propertyType ?? existing.propertyType,
          bedroomCount: data.bedrooms ?? existing.bedroomCount,
          updatedAt: new Date().toISOString(),
        };
        
        // Update main list
        const index = mockProperties.findIndex((p) => p.id === id);
        if (index !== -1) mockProperties[index] = updated;
        
        // Update details
        const detailsIndex = mockPropertyDetails.findIndex((p) => p.id === id);
        if (detailsIndex !== -1) {
          mockPropertyDetails[detailsIndex] = {
            ...mockPropertyDetails[detailsIndex],
            ...updated,
            bathroomCount: data.bathrooms ?? mockPropertyDetails[detailsIndex].bathroomCount,
          };
        }
        
          return simulateDelay(updated, 800);
        }
        
        const payload = {
          name: data.name,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || null,
          city: data.city,
          stateRegion: data.state || null,
          postcode: data.postcode,
          countryCode: data.countryCode,
          propertyType: data.propertyType === "condo" ? "apartment" : data.propertyType,
          isPrimaryResidence: false,
          ownerOccupied: false,
          hostedType: "unhosted",
          bedroomCount: data.bedrooms ?? 1,
          bathroomCount: data.bathrooms ?? 1,
          maxGuests: (data.bedrooms ?? 1) * 2,
          jurisdictionId: data.jurisdictionId || null,
          notes: data.notes || null
        };
        const response = await apiPut<any>(`/properties/${id}`, payload);
        return {
          id: response.id,
          organisationId: "",
          name: response.name,
          address: response.addressLine1 + (response.addressLine2 ? `, ${response.addressLine2}` : ""),
          city: response.city,
          stateRegion: response.stateRegion || "",
          countryCode: response.countryCode,
          postalCode: response.postcode,
          propertyType: data.propertyType as any,
          jurisdictionId: data.jurisdictionId || "",
          complianceScore: response.complianceScore ?? 0,
          complianceStatus: response.complianceStatus?.toLowerCase() || "unknown",
          latitude: null,
          longitude: null,
          bedroomCount: response.bedroomCount ?? data.bedrooms ?? 1,
          bathroomCount: response.bathroomCount ?? data.bathrooms ?? 1,
          maxGuests: response.maxGuests ?? (data.bedrooms ?? 1) * 2,
          isActive: true,
          createdAt: response.createdAt,
          updatedAt: response.createdAt,
        };
      },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
      toast.success("Property updated successfully");
    },
    onError: () => {
      toast.error("Failed to update property");
    },
  });
}

// ─── Delete Property Mutation ────────────────────────────────────────────────

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockProperties.findIndex((p) => p.id === id);
        if (index !== -1) mockProperties.splice(index, 1);
        
        const detailsIndex = mockPropertyDetails.findIndex((p) => p.id === id);
        if (detailsIndex !== -1) mockPropertyDetails.splice(detailsIndex, 1);
        
        return simulateDelay(undefined, 600);
      }
      await apiDelete(`/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete property");
    },
  });
}
