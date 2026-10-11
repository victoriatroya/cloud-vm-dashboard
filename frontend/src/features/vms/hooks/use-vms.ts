import { useQuery } from "@tanstack/react-query";
import { vmsApi } from "../api/vms.api";
import { vmsQueryKey } from "../query-keys";

export function useVms() {
  return useQuery({
    queryKey: vmsQueryKey,
    queryFn: vmsApi.list,
  });
}
