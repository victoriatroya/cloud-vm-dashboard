import { NavLink, Outlet } from "react-router";
import { Cloud, LayoutDashboard, LogOut, Server } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { useCurrentUser } from "@/features/auth/hooks/use-session";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { ROLE_LABEL } from "@/features/auth/types";
import { ConnectionStatus } from "@/features/realtime/components/ConnectionStatus";
import { useVmRealtime } from "@/features/realtime/hooks/use-vm-realtime";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/vms", label: "Máquinas virtuales", icon: Server },
];

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-text-muted hover:bg-surface-muted hover:text-text",
  );
}

export function AppLayout() {
  const user = useCurrentUser();
  const logout = useLogout();

  useVmRealtime();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-border bg-surface md:flex md:flex-col">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-primary to-violet-500 text-white">
            <Cloud className="size-5" />
          </div>
          <span className="font-semibold">CloudVM</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navClass}>
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-bg/80 px-4 py-3 backdrop-blur md:px-8">
          <nav className="flex gap-1 md:hidden">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={navClass} aria-label={label}>
                <Icon className="size-4" />
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <ConnectionStatus />
            <ThemeToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-text-muted">{ROLE_LABEL[user.role]}</p>
            </div>
            <Button
              variant="ghost"
              className="px-2.5"
              onClick={() => logout.mutate()}
              loading={logout.isPending}
              aria-label="Cerrar sesión"
            >
              {!logout.isPending && <LogOut className="size-4" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
