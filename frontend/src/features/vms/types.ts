export type VmStatus = "RUNNING" | "STOPPED";
export type OperatingSystem = "UBUNTU" | "DEBIAN" | "CENTOS" | "WINDOWS_SERVER";

export interface Vm {
  id: string;
  name: string;
  cores: number;
  ramGb: number;
  diskGb: number;
  os: OperatingSystem;
  status: VmStatus;
  createdAt: string;
  updatedAt: string;
}

export type VmInput = Pick<
  Vm,
  "name" | "cores" | "ramGb" | "diskGb" | "os" | "status"
>;

export const OS_LABEL: Record<OperatingSystem, string> = {
  UBUNTU: "Ubuntu",
  DEBIAN: "Debian",
  CENTOS: "CentOS",
  WINDOWS_SERVER: "Windows Server",
};

export const STATUS_LABEL: Record<VmStatus, string> = {
  RUNNING: "Encendida",
  STOPPED: "Apagada",
};
