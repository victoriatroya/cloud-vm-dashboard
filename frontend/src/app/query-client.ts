import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/shared/lib/http";
import { sessionQueryKey } from "@/features/auth/query-keys";

function handleUnauthorized(error: unknown) {
  const hadSession = !!queryClient.getQueryData(sessionQueryKey);

  if (error instanceof ApiError && error.status === 401 && hadSession) {
    queryClient.setQueryData(sessionQueryKey, null);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== sessionQueryKey[0],
    });
    toast.error("Tu sesión expiró. Inicia sesión de nuevo.");
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleUnauthorized }),
  mutationCache: new MutationCache({ onError: handleUnauthorized }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) =>
        failureCount < 2 &&
        (!(error instanceof ApiError) ||
          error.status === 0 ||
          error.status >= 500),
    },
  },
});
