import type { Vm } from '@prisma/client';
import type { AuthUser } from '../auth/types/auth-user';

export interface ServerToClientEvents {
  'vm:created': (vm: Vm) => void;
  'vm:updated': (vm: Vm) => void;
  'vm:deleted': (payload: { id: string }) => void;
}

export type ClientToServerEvents = Record<string, never>;

export interface SocketData {
  user: AuthUser;
}
