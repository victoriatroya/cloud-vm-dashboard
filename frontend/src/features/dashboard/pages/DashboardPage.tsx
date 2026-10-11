import { useMemo } from "react";
import {
  AlertTriangle,
  Cpu,
  HardDrive,
  MemoryStick,
  Power,
  ServerOff,
} from "lucide-react";
import { useVms } from "@/features/vms/hooks/use-vms";
import { computeResourceTotals, formatGb } from "@/features/vms/lib/resources";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Skeleton } from "@/shared/ui/Skeleton";
import { ResourceChart } from "../components/ResourceChart";
import { StatCard } from "../components/StatCard";
import { StatusDonut } from "../components/StatusDonut";

function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Cargando dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data: vms, isPending, isError, refetch } = useVms();
  const totals = useMemo(() => computeResourceTotals(vms ?? []), [vms]);

  const renderContent = () => {
    if (isPending) return <DashboardSkeleton />;

    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          title="No pudimos cargar el dashboard"
          action={<Button onClick={() => void refetch()}>Reintentar</Button>}
        />
      );
    }

    if (vms.length === 0) {
      return (
        <EmptyState
          icon={ServerOff}
          title="Sin datos todavía"
          description="Las métricas aparecerán cuando exista al menos una VM."
        />
      );
    }

    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Power}
            label="VMs encendidas"
            value={`${totals.running}/${totals.total}`}
            hint="Del inventario total"
          />
          <StatCard
            icon={Cpu}
            label="Cores asignados"
            value={totals.cores}
            hint="VMs activas"
          />
          <StatCard
            icon={MemoryStick}
            label="RAM asignada"
            value={formatGb(totals.ramGb)}
            hint="VMs activas"
          />
          <StatCard
            icon={HardDrive}
            label="Disco asignado"
            value={formatGb(totals.diskGb)}
            hint="VMs activas"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ResourceChart vms={vms} />
          </div>
          <StatusDonut running={totals.running} total={totals.total} />
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Uso de recursos asignados a las VMs encendidas"
      />
      {renderContent()}
    </div>
  );
}
