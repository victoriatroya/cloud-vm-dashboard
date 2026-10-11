import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
}

const systemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      toggle: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    }),
    { name: "theme" },
  ),
);
