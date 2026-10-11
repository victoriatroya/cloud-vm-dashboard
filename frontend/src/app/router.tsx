import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PublicOnlyRoute } from "@/features/auth/components/PublicOnlyRoute";
import { RoleRoute } from "@/features/auth/components/RoleRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { VmsPage } from "@/features/vms/pages/VmsPage";
import { VmFormPage } from "@/features/vms/pages/VmFormPage";
import { AppLayout } from "@/shared/layout/AppLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Navigate to="/dashboard" replace /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/vms", element: <VmsPage /> },
          {
            element: <RoleRoute role="ADMIN" />,
            children: [
              { path: "/vms/new", element: <VmFormPage /> },
              { path: "/vms/:id/edit", element: <VmFormPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
