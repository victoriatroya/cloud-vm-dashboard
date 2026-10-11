import { Navigate, Outlet, useLocation } from "react-router";
import { FullPageLoader } from "@/shared/ui/FullPageLoader";
import { useSession } from "../hooks/use-session";

export function ProtectedRoute() {
  const { data: user, isPending } = useSession();
  const location = useLocation();

  if (isPending) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
