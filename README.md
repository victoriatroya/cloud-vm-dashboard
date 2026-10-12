# Cloud VM Dashboard

SPA para gestionar máquinas virtuales en tiempo real, con una API REST de soporte. El frontend es el protagonista: Optimistic UI con rollback, dashboard de recursos, dark mode nativo y sincronización en vivo entre usuarios mediante WebSockets.

## Funcionalidades

**Frontend**

- Login con sesión basada en cookie HttpOnly (el frontend nunca accede al token).
- Rutas protegidas y por rol: el **Cliente** no ve (no se renderizan) los botones de crear, editar, eliminar ni encender/apagar, y las rutas `/vms/new` y `/vms/:id/edit` lo redirigen.
- Listado de VMs con búsqueda, filtro por estado y acción rápida de encender/apagar.
- Formulario de creación/edición con validación en tiempo real (Zod), presets de tamaño y vista previa en vivo.
- **Optimistic UI** en crear, editar, eliminar y encender/apagar, con **rollback** si la API falla.
- Dashboard con métricas y gráficos (Recharts) de los recursos asignados a las VMs activas: suma de cores, RAM y disco.
- Skeletons durante la carga, toasts de éxito/error y empty states (sin datos, sin resultados, error con reintento).
- **Dark mode** con tokens de diseño, sin parpadeo al recargar.
- **Tiempo real:** los cambios de un admin se reflejan al instante en todos los clientes conectados, con una animación que resalta la tarjeta modificada e indicador de conexión ("En vivo" / "Reconectando…").

**Backend**

- `POST /api/login`, `POST /api/logout`, `GET /api/me`.
- CRUD de VMs protegido por JWT y autorización por rol.
- Gateway de Socket.io autenticado con la misma cookie.

## Stack

| Capa                | Tecnología                                                  |
| ------------------- | ----------------------------------------------------------- |
| Frontend            | React 19, TypeScript, Vite, Tailwind CSS v4                 |
| Estado del servidor | TanStack Query                                              |
| Estado de cliente   | Zustand                                                     |
| Formularios         | React Hook Form + Zod                                       |
| Gráficos            | Recharts                                                    |
| Tiempo real         | socket.io-client                                            |
| Backend             | NestJS 11, TypeScript                                       |
| Persistencia        | Prisma 6 + SQLite                                           |
| Auth                | JWT (`@nestjs/jwt` + Passport) en cookie HttpOnly, bcryptjs |
| Tiempo real         | Socket.io (`@nestjs/websockets`)                            |
| Seguridad           | helmet, `@nestjs/throttler`, class-validator                |

## Guía de despliegue local

### Requisitos

- Node.js 20 o superior (probado con Node 24)
- npm 10 o superior
- **Google Chrome** recomendado: la cookie usa el atributo `Secure`, y Chrome lo acepta en `http://localhost`. Safari puede rechazarla en local.

### 1. Clonar

```bash
git clone https://github.com/victoriatroya/cloud-vm-dashboard.git
cd cloud-vm-dashboard
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Genera un secreto para firmar los JWT y reemplaza el valor de `JWT_SECRET` en `.env`:

```bash
openssl rand -base64 32
```

Crea la base de datos y carga los datos de prueba (`migrate dev` ejecuta el seed automáticamente):

```bash
npx prisma migrate dev
```

Levanta la API en `http://localhost:3000`:

```bash
npm run start:dev
```

### 3. Frontend

En **otra terminal**, desde la raíz del repo:

```bash
cd frontend
npm install
npm run dev
```

Abre **http://localhost:5173**

## Credenciales de prueba

Creadas por el seed. En la pantalla de login también hay botones que rellenan el formulario.

| Rol           | Email              | Contraseña    |
| ------------- | ------------------ | ------------- |
| Administrador | `admin@demo.com`   | `Admin123!`   |
| Cliente       | `cliente@demo.com` | `Cliente123!` |

### Variables de entorno (backend)

| Variable       | Descripción                 | Ejemplo                             |
| -------------- | --------------------------- | ----------------------------------- |
| `DATABASE_URL` | Archivo SQLite              | `file:./dev.db`                     |
| `JWT_SECRET`   | Secreto para firmar los JWT | salida de `openssl rand -base64 32` |
| `FRONTEND_URL` | Origen permitido por CORS   | `http://localhost:5173`             |
| `PORT`         | Puerto de la API            | `3000`                              |

### Scripts útiles

| Dónde    | Comando                                  | Qué hace                                            |
| -------- | ---------------------------------------- | --------------------------------------------------- |
| backend  | `npx prisma db seed`                     | Vuelve a cargar los datos de prueba                 |
| backend  | `npx prisma studio`                      | Explorador visual de la base de datos               |
| backend  | `npx tsx scripts/ws-test.ts cookies.txt` | Cliente de consola para escuchar eventos del socket |
| frontend | `npm run build`                          | Verificación de tipos y build de producción         |

**Para probar el tiempo real:** inicia sesión como admin en una ventana normal y como cliente en una ventana de incógnito (las cookies quedan separadas). Al encender o apagar una VM desde el admin, la tarjeta se actualiza en la ventana del cliente.

## Arquitectura

## Decisiones arquitectónicas

### Estructura del frontend: por features

```
frontend/src/
├── app/                 # Arranque: providers, router, cliente de queries
├── shared/              # Reutilizable, sin lógica de negocio
│   ├── lib/             # Cliente HTTP, utilidades
│   ├── ui/              # Button, Input, Select, Card, Skeleton, EmptyState, ConfirmDialog...
│   ├── stores/          # Zustand: tema
│   └── layout/          # AppLayout (sidebar + header)
└── features/            # Un módulo por dominio
    ├── auth/            # api, hooks, guardas de rutas, login
    ├── vms/             # api, hooks de queries/mutaciones, lógica de caché, form, listado
    ├── dashboard/       # métricas y gráficos
    └── realtime/        # socket, store de conexión y resaltados
```

Cada feature agrupa su API, hooks, componentes y páginas, de modo que un cambio en un dominio queda contenido en una carpeta. `shared/` no importa nada de `features/`, lo que mantiene la dependencia en un solo sentido.

### Estado: servidor vs. cliente

- **TanStack Query** maneja el estado del servidor, incluida la sesión: como el token no es accesible desde JavaScript, la sesión se obtiene de `GET /api/me`.
- **Zustand** solo guarda estado de cliente: tema, conexión en tiempo real y resaltados.
- Listado, dashboard y gráficos comparten la caché `['vms']`, así que cualquier cambio actualiza todas las vistas.

### Optimistic UI con rollback dirigido

Las mutaciones (`use-vm-mutations.ts`) aplican el cambio en `onMutate`, lo reconcilian en `onSuccess` y lo revierten en `onError`. Cada rollback deshace **solo lo que tocó** esa mutación (incluida la posición de una VM eliminada), sin pisar cambios que llegaron por socket. Las VMs pendientes se muestran como "Guardando…".

### Tiempo real

El WebSocket es **solo de salida**: las escrituras pasan por la API REST y los eventos se emiten tras confirmar en la base de datos. El cliente los aplica con funciones idempotentes (sin duplicados) y resincroniza la lista al reconectar.

### Validación en dos capas

Zod valida en tiempo real con las mismas reglas del DTO, más la verificación de nombre duplicado. El backend revalida con `class-validator` y responde `409` ante duplicados.

### Backend

- **NestJS** por su estructura modular y sus primitivas para guards, pipes y gateways de WebSocket.
- **Prisma + SQLite:** cero instalación para quien revisa; el seed es idempotente (`upsert`).
- **Prisma 6** en lugar de la versión más reciente disponible al momento, que era una _release candidate_.
- **bcryptjs** en lugar de `bcrypt`: mismo algoritmo, sin compilación nativa, lo que evita problemas de instalación en otros sistemas.
- Los errores de Prisma se traducen a respuestas HTTP claras (`P2002` → 409, `P2025` → 404).

## Seguridad

- **JWT en cookie `HttpOnly`, `Secure` y `SameSite=Strict`:** el token nunca llega al body ni a `localStorage`, y JavaScript no puede leerlo.
- **Login seguro:** responde solo con los datos del usuario, usa un mensaje de error genérico y limita a 5 intentos por minuto.
- **Autorización en el servidor:** `JwtAuthGuard` + `RolesGuard` protegen POST/PUT/DELETE; ocultar botones en el frontend es solo UX.
- **WebSocket autenticado:** el handshake verifica el JWT de la cookie.
- **Sesión expirada:** cualquier `401` cierra la sesión en el frontend y limpia la caché.

## Bitácora de IA

### Herramientas utilizadas

- **Claude (Anthropic)**, en modo conversacional, como asistente de pair programming durante todo el desarrollo.

### Qué delegué y dónde intervine

**Delegué el trabajo pesado en:**

- La arquitectura de ambos proyectos (backend en NestJS y frontend en React): estructura de módulos, carpetas por features y separación de responsabilidades.
- La configuración de los WebSockets: gateway autenticado con la cookie y sincronización de la caché en el cliente.
- La implementación de la UI optimista con rollback.
- La consulta de librerías y versiones compatibles (Nest 11, Prisma 6, TanStack Query, Zod, Recharts).
- La capa de persistencia y modelado con Prisma 6 y SQLite: Diseño del esquema de base de datos relacional, configuración del cliente de Prisma, y automatización del seed inicial con datos de prueba
- La configuración de la capa de seguridad y autenticación, estructuración de guardias personalizados, validación de roles por metadatos, y el manejo seguro de contraseñas con bcryptjs

**Intervine:**

- **Concurrencia en la UI optimista:** al revisar la primera versión con la IA, identiqué que dos cambios rápidos sobre la misma VM (Apagar → Encender) podían revertirse mal. Lo corregí haciendo que cada rollback solo actúe si la caché todavía muestra su propio cambio.

### Prompts clave

**1 . Configuración de UI optimista**

> Hola, necesito una mano con TanStack Query para pulir la UI optimista en mi proyecto de VMs. Quiero que cuando el usuario haga una accion (como prender o apagar una máquina), la interfaz se actualice de inmediato mostrando un estado de 'Guardando...' el problema está en el rollback si la petición falla en el backend, necesito que la reversión sea limpia y afecte solo a esa VM, sin pisar otros cambios que hayan llegado en tiempo real por los WebSockets. Me ayudas a armar el onMutate, onError y onSuccess manejando IDs temporales y conectándolo con toasts de error?

**2. Configuración de WebSockets**

> Hola, tengo un problema con los WebSockets en NestJS estoy armando el dashboard en tiempo real pero como la auth la tengo con una cookie HttpOnly, el navegador no me deja pasar el token a la brava en los headers tradicionales al abrir el socket, necesito ver como leer la cookie durante el handshake en el Gateway, cortar la conexion al instante si el tipo no esta autorizado.
