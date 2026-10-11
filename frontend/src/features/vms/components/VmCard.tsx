import type { ReactNode } from "react";
import {
  Cpu,
  HardDrive,
  Loader2,
  MemoryStick,
  Server,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { formatGb } from "../lib/resources";
import { OS_LABEL, type Vm } from "../types";
import { StatusBadge } from "./StatusBadge";

interface VmCardProps {
  vm: Vm;
  actions?: ReactNode;
  pending?: boolean;
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-surface-muted p-3">
      <dt className="flex items-center gap-1.5 text-xs text-text-muted">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}

export function VmCard({ vm, actions, pending = false }: VmCardProps) {
  return (
    <article
      aria-busy={pending}
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-sm transition",
        pending ? "opacity-70" : "hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Server className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{vm.name}</h3>
            <p className="text-xs text-text-muted">{OS_LABEL[vm.os]}</p>
          </div>
        </div>
        <StatusBadge status={vm.status} />
      </header>

      <dl className="mt-5 grid grid-cols-3 gap-2">
        <Spec icon={Cpu} label="Cores" value={vm.cores} />
        <Spec icon={MemoryStick} label="RAM" value={formatGb(vm.ramGb)} />
        <Spec icon={HardDrive} label="Disco" value={formatGb(vm.diskGb)} />
      </dl>

      {pending ? (
        <footer className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4 text-xs text-text-muted">
          <Loader2 className="size-3.5 animate-spin" />
          Guardando…
        </footer>
      ) : (
        actions && (
          <footer className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
            {actions}
          </footer>
        )
      )}
    </article>
  );
}
