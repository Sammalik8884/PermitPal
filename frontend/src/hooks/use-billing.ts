import { useQuery, useMutation } from "@tanstack/react-query";
import {
  mockSubscription,
  mockBillingHistory,
  mockPaymentMethod,
  mockPlans,
  type SubscriptionDetail,
  type BillingInvoice,
  type PaymentMethod,
  type PlanInfo,
} from "@/lib/mock-data-extended";
import toast from "react-hot-toast";

// ─── Toggle for mock vs real API ─────────────────────────────────────────────

const USE_MOCK = true;

// ─── Simulated API delay ─────────────────────────────────────────────────────

function simulateDelay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ─── Subscription Status Hook ────────────────────────────────────────────────

export function useSubscriptionStatus() {
  return useQuery<SubscriptionDetail>({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay({ ...mockSubscription });
      }
      return simulateDelay(mockSubscription);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Plans Hook ──────────────────────────────────────────────────────────────

export function usePlans() {
  return useQuery<PlanInfo[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay([...mockPlans], 300);
      }
      return simulateDelay(mockPlans);
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Billing History Hook ────────────────────────────────────────────────────

export function useBillingHistory() {
  return useQuery<BillingInvoice[]>({
    queryKey: ["billing-history"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay([...mockBillingHistory]);
      }
      return simulateDelay([]);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Payment Method Hook ─────────────────────────────────────────────────────

export function usePaymentMethod() {
  return useQuery<PaymentMethod | null>({
    queryKey: ["payment-method"],
    queryFn: async () => {
      if (USE_MOCK) {
        return simulateDelay({ ...mockPaymentMethod });
      }
      return simulateDelay(null);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Create Checkout Mutation ────────────────────────────────────────────────

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (_planId: string): Promise<{ checkoutUrl: string }> => {
      if (USE_MOCK) {
        return simulateDelay({ checkoutUrl: "https://checkout.stripe.com/mock-session" }, 800);
      }
      throw new Error("Not implemented");
    },
    onSuccess: (data) => {
      // In real app, redirect to Stripe checkout
      toast.success("Redirecting to checkout...");
      console.log("Checkout URL:", data.checkoutUrl);
    },
    onError: () => {
      toast.error("Failed to create checkout session");
    },
  });
}

// ─── Create Portal Mutation ──────────────────────────────────────────────────

export function useCreatePortal() {
  return useMutation({
    mutationFn: async (): Promise<{ portalUrl: string }> => {
      if (USE_MOCK) {
        return simulateDelay({ portalUrl: "https://billing.stripe.com/mock-portal" }, 600);
      }
      throw new Error("Not implemented");
    },
    onSuccess: (data) => {
      toast.success("Redirecting to billing portal...");
      console.log("Portal URL:", data.portalUrl);
    },
    onError: () => {
      toast.error("Failed to open billing portal");
    },
  });
}

// ─── Cancel Subscription Mutation ────────────────────────────────────────────

export function useCancelSubscription() {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (USE_MOCK) {
        mockSubscription.cancelAtPeriodEnd = true;
        return simulateDelay(undefined, 800);
      }
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      toast.success("Subscription will be cancelled at end of billing period");
    },
    onError: () => {
      toast.error("Failed to cancel subscription");
    },
  });
}
