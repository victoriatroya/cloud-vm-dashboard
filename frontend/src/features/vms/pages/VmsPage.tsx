import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  Pencil,
  Plus,
  Search,
  SearchX,
  ServerOff,
} from "lucide-react";
import { Can } from "@/features/auth/components/Can";
import { Button } from "@/shared/ui/Button";
import { buttonClass } from "@/shared/ui/button-styles";
import { EmptyState } from "@/shared/ui/EmptyState";
import { SegmentedControl } from "@/shared/ui/SegmentedControl";
import { VmCard } from "../components/VmCard";
import { VmGridSkeleton } from "../components/VmGridSkeleton";
import { useVms } from "../hooks/use-vms";
import type { VmStatus } from "../types";
import { PageHeader } from "@/shared/ui/PageHeader";

type StatusFilter = "ALL" | VmStatus;

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todas" },
  { value: "RUNNING", label: "Encendidas" },
  { value: "STOPPED", label: "Apagadas" },
] as const;

export function VmsPage() {
  const { data: vms, isPending, isError, refetch } = useVms();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

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
            actions={
              <Can role="ADMIN">
                <Link
                  to={`/vms/${vm.id}/edit`}
                  className={buttonClass("ghost", "px-3 py-1.5")}
                >
                  <Pencil className="size-4" />
                  Editar
                </Link>
              </Can>
            }
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
    </div>
  );
}
