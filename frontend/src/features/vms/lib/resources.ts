import type { Vm } from "../types";

export interface ResourceTotals {
  total: number;
  running: number;
  cores: number;
  ramGb: number;
  diskGb: number;
}

export function computeResourceTotals(vms: Vm[]): ResourceTotals {
  return vms.reduce<ResourceTotals>(
    (acc, vm) => {
      acc.total += 1;
      if (vm.status === "RUNNING") {
        acc.running += 1;
        acc.cores += vm.cores;
        acc.ramGb += vm.ramGb;
        acc.diskGb += vm.diskGb;
      }
      return acc;
    },
    { total: 0, running: 0, cores: 0, ramGb: 0, diskGb: 0 },
  );
}

export function formatGb(gb: number): string {
  return gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
}
