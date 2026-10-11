import { z } from "zod";

export const vmSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Mínimo 3 caracteres")
    .max(32, "Máximo 32 caracteres")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Solo minúsculas, números y guiones (sin empezar ni terminar con guion)",
    ),
  cores: z
    .number({ error: "Ingresa un número" })
    .int("Debe ser un número entero")
    .min(1, "Mínimo 1 core")
    .max(64, "Máximo 64 cores"),
  ramGb: z
    .number({ error: "Ingresa un número" })
    .int("Debe ser un número entero")
    .min(1, "Mínimo 1 GB")
    .max(512, "Máximo 512 GB"),
  diskGb: z
    .number({ error: "Ingresa un número" })
    .int("Debe ser un número entero")
    .min(10, "Mínimo 10 GB")
    .max(4096, "Máximo 4096 GB"),
  os: z.enum(["UBUNTU", "DEBIAN", "CENTOS", "WINDOWS_SERVER"], {
    error: "Selecciona un sistema operativo",
  }),
  status: z.enum(["RUNNING", "STOPPED"]),
});

export type VmFormValues = z.infer<typeof vmSchema>;

export function createVmSchema(takenNames: string[]) {
  return vmSchema.refine((values) => !takenNames.includes(values.name), {
    message: "Ya existe una VM con ese nombre",
    path: ["name"],
  });
}
