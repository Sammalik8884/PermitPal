import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockNotificationsExtended,
  mockRegulatoryChangesExtended,
  mockAlertPreferences,
  type AlertPreferences
} from "@/lib/mock-data-extended";
import { mockJurisdictions } from "@/lib/mock-data";
import type { NotificationLog, RegulatoryChange } from "@/types";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPut } from "@/lib/api";

// ─── Toggle for mock vs real API ─────────────────────────────────────────────

const USE_MOCK = false;

// ─── Simulated API delay ─────────────────────────────────────────────────────

function simulateDelay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export type NotificationType = "all" | "permit_expiry" | "night_cap_warning" | "regulatory_change" | "system";

export interface NotificationFilters {
  type?: NotificationType;
  page?: number;
  pageSize?: number;
}

export interface RegulatoryChangeFilters {
  jurisdictionId?: string | "all";
  severity?: "all" | "low" | "medium" | "high" | "critical";
}

// ─── Notifications List Hook ─────────────────────────────────────────────────

export function useNotifications(filters: NotificationFilters = {}) {
  return useQuery<{ items: NotificationLog[]; total: number; hasMore: boolean }>({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      if (USE_MOCK) {
        let result = [...mockNotificationsExtended];

        // Type filter
        if (filters.type && filters.type !== "all") {
          result = result.filter((n) => n.type === filters.type);
        }

        // Sort by most recent
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 10;
        const start = (page - 1) * pageSize;
        const paged = result.slice(start, start + pageSize);

        return simulateDelay({
          items: paged,
          total: result.length,
          hasMore: start + pageSize < result.length,
        });
      }
      
      let url = `/notifications?page=${filters.page ?? 1}&pageSize=${filters.pageSize ?? 10}`;
      if (filters.type && filters.type !== "all") {
        url += `&type=${filters.type}`;
      }
      
      const response = await apiGet<any>(url);
      
      return {
        items: response.data.map((n: any) => ({
          id: n.id,
          type: n.alertType?.toLowerCase() || "system", // Mapping AlertType to NotificationType
          title: n.subject || "Notification",
          message: n.body,
          isRead: n.status === "Delivered" || n.status === 2, // Assuming 2 is Delivered
          createdAt: n.createdAt,
          readAt: null
        })) as NotificationLog[],
        total: response.total,
        hasMore: (response.page * response.pageSize) < response.total
      };
    },
    staleTime: 1 * 60 * 1000,
  });
}

// ─── Unread Count Hook ───────────────────────────────────────────────────────

export function useUnreadCount() {
  return useQuery<number>({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      if (USE_MOCK) {
        const count = mockNotificationsExtended.filter((n) => !n.isRead).length;
        return simulateDelay(count, 200);
      }
      const response = await apiGet<{ unreadCount: number }>("/notifications/unread-count");
      return response.unreadCount;
    },
    staleTime: 30 * 1000,
  });
}

// ─── Mark As Read Mutation ───────────────────────────────────────────────────

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const notif = mockNotificationsExtended.find((n) => n.id === id);
        if (notif) {
          notif.isRead = true;
          notif.readAt = new Date().toISOString();
        }
        return simulateDelay(undefined, 200);
      }
      
      await apiPut(`/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}

// ─── Mark All As Read Mutation ───────────────────────────────────────────────

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (USE_MOCK) {
        mockNotificationsExtended.forEach((n) => {
          n.isRead = true;
          n.readAt = n.readAt ?? new Date().toISOString();
        });
        return simulateDelay(undefined, 300);
      }
      
      await apiPut("/notifications/read-all", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      toast.success("All notifications marked as read");
    },
  });
}

// ─── Regulatory Changes Hook ─────────────────────────────────────────────────

export function useRegulatoryChanges(filters: RegulatoryChangeFilters = {}) {
  return useQuery<RegulatoryChange[]>({
    queryKey: ["regulatory-changes", filters],
    queryFn: async () => {
      if (USE_MOCK) {
        let result = [...mockRegulatoryChangesExtended];

        if (filters.jurisdictionId && filters.jurisdictionId !== "all") {
          result = result.filter((r) => r.jurisdictionId === filters.jurisdictionId);
        }

        if (filters.severity && filters.severity !== "all") {
          result = result.filter((r) => r.severity === filters.severity);
        }

        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return simulateDelay(result);
      }
      return simulateDelay([]);
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Jurisdictions for filters ───────────────────────────────────────────────

export function useJurisdictions() {
  return useQuery({
    queryKey: ["jurisdictions"],
    queryFn: async () => simulateDelay(mockJurisdictions, 200),
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Alert Preferences Hook ─────────────────────────────────────────────────

export function useAlertPreferences() {
  return useQuery<AlertPreferences>({
    queryKey: ["alert-preferences"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay({ ...mockAlertPreferences });
      }
      
      const response = await apiGet<any[]>("/notifications/preferences");
      
      return mockAlertPreferences;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Update Alert Preferences Mutation ───────────────────────────────────────

export function useUpdateAlertPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: AlertPreferences): Promise<AlertPreferences> => {
      if (USE_MOCK) {
        return simulateDelay(preferences, 500);
      }
      
      // Convert front-end preferences to backend API format
      const newPreferences = [];
      
      if (preferences.permitAlerts?.email) newPreferences.push({ alertType: 0, channel: 0 }); // PermitExpiry, Email
      if (preferences.nightCapAlerts?.email) newPreferences.push({ alertType: 1, channel: 0 }); // NightCapWarning, Email
      if (preferences.regulatoryAlerts?.email) newPreferences.push({ alertType: 2, channel: 0 }); // RegulatoryChange, Email
      
      if (preferences.permitAlerts?.sms) newPreferences.push({ alertType: 0, channel: 1 }); // PermitExpiry, Sms
      if (preferences.nightCapAlerts?.sms) newPreferences.push({ alertType: 1, channel: 1 }); // NightCapWarning, Sms
      if (preferences.regulatoryAlerts?.sms) newPreferences.push({ alertType: 2, channel: 1 }); // RegulatoryChange, Sms
      
      await apiPut("/notifications/preferences", { preferences: newPreferences });
      
      return preferences;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-preferences"] });
      toast.success("Alert preferences saved");
    },
    onError: () => {
      toast.error("Failed to save preferences");
    },
  });
}
