import { http } from "@/shared/lib/http";
import type { Vm, VmInput } from "../types";

export const vmsApi = {
  list: () => http.get<Vm[]>("/vms"),
  create: (input: VmInput) => http.post<Vm>("/vms", input),
  update: (id: string, input: Partial<VmInput>) =>
    http.put<Vm>(`/vms/${id}`, input),
  remove: (id: string) => http.delete(`/vms/${id}`),
};
