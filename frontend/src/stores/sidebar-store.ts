import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
  setMobileOpen: (value: boolean) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COLLAPSED_STORAGE_KEY = "permitpal_sidebar_collapsed";

function loadCollapsedState(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
}

function persistCollapsedState(collapsed: boolean): void {
  localStorage.setItem(COLLAPSED_STORAGE_KEY, String(collapsed));
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isCollapsed: loadCollapsedState(),
  isMobileOpen: false,

  toggle: () => {
    const newValue = !get().isCollapsed;
    persistCollapsedState(newValue);
    set({ isCollapsed: newValue });
  },

  setCollapsed: (value: boolean) => {
    persistCollapsedState(value);
    set({ isCollapsed: value });
  },

  setMobileOpen: (value: boolean) => {
    set({ isMobileOpen: value });
  },
}));
