import { io, type Socket } from "socket.io-client";
import type { Vm } from "@/features/vms/types";

interface ServerToClientEvents {
  "vm:created": (vm: Vm) => void;
  "vm:updated": (vm: Vm) => void;
  "vm:deleted": (payload: { id: string }) => void;
}

type ClientToServerEvents = Record<string, never>;

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocket(): AppSocket {
  return io({ withCredentials: true, autoConnect: false });
}
