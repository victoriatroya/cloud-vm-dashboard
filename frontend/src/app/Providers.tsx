import { useEffect, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useThemeStore } from "@/shared/stores/theme.store";
import { queryClient } from "./query-client";

export function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster theme={theme} position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
