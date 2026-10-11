import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Ingresa un email válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
