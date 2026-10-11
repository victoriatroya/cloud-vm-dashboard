import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { SegmentedControl } from "@/shared/ui/SegmentedControl";
import { Select } from "@/shared/ui/Select";
import { createVmSchema, type VmFormValues } from "../schemas/vm.schema";
import {
  OS_LABEL,
  type OperatingSystem,
  type Vm,
  type VmStatus,
} from "../types";
import { VmCard } from "./VmCard";

const OS_OPTIONS = (Object.keys(OS_LABEL) as OperatingSystem[]).map(
  (value) => ({
    value,
    label: OS_LABEL[value],
  }),
);

const STATUS_OPTIONS = [
  { value: "STOPPED", label: "Apagada" },
  { value: "RUNNING", label: "Encendida" },
] as const;

const PRESETS = [
  { label: "Pequeña", cores: 2, ramGb: 4, diskGb: 50 },
  { label: "Mediana", cores: 4, ramGb: 16, diskGb: 200 },
  { label: "Grande", cores: 16, ramGb: 64, diskGb: 1000 },
] as const;

const safeNumber = (value: number | undefined) =>
  Number.isFinite(value) ? (value as number) : 0;

interface VmFormProps {
  defaultValues: VmFormValues;
  takenNames: string[];
  submitLabel: string;
  onSubmit: (values: VmFormValues) => void;
  onCancel: () => void;
}

export function VmForm({
  defaultValues,
  takenNames,
  submitLabel,
  onSubmit,
  onCancel,
}: VmFormProps) {
  const schema = useMemo(() => createVmSchema(takenNames), [takenNames]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<VmFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  const values = useWatch({ control });

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    const options = { shouldValidate: true, shouldDirty: true };
    setValue("cores", preset.cores, options);
    setValue("ramGb", preset.ramGb, options);
    setValue("diskGb", preset.diskGb, options);
  };

  const preview: Vm = {
    id: "preview",
    name: values.name?.trim() || "nombre-de-la-vm",
    cores: safeNumber(values.cores),
    ramGb: safeNumber(values.ramGb),
    diskGb: safeNumber(values.diskGb),
    os: values.os ?? "UBUNTU",
    status: values.status ?? "STOPPED",
    createdAt: "",
    updatedAt: "",
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      noValidate
      className="grid gap-6 lg:grid-cols-3"
    >
      <Card className="space-y-8 lg:col-span-2">
        <section className="space-y-4">
          <h2 className="font-semibold">General</h2>
          <Input
            label="Nombre"
            placeholder="web-server-02"
            autoComplete="off"
            hint="Minúsculas, números y guiones. Entre 3 y 32 caracteres."
            error={errors.name?.message}
            {...register("name")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Sistema operativo"
              options={OS_OPTIONS}
              error={errors.os?.message}
              {...register("os")}
            />
            <div className="space-y-1.5">
              <span className="block text-sm font-medium">Estado</span>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <SegmentedControl<VmStatus>
                    label="Estado de la VM"
                    options={STATUS_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Recursos</h2>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-muted transition hover:border-primary hover:text-primary"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Cores"
              type="number"
              inputMode="numeric"
              min={1}
              max={64}
              suffix="vCPU"
              error={errors.cores?.message}
              {...register("cores", { valueAsNumber: true })}
            />
            <Input
              label="RAM"
              type="number"
              inputMode="numeric"
              min={1}
              max={512}
              suffix="GB"
              error={errors.ramGb?.message}
              {...register("ramGb", { valueAsNumber: true })}
            />
            <Input
              label="Disco"
              type="number"
              inputMode="numeric"
              min={10}
              max={4096}
              suffix="GB"
              error={errors.diskGb?.message}
              {...register("diskGb", { valueAsNumber: true })}
            />
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-border pt-5">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isValid || !isDirty}>
            {submitLabel}
          </Button>
        </div>
      </Card>

      <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm font-medium text-text-muted">Vista previa</p>
        <VmCard vm={preview} />
      </div>
    </form>
  );
}
