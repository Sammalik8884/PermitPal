import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Property, Permit, NightCapSummary } from "@/types";

const USE_MOCK = false;

// ─── Simulated API delay ─────────────────────────────────────────────────────

function simulateDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ─── Dashboard Data Interface ────────────────────────────────────────────────

export interface DashboardStats {
  totalProperties: number;
  propertiesAddedThisMonth: number;
  activePermits: number;
  complianceScore: number;
  nightsUsed: number;
  totalNightCap: number;
}
export interface ComplianceHistoryPoint {
  month: string;
  score: number;
}
export interface PropertyAtRisk {
  id: string;
  propertyName: string;
  issue: string;
  severity: "high" | "medium";
}
export interface UpcomingDeadline {
  id: string;
  propertyName: string;
  deadlineType: string;
  date: string;
  daysRemaining: number;
}
export interface ActivityItem {
  id: string;
  propertyName?: string;
  action: string;
  date: string;
}

export interface DashboardData {
  stats: DashboardStats;
  properties: Property[];
  permits: Permit[];
  nightCaps: NightCapSummary[];
  complianceHistory: ComplianceHistoryPoint[];
  propertiesAtRisk: PropertyAtRisk[];
  upcomingDeadlines: UpcomingDeadline[];
  recentActivity: ActivityItem[];
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useDashboardData() {
  const query = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async (): Promise<DashboardData> => {
      // Fetch the dashboard summary and the full properties/permits list in parallel
      const [summary, propertiesDto, permitsDto] = await Promise.all([
        apiGet<any>("/dashboard/summary"),
        apiGet<any[]>("/properties").catch(() => []),
        apiGet<any[]>("/permits").catch(() => []),
      ]);

      // Map backend fields to frontend types
      const properties = propertiesDto.map((p: any) => ({
        ...p,
        complianceScore: p.complianceScore ?? 0,
        complianceStatus: p.complianceStatus ?? "unknown",
        jurisdictionName: p.jurisdictionName ?? "Unknown",
        bedroomCount: p.bedroomCount ?? 0,
        bathroomCount: p.bathroomCount ?? 0,
        maxGuests: p.maxGuests ?? 0,
        isActive: p.isActive ?? true,
      }));

      const permits = permitsDto.map((p: any) => ({
        ...p,
        issuedAt: p.issuedDate ?? new Date().toISOString(),
        expiresAt: p.expiryDate ?? new Date().toISOString(),
      }));

      return {
        stats: summary.stats,
        properties: properties,
        permits: permits,
        nightCaps: summary.nightCaps,
        complianceHistory: summary.complianceHistory,
        propertiesAtRisk: summary.propertiesAtRisk,
        upcomingDeadlines: summary.upcomingDeadlines,
        recentActivity: summary.recentActivity,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    stats: query.data?.stats ?? null,
    properties: query.data?.properties ?? [],
    permits: query.data?.permits ?? [],
    nightCaps: query.data?.nightCaps ?? [],
    complianceHistory: query.data?.complianceHistory ?? [],
    propertiesAtRisk: query.data?.propertiesAtRisk ?? [],
    upcomingDeadlines: query.data?.upcomingDeadlines ?? [],
    recentActivity: query.data?.recentActivity ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
