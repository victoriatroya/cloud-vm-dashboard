import type { ReactNode } from "react";
import { useSession } from "../hooks/use-session";
import type { Role } from "../type";

export function Can({ role, children }: { role: Role; children: ReactNode }) {
  const { data: user } = useSession();
  return user?.role === role ? <>{children}</> : null;
}
