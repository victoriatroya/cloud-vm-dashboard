import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Vm } from '@prisma/client';
import type { Server, Socket } from 'socket.io';
import { AUTH_COOKIE } from '../auth/auth.constants';
import type { JwtPayload } from '../auth/types/auth-user';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from './realtime.events';

type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;
type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server!: AppServer;

  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(private readonly jwt: JwtService) {}

  // Middleware de handshake: se ejecuta antes de aceptar cada conexión
  afterInit(server: AppServer): void {
    server.use((socket, next) => {
      const token = getCookie(socket.handshake.headers.cookie, AUTH_COOKIE);

      if (!token) {
        next(new Error('Unauthorized'));
        return;
      }

      this.jwt
        .verifyAsync<JwtPayload>(token)
        .then((payload) => {
          socket.data.user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role,
          };
          next();
        })
        .catch(() => next(new Error('Unauthorized')));
    });
  }

  handleConnection(client: AppSocket): void {
    this.logger.log(`Socket conectado: ${client.data.user.email}`);
  }

  handleDisconnect(client: AppSocket): void {
    this.logger.log(
      `Socket desconectado: ${client.data.user?.email ?? 'anónimo'}`,
    );
  }

  emitVmCreated(vm: Vm): void {
    this.server.emit('vm:created', vm);
  }

  emitVmUpdated(vm: Vm): void {
    this.server.emit('vm:updated', vm);
  }

  emitVmDeleted(id: string): void {
    this.server.emit('vm:deleted', { id });
  }
}

function getCookie(header: string | undefined, name: string): string | null {
  if (!header) return null;

  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }

  return null;
}
