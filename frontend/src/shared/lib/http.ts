export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface NestErrorBody {
  message?: string | string[];
}

function toApiError(status: number, body: unknown): ApiError {
  if (status === 429) {
    return new ApiError(
      status,
      "Demasiados intentos. Espera un minuto e intenta de nuevo.",
    );
  }

  const raw = (body as NestErrorBody | null)?.message;

  if (Array.isArray(raw)) {
    return new ApiError(status, raw[0] ?? "Error de validación", raw);
  }
  if (typeof raw === "string") {
    return new ApiError(status, raw);
  }

  return new ApiError(
    status,
    status >= 500
      ? "Error del servidor, intenta de nuevo"
      : "Ocurrió un error inesperado",
  );
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: "include", // la cookie HttpOnly viaja sola
      headers:
        body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor");
  }

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) throw toApiError(response.status, data);

  return data as T;
}

export const http = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T = void>(path: string) => request<T>("DELETE", path),
};
