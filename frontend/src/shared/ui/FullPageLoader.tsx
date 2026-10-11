import { Loader2 } from "lucide-react";

export function FullPageLoader() {
  return (
    <div
      className="grid min-h-screen place-items-center"
      role="status"
      aria-label="Cargando"
    >
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );
}
