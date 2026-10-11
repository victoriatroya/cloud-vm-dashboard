import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ShieldCheck, User } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useLogin } from "../hooks/use-login";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

const DEMO_USERS = [
  {
    label: "Administrador",
    email: "admin@demo.com",
    password: "Admin123!",
    icon: ShieldCheck,
  },
  {
    label: "Cliente",
    email: "cliente@demo.com",
    password: "Cliente123!",
    icon: User,
  },
] as const;

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => login.mutate(values));

  const fillDemo = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
  };

  return (
    <form onSubmit={(e) => void onSubmit(e)} noValidate className="space-y-5">
      {login.error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
        >
          <AlertCircle className="size-4 shrink-0" />
          {login.error.message}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="tu@empresa.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" className="w-full" loading={login.isPending}>
        Iniciar sesión
      </Button>

      <div className="rounded-xl border border-dashed border-border p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
          Credenciales de prueba
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_USERS.map(({ label, email, password, icon: Icon }) => (
            <Button
              key={email}
              variant="secondary"
              onClick={() => fillDemo(email, password)}
            >
              <Icon className="size-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </form>
  );
}
