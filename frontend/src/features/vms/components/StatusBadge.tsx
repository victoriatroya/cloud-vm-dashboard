import { cn } from "@/shared/lib/cn";
import { STATUS_LABEL, type VmStatus } from "../types";

export function StatusBadge({ status }: { status: VmStatus }) {
  const isRunning = status === "RUNNING";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isRunning
          ? "bg-success/10 text-success"
          : "bg-surface-muted text-text-muted",
      )}
    >
      <span className="relative flex size-2">
        {isRunning && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
        )}
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full",
            isRunning ? "bg-success" : "bg-text-muted",
          )}
        />
      </span>
      {STATUS_LABEL[status]}
    </span>
  );
}
