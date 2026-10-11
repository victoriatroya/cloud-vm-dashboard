import { Navigate, Outlet } from "react-router";
import { useSession } from "../hooks/use-session";
import type { Role } from "../types";

export function RoleRoute({ role }: { role: Role }) {
  const { data: user } = useSession();

  if (user?.role !== role) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
