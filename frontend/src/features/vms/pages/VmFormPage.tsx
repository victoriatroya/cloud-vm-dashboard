import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, SearchX } from "lucide-react";
import { buttonClass } from "@/shared/ui/button-styles";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { Skeleton } from "@/shared/ui/Skeleton";
import { VmForm } from "../components/VmForm";
import { useCreateVm, useUpdateVm } from "../hooks/use-vm-mutations";
import { useVms } from "../hooks/use-vms";
import type { VmFormValues } from "../schemas/vm.schema";
import type { Vm } from "../types";

const DEFAULT_VALUES: VmFormValues = {
  name: "",
  cores: 2,
  ramGb: 4,
  diskGb: 50,
  os: "UBUNTU",
  status: "STOPPED",
};

const toFormValues = ({
  name,
  cores,
  ramGb,
  diskGb,
  os,
  status,
}: Vm): VmFormValues => ({
  name,
  cores,
  ramGb,
  diskGb,
  os,
  status,
});

export function VmFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vms, isPending } = useVms();
  const createVm = useCreateVm();
  const updateVm = useUpdateVm();

  const vm = vms?.find((v) => v.id === id);
  const isEdit = !!id;

  const takenNames = useMemo(
    () => (vms ?? []).filter((v) => v.id !== id).map((v) => v.name),
    [vms, id],
  );

  const goBack = () => void navigate("/vms");

  const handleSubmit = (values: VmFormValues) => {
    if (vm) updateVm.mutate({ id: vm.id, input: values });
    else createVm.mutate(values);
    goBack(); // No esperamos al servidor: la caché ya refleja el cambio
  };

  if (isEdit && isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[480px] rounded-2xl lg:col-span-2" />
          <Skeleton className="h-60 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isEdit && !vm) {
    return (
      <EmptyState
        icon={SearchX}
        title="VM no encontrada"
        description="Puede que haya sido eliminada."
        action={
          <Link to="/vms" className={buttonClass("secondary")}>
            Volver al listado
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/vms"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition hover:text-text"
      >
        <ArrowLeft className="size-4" />
        Volver
      </Link>
      <PageHeader
        title={vm ? `Editar ${vm.name}` : "Nueva máquina virtual"}
        description={
          vm
            ? "Actualiza la configuración de la VM."
            : "Define los recursos de la nueva VM."
        }
      />
      <VmForm
        key={vm?.id ?? "new"}
        defaultValues={vm ? toFormValues(vm) : DEFAULT_VALUES}
        takenNames={takenNames}
        submitLabel={vm ? "Guardar cambios" : "Crear VM"}
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
    </div>
  );
}
