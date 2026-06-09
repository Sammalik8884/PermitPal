import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockNightCaps,
  mockBookedNights,
  mockMonthlyBreakdowns,
  mockICalFeeds,
  mockFeedPreviewEvents,
  mockProperties,
  type MockBookedNight,
  type MockICalFeed,
  type MonthlyBreakdown,
  type FeedPreviewEvent,
} from "@/lib/mock-data";
import type { NightCapSummary } from "@/types";
import { generateId } from "@/lib/utils";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

// ─── Toggle for mock vs real API ─────────────────────────────────────────────

const USE_MOCK = false;

// ─── Simulated API delay ─────────────────────────────────────────────────────

function simulateDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ─── Night Cap Detail (extended) ─────────────────────────────────────────────

export interface NightCapDetail extends NightCapSummary {
  propertyName: string;
  jurisdictionName: string;
  lastSyncAt: string | null;
  monthlyBreakdown: MonthlyBreakdown["months"];
}

// ─── Night Cap Summaries Hook ────────────────────────────────────────────────

export function useNightCapSummaries(year: number) {
  return useQuery<NightCapDetail[]>({
    queryKey: ["night-cap-summaries", year],
    queryFn: async () => {
      try {
        const response = await apiGet<any[]>(`/nightcaps/summaries?year=${year}`);
        
        return response.map(s => {
          return {
            propertyId: s.propertyId,
            year: s.year,
            nightCap: s.nightCap || 0,
            nightsUsed: s.nightsUsed,
            nightsRemaining: s.nightsRemaining || 0,
            percentage: s.percentage,
            status: s.status,
            propertyName: s.propertyName || "Unknown Property", 
            jurisdictionName: s.jurisdictionName || "Unknown Jurisdiction", 
            lastSyncAt: null, // Would come from feeds
            monthlyBreakdown: [] // Handled via separate chart fetch or mock if not provided
          };
        }) as NightCapDetail[];
      } catch (e) {
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Night Cap Detail Hook ───────────────────────────────────────────────────

export function useNightCapDetail(propertyId: string | undefined, year: number) {
  return useQuery<NightCapDetail | null>({
    queryKey: ["night-cap-detail", propertyId, year],
    queryFn: async () => {
      if (!propertyId) return null;
      
      try {
        const response = await apiGet<any>(`/nightcaps/summary?propertyId=${propertyId}&year=${year}`);
        const property = mockProperties.find(p => p.id === propertyId);
        
        return {
          propertyId: response.propertyId,
          year: response.year,
          nightCap: response.nightCap || 0,
          nightsUsed: response.nightsUsed,
          nightsRemaining: response.nightsRemaining || 0,
          percentage: response.percentage,
          status: response.status,
          propertyName: response.propertyName || "Unknown Property", 
          jurisdictionName: response.jurisdictionName || "Unknown Jurisdiction", 
          lastSyncAt: null,
          monthlyBreakdown: [] 
        } as NightCapDetail;
      } catch (e) {
        return null;
      }
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Booked Nights Hook ──────────────────────────────────────────────────────

export function useBookedNights(
  propertyId: string | undefined,
  year: number,
  month?: number
) {
  return useQuery<MockBookedNight[]>({
    queryKey: ["booked-nights", propertyId, year, month],
    queryFn: async () => {
      if (!propertyId) return [];
      
      try {
        const response = await apiGet<any[]>(`/nightcaps/booked?propertyId=${propertyId}&year=${year}&month=${month || 1}`);
        return response.map(bn => ({
          id: bn.id,
          propertyId: bn.propertyId,
          date: bn.nightDate,
          source: bn.source,
          guestName: bn.guestName,
          notes: bn.notes
        }));
      } catch (e) {
        return [];
      }
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── iCal Feeds Hook ─────────────────────────────────────────────────────────

export function useICalFeeds(propertyId: string | undefined) {
  return useQuery<MockICalFeed[]>({
    queryKey: ["ical-feeds", propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      try {
        const response = await apiGet<any[]>(`/icalfeeds?propertyId=${propertyId}`);
        return response.map(f => ({
          id: f.id,
          propertyId: propertyId,
          feedUrl: "", // Url typically not returned in summary for security/size, but can map if available
          source: f.platform,
          label: f.platform,
          isActive: true,
          lastSyncAt: f.lastSyncedAt,
          lastSyncStatus: f.lastSyncStatus,
          syncErrorMessage: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      } catch (e) {
        return [];
      }
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── All iCal Feeds Hook ─────────────────────────────────────────────────────

export function useAllICalFeeds() {
  return useQuery<MockICalFeed[]>({
    queryKey: ["ical-feeds-all"],
    queryFn: async () => {
      return []; // Real backend doesn't have a global GetAll yet without propertyId
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Add Manual Nights Mutation ──────────────────────────────────────────────

export interface AddManualNightsInput {
  propertyId: string;
  dates: string[];
  guestName?: string;
  notes?: string;
}

export function useAddManualNights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddManualNightsInput): Promise<void> => {
      await apiPost("/nightcaps/manual", {
        propertyId: input.propertyId,
        dates: input.dates,
        guestName: input.guestName
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booked-nights", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["night-cap-summaries"] });
      queryClient.invalidateQueries({ queryKey: ["night-cap-detail", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["property-nightcap", variables.propertyId] });
      toast.success(`Added ${variables.dates.length} manual night(s)`);
    },
    onError: () => {
      toast.error("Failed to add manual nights");
    },
  });
}

// ─── Create Feed Mutation ────────────────────────────────────────────────────

export interface CreateFeedInput {
  propertyId: string;
  feedUrl: string;
  source: "airbnb" | "vrbo" | "booking" | "other";
  label: string;
}

export function useCreateFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateFeedInput): Promise<MockICalFeed> => {
      const response = await apiPost<any>("/icalfeeds", {
        propertyId: input.propertyId,
        feedUrl: input.feedUrl,
        source: input.source,
        label: input.label
      });
      return {
        id: response.id,
        propertyId: response.propertyId,
        feedUrl: response.iCalUrl,
        source: response.platform,
        label: response.label ?? response.platform,
        isActive: true,
        lastSyncAt: null,
        lastSyncStatus: response.lastSyncStatus,
        syncErrorMessage: null,
        createdAt: response.createdAt,
        updatedAt: response.createdAt,
      };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ical-feeds", variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ["ical-feeds-all"] });
      toast.success("Feed added successfully");
    },
    onError: () => {
      toast.error("Failed to add feed");
    },
  });
}

// ─── Delete Feed Mutation ────────────────────────────────────────────────────

export function useDeleteFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedId: string): Promise<void> => {
      await apiDelete(`/icalfeeds/${feedId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ical-feeds"] });
      queryClient.invalidateQueries({ queryKey: ["ical-feeds-all"] });
      toast.success("Feed deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete feed");
    },
  });
}

// ─── Sync Feed Mutation ──────────────────────────────────────────────────────

export function useSyncFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedId: string): Promise<{ nightsSynced: number }> => {
      const res = await apiPost<any>(`/icalfeeds/${feedId}/sync`);
      return { nightsSynced: res.nightsSynced };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ical-feeds"] });
      queryClient.invalidateQueries({ queryKey: ["booked-nights"] });
      queryClient.invalidateQueries({ queryKey: ["night-cap-summaries"] });
      queryClient.invalidateQueries({ queryKey: ["property-nightcap"] });
      toast.success(`Synced ${data.nightsSynced} new night(s)`);
    },
    onError: () => {
      toast.error("Failed to sync feed");
    },
  });
}

// ─── Preview Feed Hook ───────────────────────────────────────────────────────

export function usePreviewFeed(url: string | undefined) {
  return useQuery<FeedPreviewEvent[]>({
    queryKey: ["feed-preview", url],
    queryFn: async () => {
      if (!url) return [];
      try {
        const response = await apiPost<any[]>("/icalfeeds/preview", { feedUrl: url });
        return response.map(e => ({
          uid: e.uid || "",
          summary: e.summary,
          startDate: e.startDate,
          endDate: e.endDate,
          nightsCount: e.nightCount || 0,
          status: e.status || "confirmed"
        }));
      } catch (e) {
        return [];
      }
    },
    enabled: !!url && url.length > 10,
    staleTime: 0, // Always refetch preview
  });
}

// ─── Helper ──────────────────────────────────────────────────────────────────

const jurisdictionLabels: Record<string, string> = {
  "jur-us-ca-la": "Los Angeles, CA (365-night cap)",
  "jur-fr-idf-paris": "Paris, France (120-night cap)",
  "jur-au-nsw-sydney": "Sydney, NSW (180-night cap)",
  "jur-ch-vs-zermatt": "Zermatt, Switzerland (90-night cap)",
  "jur-us-ny-nyc": "New York City, NY (365-night cap)",
  "jur-es-cat-bcn": "Barcelona, Spain (365-night cap)",
  "jur-au-vic-melb": "Melbourne, VIC (180-night cap)",
};

function getJurisdictionLabel(jurisdictionId: string | undefined): string {
  if (!jurisdictionId) return "Unknown Jurisdiction";
  return jurisdictionLabels[jurisdictionId] ?? "Unknown Jurisdiction";
}
