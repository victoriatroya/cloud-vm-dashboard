import { http } from "@/shared/lib/http";
import type { LoginCredentials, User } from "../types";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    http.post<User>("/login", credentials),
  logout: () => http.post<void>("/logout"),
  me: () => http.get<User>("/me"),
};
