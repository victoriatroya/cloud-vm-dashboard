import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { sessionQueryKey } from "../query-keys";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      queryClient.setQueryData(sessionQueryKey, null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== sessionQueryKey[0],
      });
    },
  });
}
