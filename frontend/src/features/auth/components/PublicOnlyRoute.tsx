import { Navigate, Outlet, useLocation } from "react-router";
import { FullPageLoader } from "@/shared/ui/FullPageLoader";
import { useSession } from "../hooks/use-session";

interface LocationState {
  from?: { pathname?: string };
}

export function PublicOnlyRoute() {
  const { data: user, isPending } = useSession();
  const location = useLocation();

  if (isPending) return <FullPageLoader />;

  if (user) {
    const from = (location.state as LocationState | null)?.from?.pathname;
    return <Navigate to={from ?? "/dashboard"} replace />;
  }

  return <Outlet />;
}
