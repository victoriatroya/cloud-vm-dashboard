import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Search,
  SearchX,
  ServerOff,
  Trash2,
} from "lucide-react";
import { Can } from "@/features/auth/components/Can";
import { useIsAdmin } from "@/features/auth/hooks/use-session";
import { useRealtimeStore } from "@/features/realtime/realtime.store";
import { Button } from "@/shared/ui/Button";
import { buttonClass } from "@/shared/ui/button-styles";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { SegmentedControl } from "@/shared/ui/SegmentedControl";
import { VmCard } from "../components/VmCard";
import { VmGridSkeleton } from "../components/VmGridSkeleton";
import {
  useDeleteVm,
  usePendingVmIds,
  useUpdateVm,
} from "../hooks/use-vm-mutations";
import { useVms } from "../hooks/use-vms";
import type { Vm, VmStatus } from "../types";
import { isTempVm } from "@/shared/lib/vms-cache";

type StatusFilter = "ALL" | VmStatus;

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todas" },
  { value: "RUNNING", label: "Encendidas" },
  { value: "STOPPED", label: "Apagadas" },
] as const;

export function VmsPage() {
  const { data: vms, isPending, isError, refetch } = useVms();
  const isAdmin = useIsAdmin();
  const pendingIds = usePendingVmIds();
  const highlights = useRealtimeStore((s) => s.highlights);
  const updateVm = useUpdateVm();
  const deleteVm = useDeleteVm();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [vmToDelete, setVmToDelete] = useState<Vm | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (vms ?? []).filter(
      (vm) =>
        (status === "ALL" || vm.status === status) && vm.name.includes(term),
    );
  }, [vms, search, status]);

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
  };

  const togglePower = (vm: Vm) => {
    updateVm.mutate({
      id: vm.id,
      input: { status: vm.status === "RUNNING" ? "STOPPED" : "RUNNING" },
    });
  };

  const confirmDelete = () => {
    if (vmToDelete) deleteVm.mutate(vmToDelete);
    setVmToDelete(null);
  };

  const renderActions = (vm: Vm) => {
    if (!isAdmin) return undefined;

    const isRunning = vm.status === "RUNNING";

    return (
      <>
        <Button
          variant="ghost"
          className={
            isRunning
              ? "px-3 py-1.5 hover:bg-warning/10 hover:text-warning"
              : "px-3 py-1.5 hover:bg-success/10 hover:text-success"
          }
          onClick={() => togglePower(vm)}
        >
          {isRunning ? (
            <PowerOff className="size-4" />
          ) : (
            <Power className="size-4" />
          )}
          {isRunning ? "Apagar" : "Encender"}
        </Button>
        <div className="flex gap-1">
          <Link
            to={`/vms/${vm.id}/edit`}
            className={buttonClass("ghost", "px-2.5 py-1.5")}
            aria-label={`Editar ${vm.name}`}
            title="Editar"
          >
            <Pencil className="size-4" />
          </Link>
          <Button
            variant="ghost"
            className="px-2.5 py-1.5 hover:bg-danger/10 hover:text-danger"
            onClick={() => setVmToDelete(vm)}
            aria-label={`Eliminar ${vm.name}`}
            title="Eliminar"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </>
    );
  };

  const renderContent = () => {
    if (isPending) return <VmGridSkeleton />;

    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          title="No pudimos cargar las VMs"
          description="Revisa tu conexión e intenta de nuevo."
          action={<Button onClick={() => void refetch()}>Reintentar</Button>}
        />
      );
    }

    if (vms.length === 0) {
      return (
        <EmptyState
          icon={ServerOff}
          title="Aún no hay máquinas virtuales"
          description="Cuando se cree la primera VM, aparecerá aquí."
          action={
            <Can role="ADMIN">
              <Link to="/vms/new" className={buttonClass("primary")}>
                <Plus className="size-4" />
                Crear la primera VM
              </Link>
            </Can>
          }
        />
      );
    }

    if (filtered.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="Sin resultados"
          description="Ninguna VM coincide con los filtros aplicados."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          }
        />
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vm) => (
          <VmCard
            key={vm.id}
            vm={vm}
            pending={isTempVm(vm) || pendingIds.has(vm.id)}
            highlightKey={highlights[vm.id]}
            actions={renderActions(vm)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Máquinas virtuales"
        description={
          vms ? `${vms.length} VMs en total` : "Cargando inventario..."
        }
        actions={
          <Can role="ADMIN">
            <Link to="/vms/new" className={buttonClass("primary")}>
              <Plus className="size-4" />
              Nueva VM
            </Link>
          </Can>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            aria-label="Buscar VM por nombre"
            className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <SegmentedControl<StatusFilter>
          label="Filtrar por estado"
          options={STATUS_OPTIONS}
          value={status}
          onChange={setStatus}
        />
      </div>

      {renderContent()}

      <ConfirmDialog
        open={vmToDelete !== null}
        title="¿Eliminar esta VM?"
        description={
          <>
            Se eliminará{" "}
            <strong className="text-text">{vmToDelete?.name}</strong>. Esta
            acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setVmToDelete(null)}
      />
    </div>
  );
}
