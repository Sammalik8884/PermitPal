import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockEuRegistrations,
  mockEuRequirements,
  type EuPropertyRegistration,
  type EuCountryRequirements,
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

// ─── EU Properties with Registration Status ──────────────────────────────────

export function useEuProperties() {
  return useQuery<EuPropertyRegistration[]>({
    queryKey: ["eu-properties"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay(mockEuRegistrations);
      }
      
      // Fetch EU properties - since EuRegistrationController only gives progress per property,
      // we get all properties and filter by EU, then maybe augment if needed.
      const properties = await apiGet<any[]>("/properties");
      const euCountries = ["FR", "ES", "IT", "DE", "PT", "GR"]; // simplified list
      const euProps = properties.filter(p => euCountries.includes(p.countryCode));
      
      const getCountryName = (code: string) => {
        const map: Record<string, string> = { "FR": "France", "ES": "Spain", "IT": "Italy", "DE": "Germany", "PT": "Portugal", "GR": "Greece", "CH": "Switzerland" };
        return map[code] || code;
      };

      const getCountryFlag = (code: string) => {
        const map: Record<string, string> = { "FR": "🇫🇷", "ES": "🇪🇸", "IT": "🇮🇹", "DE": "🇩🇪", "PT": "🇵🇹", "GR": "🇬🇷", "CH": "🇨🇭" };
        return map[code] || "🇪🇺";
      };

      const propertiesWithProgress = await Promise.all(euProps.map(async (p) => {
        try {
          const progress = await apiGet<any>(`/eu-registration/${p.id}/progress`);
          const completedSteps = progress.steps?.filter((s: any) => s.completed || s.isCompleted).length || 0;
          const totalSteps = progress.steps?.length || 0;
          const percentComplete = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
          
          let status = "not_started";
          if (progress.status && progress.status !== "pending") {
             status = progress.status;
          } else if (completedSteps === totalSteps && totalSteps > 0) {
             status = "completed";
          } else if (completedSteps > 0) {
             status = "in_progress";
          }

          return {
             propertyId: p.id,
             countryCode: p.countryCode,
             countryName: getCountryName(p.countryCode),
             countryFlag: getCountryFlag(p.countryCode),
             propertyName: p.name,
             status: status,
             registrationNumber: progress.registrationNumber || null,
             completedSteps,
             totalSteps,
             percentComplete,
             steps: progress.steps?.map((s: any) => ({
                 id: s.stepName,
                 isCompleted: s.completed || s.isCompleted
             })) || [],
             nextStep: null
          } as EuPropertyRegistration;
        } catch (e) {
          return {
             propertyId: p.id,
             countryCode: p.countryCode,
             countryName: getCountryName(p.countryCode),
             countryFlag: getCountryFlag(p.countryCode),
             propertyName: p.name,
             status: "not_started",
             registrationNumber: null,
             completedSteps: 0,
             totalSteps: 0,
             percentComplete: 0,
             steps: [],
             nextStep: null
          } as EuPropertyRegistration;
        }
      }));

      return propertiesWithProgress;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── EU Registration Progress for a Property ─────────────────────────────────

export function useEuRegistrationProgress(propertyId: string | undefined) {
  return useQuery<EuPropertyRegistration | null>({
    queryKey: ["eu-registration-progress", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      if (USE_MOCK) {
        const registration = mockEuRegistrations.find(
          (r) => r.propertyId === propertyId
        );
        return simulateDelay(registration ?? null);
      }
      
      const response = await apiGet<any>(`/eu-registration/${propertyId}/progress`);
      
      let property;
      try {
        property = await apiGet<any>(`/properties/${propertyId}`);
      } catch (e) {
        // ignore
      }

      const countryCode = response.countryCode || property?.countryCode || "EU";

      const getCountryName = (code: string) => {
        const map: Record<string, string> = { "FR": "France", "ES": "Spain", "IT": "Italy", "DE": "Germany", "PT": "Portugal", "GR": "Greece", "CH": "Switzerland" };
        return map[code] || code;
      };

      const getCountryFlag = (code: string) => {
        const map: Record<string, string> = { "FR": "🇫🇷", "ES": "🇪🇸", "IT": "🇮🇹", "DE": "🇩🇪", "PT": "🇵🇹", "GR": "🇬🇷", "CH": "🇨🇭" };
        return map[code] || "🇪🇺";
      };

      return {
        propertyId: propertyId,
        countryCode: countryCode,
        countryName: getCountryName(countryCode),
        countryFlag: getCountryFlag(countryCode),
        propertyName: property?.name || "Unknown Property", 
        status: response.status || "in_progress",
        registrationNumber: response.registrationNumber || null,
        completedSteps: response.steps?.filter((s: any) => s.isCompleted || s.completed).length || 0,
        totalSteps: response.steps?.length || 0,
        percentComplete: response.steps?.length ? Math.round(((response.steps?.filter((s: any) => s.isCompleted || s.completed).length || 0) / response.steps?.length) * 100) : 0,
        steps: response.steps?.map((s: any) => ({
          id: s.stepName,
          stepName: s.stepName,
          displayName: s.displayName || s.stepName,
          description: s.description || "",
          isCompleted: s.isCompleted,
          completedAt: s.completedAt,
          order: s.order || 0,
          requiresUpload: false,
          externalPortalUrl: null,
        })) || [],
        nextStep: null
      } as EuPropertyRegistration;
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── EU Requirements by Country ──────────────────────────────────────────────

export function useEuRequirements(countryCode: string | undefined) {
  return useQuery<EuCountryRequirements | null>({
    queryKey: ["eu-requirements", countryCode],
    queryFn: async () => {
      if (!countryCode) return null;
      if (USE_MOCK) {
        const requirements = mockEuRequirements.find(
          (r) => r.countryCode === countryCode
        );
        return simulateDelay(requirements ?? null);
      }
      
      const response = await apiGet<any[]>(`/eu-registration/requirements?countryCode=${countryCode}`);
      return {
        countryCode,
        countryName: countryCode,
        countryFlag: "🇪🇺",
        summary: "Requirements summary",
        requirements: [],
        officialPortalUrl: "",
        generalRequirements: response.map(r => r.name),
        stateRequirements: []
      } as unknown as EuCountryRequirements;
    },
    enabled: !!countryCode,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── All EU Requirements ─────────────────────────────────────────────────────

export function useAllEuRequirements() {
  return useQuery<EuCountryRequirements[]>({
    queryKey: ["eu-requirements-all"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay(mockEuRequirements);
      }
      // Assuming a generic call or we just return an empty array if not supported
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Update EU Step Mutation ─────────────────────────────────────────────────

export interface UpdateEuStepInput {
  propertyId: string;
  stepId: string;
  isCompleted: boolean;
}

export function useUpdateEuStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateEuStepInput): Promise<void> => {
      if (USE_MOCK) {
        const reg = mockEuRegistrations.find((r) => r.propertyId === input.propertyId);
        if (reg) {
          const step = reg.steps.find((s) => s.id === input.stepId);
          if (step) {
            step.isCompleted = input.isCompleted;
            step.completedAt = input.isCompleted ? new Date().toISOString() : null;
          }
        }
        return simulateDelay(undefined, 800);
      }
      
      await apiPut(`/eu-registration/${input.propertyId}/step`, {
        stepName: input.stepId,
        completed: input.isCompleted
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["eu-registration-progress", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["eu-properties"] });
      toast.success("Step updated successfully");
    },
    onError: () => {
      toast.error("Failed to update step");
    },
  });
}

// ─── Generate Registration Number Mutation ───────────────────────────────────

export interface GenerateRegistrationInput {
  propertyId: string;
  registrationNumber: string;
}

export function useGenerateRegistrationNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: GenerateRegistrationInput): Promise<{ registrationNumber: string }> => {
      if (USE_MOCK) {
        const reg = mockEuRegistrations.find((r) => r.propertyId === input.propertyId);
        if (reg) {
          reg.registrationNumber = input.registrationNumber;
          reg.status = "completed";
        }
        return simulateDelay({ registrationNumber: input.registrationNumber }, 1000);
      }
      
      const response = await apiPost<{ registrationNumber: string }>(`/eu-registration/${input.propertyId}/generate-number`, {});
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["eu-registration-progress", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["eu-properties"] });
      toast.success("Registration number saved!");
    },
    onError: () => {
      toast.error("Failed to save registration number");
    },
  });
}
