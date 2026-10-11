import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/shared/ui/Card";
import { tooltipStyle } from "./chart-styles";

export function StatusDonut({
  running,
  total,
}: {
  running: number;
  total: number;
}) {
  const data = [
    { name: "Encendidas", value: running, color: "var(--color-success)" },
    { name: "Apagadas", value: total - running, color: "var(--color-border)" },
  ];
  const percent = total === 0 ? 0 : Math.round((running / total) * 100);

  return (
    <Card className="h-full">
      <h2 className="font-semibold">Estado de las VMs</h2>
      <p className="text-xs text-text-muted">Encendidas vs. apagadas</p>

      <div className="relative mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="72%"
              outerRadius="95%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-3xl font-semibold">{percent}%</p>
            <p className="text-xs text-text-muted">activas</p>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-text-muted">
              <span
                className="size-2.5 rounded-full"
                style={{ background: entry.color }}
              />
              {entry.name}
            </span>
            <span className="font-medium">{entry.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
