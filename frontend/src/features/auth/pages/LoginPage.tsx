import { Cloud } from "lucide-react";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Cloud className="size-6" />
          CloudVM
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-semibold leading-tight">
            Gestiona tu infraestructura
            <br />
            en tiempo real.
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Crea, monitorea y controla tus máquinas virtuales desde un solo
            panel.
          </p>
        </div>
        <p className="text-sm text-white/60">© 2026 CloudVM</p>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-white/10 blur-3xl"
        />
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
              <p className="mt-1 text-sm text-text-muted">
                Accede a tu panel de VMs
              </p>
            </div>
            <ThemeToggle />
          </div>
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
