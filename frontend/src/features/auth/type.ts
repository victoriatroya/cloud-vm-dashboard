export type Role = "ADMIN" | "CLIENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Administrador",
  CLIENT: "Cliente",
};
