import { useMemo } from "react";
import {
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { vmsApi } from "../api/vms.api";
import { vmsQueryKey } from "../query-keys";
import type { Vm, VmInput } from "../types";
import {
  createTempId,
  upsertVm,
  removeVm,
  insertVmAt,
} from "@/shared/lib/vms-cache";

const updateMutationKey = ["vms", "update"] as const;

interface UpdateVmVariables {
  id: string;
  input: Partial<VmInput>;
}

export function useCreateVm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vmsApi.create,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: vmsQueryKey });

      const now = new Date().toISOString();
      const optimisticVm: Vm = {
        ...input,
        id: createTempId(),
        createdAt: now,
        updatedAt: now,
      };
      queryClient.setQueryData<Vm[]>(vmsQueryKey, (vms) =>
        upsertVm(vms, optimisticVm),
      );

      return { tempId: optimisticVm.id };
    },
    onSuccess: (vm, _input, context) => {
      queryClient.setQueryData<Vm[]>(vmsQueryKey, (vms) =>
        upsertVm(removeVm(vms, context.tempId), vm),
      );
      toast.success(`VM "${vm.name}" creada`);
    },
    onError: (error, input, context) => {
      if (context) {
        queryClient.setQueryData<Vm[]>(vmsQueryKey, (vms) =>
          removeVm(vms, context.tempId),
        );
      }
      toast.error(`No se pudo crear "${input.name}"`, {
        description: error.message,
      });
    },
  });
}

export function useUpdateVm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateMutationKey,
    mutationFn: ({ id, input }: UpdateVmVariables) => vmsApi.update(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: vmsQueryKey });

      const previous = queryClient
        .getQueryData<Vm[]>(vmsQueryKey)
        ?.find((v) => v.id === id);
      if (previous) {
        queryClient.setQueryData<Vm[]>(vmsQueryKey, (vms) =>
          upsertVm(vms, { ...previous, ...input }),
        );
      }

      return { previous };
    },
    onSuccess: (vm) => {
      queryClient.setQueryData<Vm[]>(vmsQueryKey, (vms) => upsertVm(vms, vm));
      toast.success(`VM "${vm.name}" actualizada`);
    },
    onError: (error, _variables, context) => {
      const previous = context?.previous;
      if (previous) {
        queryClient.setQueryData<Vm[]>(vmsQueryKey, (vms) =>
          upsertVm(vms, previous),
        );
      }
      toast.error("No se pudo actualizar la VM", {
        description: error.message,
      });
    },
  });
}

export function useDeleteVm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vm: Vm) => vmsApi.remove(vm.id),
    onMutate: async (vm) => {
      await queryClient.cancelQueries({ queryKey: vmsQueryKey });

      const index =
        queryClient
          .getQueryData<Vm[]>(vmsQueryKey)
          ?.findIndex((v) => v.id === vm.id) ?? 0;
      queryClient.setQueryData<Vm[]>(vmsQueryKey, (vms) =>
        removeVm(vms, vm.id),
      );

      return { index };
    },
    onSuccess: (_data, vm) => {
      toast.success(`VM "${vm.name}" eliminada`);
    },
    onError: (error, vm, context) => {
      queryClient.setQueryData<Vm[]>(vmsQueryKey, (vms) =>
        insertVmAt(vms, vm, context?.index ?? 0),
      );
      toast.error(`No se pudo eliminar "${vm.name}"`, {
        description: error.message,
      });
    },
  });
}

export function usePendingVmIds(): Set<string> {
  const ids = useMutationState({
    filters: { mutationKey: updateMutationKey, status: "pending" },
    select: (mutation) =>
      (mutation.state.variables as UpdateVmVariables | undefined)?.id,
  });

  return useMemo(() => new Set(ids.filter((id): id is string => !!id)), [ids]);
}
