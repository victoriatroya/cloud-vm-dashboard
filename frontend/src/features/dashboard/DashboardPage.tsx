import { Can } from "@/features/auth/components/Can";
import { useCurrentUser } from "@/features/auth/hooks/use-session";

export function DashboardPage() {
  const user = useCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Hola, {user.name}</h1>
      <p className="mt-1 text-text-muted">
        El dashboard viene en la siguiente fase.
      </p>
      <Can role="ADMIN">
        <p className="mt-4 text-primary">
          Este texto solo lo ve el administrador.
        </p>
      </Can>
    </div>
  );
}
