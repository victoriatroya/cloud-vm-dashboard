import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/shared/ui/Card";
import { SegmentedControl } from "@/shared/ui/SegmentedControl";
import type { Vm } from "@/features/vms/types";
import { axisTick, tooltipStyle } from "./chart-styles";

const METRICS = {
  cores: { label: "Cores", unit: "" },
  ramGb: { label: "RAM", unit: " GB" },
  diskGb: { label: "Disco", unit: " GB" },
} as const;

type Metric = keyof typeof METRICS;

const METRIC_OPTIONS = [
  { value: "cores", label: "Cores" },
  { value: "ramGb", label: "RAM" },
  { value: "diskGb", label: "Disco" },
] as const;

export function ResourceChart({ vms }: { vms: Vm[] }) {
  const [metric, setMetric] = useState<Metric>("cores");
  const { label, unit } = METRICS[metric];

  const data = vms
    .filter((vm) => vm.status === "RUNNING")
    .map((vm) => ({ name: vm.name, value: vm[metric] }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Recursos por VM activa</h2>
          <p className="text-xs text-text-muted">Solo VMs encendidas</p>
        </div>
        <SegmentedControl<Metric>
          label="Métrica"
          options={METRIC_OPTIONS}
          value={metric}
          onChange={setMetric}
        />
      </div>

      {data.length === 0 ? (
        <p className="grid h-64 place-items-center text-sm text-text-muted">
          No hay VMs encendidas en este momento.
        </p>
      ) : (
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 8, right: 16 }}
            >
              <CartesianGrid horizontal={false} stroke="var(--color-border)" />
              <XAxis
                type="number"
                tick={axisTick}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--color-surface-muted)" }}
                contentStyle={tooltipStyle}
                formatter={(value) => [`${String(value)}${unit}`, label]}
              />
              <Bar
                dataKey="value"
                fill="var(--color-primary)"
                radius={[0, 6, 6, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
