import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────────────────────

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const THEME_STORAGE_KEY = "permitpal_theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "system") return getSystemTheme();
  return theme;
}

function applyThemeToDocument(resolvedTheme: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
}

function loadPersistedTheme(): Theme {
  if (typeof localStorage === "undefined") return "system";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

// ─── Store ───────────────────────────────────────────────────────────────────

const initialTheme = loadPersistedTheme();
const initialResolved = resolveTheme(initialTheme);

// Apply theme immediately on load
applyThemeToDocument(initialResolved);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  resolvedTheme: initialResolved,

  setTheme: (theme: Theme) => {
    const resolved = resolveTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyThemeToDocument(resolved);
    set({ theme, resolvedTheme: resolved });
  },
}));

// ─── System Preference Listener ──────────────────────────────────────────────

if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleSystemChange = () => {
    const state = useThemeStore.getState();
    if (state.theme === "system") {
      const resolved = getSystemTheme();
      applyThemeToDocument(resolved);
      useThemeStore.setState({ resolvedTheme: resolved });
    }
  };

  mediaQuery.addEventListener("change", handleSystemChange);
}
