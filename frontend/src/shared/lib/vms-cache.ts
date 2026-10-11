import type { Vm } from "@/features/vms/types";

const TEMP_PREFIX = "temp-";

export const createTempId = () => `${TEMP_PREFIX}${crypto.randomUUID()}`;

export const isTempVm = (vm: Vm) => vm.id.startsWith(TEMP_PREFIX);

export function upsertVm(vms: Vm[] | undefined, vm: Vm): Vm[] {
  const list = vms ?? [];
  return list.some((v) => v.id === vm.id)
    ? list.map((v) => (v.id === vm.id ? vm : v))
    : [vm, ...list];
}

export function removeVm(vms: Vm[] | undefined, id: string): Vm[] {
  return (vms ?? []).filter((v) => v.id !== id);
}

export function insertVmAt(vms: Vm[] | undefined, vm: Vm, index: number): Vm[] {
  const list = vms ?? [];
  if (list.some((v) => v.id === vm.id)) return list;
  const copy = [...list];
  copy.splice(Math.max(0, index), 0, vm);
  return copy;
}
