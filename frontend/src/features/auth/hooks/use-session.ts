import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/shared/lib/http";
import { authApi } from "../api/auth.api";
import { sessionQueryKey } from "../query-keys";
import type { User } from "../type";

export function useSession() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: async (): Promise<User | null> => {
      try {
        return await authApi.me();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
  });
}

export function useCurrentUser(): User {
  const { data } = useSession();
  if (!data)
    throw new Error("useCurrentUser debe usarse dentro de una ruta protegida");
  return data;
}

export function useIsAdmin(): boolean {
  const { data } = useSession();
  return data?.role === "ADMIN";
}
