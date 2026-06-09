import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockUserProfile,
  mockOrganisation,
  mockActiveSessions,
  type UserProfile,
  type OrganisationDetail,
  type TeamMember,
  type ActiveSession,
} from "@/lib/mock-data-extended";
import toast from "react-hot-toast";

// ─── Toggle for mock vs real API ─────────────────────────────────────────────

const USE_MOCK = true;

// ─── Simulated API delay ─────────────────────────────────────────────────────

function simulateDelay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ─── Profile Hook ────────────────────────────────────────────────────────────

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay({ ...mockUserProfile });
      }
      return simulateDelay(mockUserProfile);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Update Profile Mutation ─────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>): Promise<UserProfile> => {
      if (USE_MOCK) {
        const updated = { ...mockUserProfile, ...data };
        Object.assign(mockUserProfile, updated);
        return simulateDelay(updated, 600);
      }
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
}

// ─── Organisation Hook ───────────────────────────────────────────────────────

export function useOrganisation() {
  return useQuery<OrganisationDetail>({
    queryKey: ["organisation"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay({ ...mockOrganisation, members: [...mockOrganisation.members] });
      }
      return simulateDelay(mockOrganisation);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Invite Member Mutation ──────────────────────────────────────────────────

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; role: TeamMember["role"] }): Promise<TeamMember> => {
      if (USE_MOCK) {
        const newMember: TeamMember = {
          id: `user-${Date.now()}`,
          firstName: data.email.split("@")[0],
          lastName: "",
          email: data.email,
          role: data.role,
          avatarUrl: null,
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
        mockOrganisation.members.push(newMember);
        return simulateDelay(newMember, 600);
      }
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisation"] });
      toast.success("Invitation sent successfully");
    },
    onError: () => {
      toast.error("Failed to send invitation");
    },
  });
}

// ─── Remove Member Mutation ──────────────────────────────────────────────────

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockOrganisation.members.findIndex((m) => m.id === memberId);
        if (index > -1) {
          mockOrganisation.members.splice(index, 1);
        }
        return simulateDelay(undefined, 500);
      }
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisation"] });
      toast.success("Member removed");
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });
}

// ─── Change Password Mutation ────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: async (_data: {
      currentPassword: string;
      newPassword: string;
    }): Promise<void> => {
      if (USE_MOCK) {
        return simulateDelay(undefined, 800);
      }
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });
}

// ─── Active Sessions Hook ────────────────────────────────────────────────────

export function useActiveSessions() {
  return useQuery<ActiveSession[]>({
    queryKey: ["active-sessions"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay([...mockActiveSessions]);
      }
      return simulateDelay([]);
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Revoke Session Mutation ─────────────────────────────────────────────────

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockActiveSessions.findIndex((s) => s.id === sessionId);
        if (index > -1) {
          mockActiveSessions.splice(index, 1);
        }
        return simulateDelay(undefined, 400);
      }
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
      toast.success("Session revoked");
    },
    onError: () => {
      toast.error("Failed to revoke session");
    },
  });
}

// ─── Revoke All Sessions Mutation ────────────────────────────────────────────

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (USE_MOCK) {
        // Keep only current session
        const current = mockActiveSessions.find((s) => s.isCurrent);
        mockActiveSessions.length = 0;
        if (current) mockActiveSessions.push(current);
        return simulateDelay(undefined, 500);
      }
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
      toast.success("All other sessions revoked");
    },
    onError: () => {
      toast.error("Failed to revoke sessions");
    },
  });
}
