import { cn } from "@/shared/lib/cn";
import { useRealtimeStore, type RealtimeStatus } from "../realtime.store";

const STATUS_CONFIG: Record<RealtimeStatus, { label: string; dot: string }> = {
  connected: { label: "En vivo", dot: "bg-success" },
  connecting: { label: "Conectando…", dot: "bg-warning" },
  reconnecting: { label: "Reconectando…", dot: "bg-warning" },
  offline: { label: "Sin conexión", dot: "bg-danger" },
};

export function ConnectionStatus() {
  const status = useRealtimeStore((s) => s.status);
  const { label, dot } = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      aria-live="polite"
      className="hidden items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-text-muted sm:inline-flex"
    >
      <span className="relative flex size-2">
        {status === "connected" && (
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-60",
              dot,
            )}
          />
        )}
        <span className={cn("relative inline-flex size-2 rounded-full", dot)} />
      </span>
      {label}
    </span>
  );
}
