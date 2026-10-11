import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sessionQueryKey } from "@/features/auth/query-keys";
import { vmsQueryKey } from "@/features/vms/query-keys";
import type { Vm } from "@/features/vms/types";
import { createSocket } from "../lib/socket";
import { useRealtimeStore } from "../realtime.store";
import { upsertVm, removeTempByName, removeVm } from "@/shared/lib/vms-cache";

export function useVmRealtime() {
  const queryClient = useQueryClient();
  const setStatus = useRealtimeStore((s) => s.setStatus);
  const highlight = useRealtimeStore((s) => s.highlight);

  useEffect(() => {
    const socket = createSocket();
    let hasConnectedBefore = false;

    const updateVms = (updater: (vms: Vm[]) => Vm[]) =>
      queryClient.setQueryData<Vm[]>(vmsQueryKey, (vms) =>
        vms ? updater(vms) : vms,
      );

    socket.on("connect", () => {
      setStatus("connected");
      if (hasConnectedBefore)
        void queryClient.invalidateQueries({ queryKey: vmsQueryKey });
      hasConnectedBefore = true;
    });

    socket.on("disconnect", (reason) => {
      setStatus(reason === "io client disconnect" ? "offline" : "reconnecting");
    });

    socket.on("connect_error", () => {
      if (socket.active) {
        setStatus("reconnecting");
        return;
      }
      setStatus("offline");
      void queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    });

    socket.on("vm:created", (vm) => {
      updateVms((vms) => upsertVm(removeTempByName(vms, vm.name), vm));
      highlight(vm.id);
    });

    socket.on("vm:updated", (vm) => {
      updateVms((vms) => upsertVm(vms, vm));
      highlight(vm.id);
    });

    socket.on("vm:deleted", ({ id }) => {
      updateVms((vms) => removeVm(vms, id));
    });

    setStatus("connecting");
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [queryClient, setStatus, highlight]);
}
