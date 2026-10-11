import { existsSync, readFileSync } from 'node:fs';
import { io } from 'socket.io-client';

// Uso: npx tsx scripts/ws-test.ts cookies-cliente.txt
const cookieFile = process.argv[2] ?? 'cookies-cliente.txt';

const token = existsSync(cookieFile)
  ? readFileSync(cookieFile, 'utf8')
      .split('\n')
      .find((line) => line.includes('access_token'))
      ?.split('\t')
      .pop()
      ?.trim()
  : undefined;

const socket = io('http://localhost:3000', {
  extraHeaders: token ? { Cookie: `access_token=${token}` } : {},
});

socket.on('connect', () => console.log('✅ Conectado. Escuchando eventos...'));
socket.on('connect_error', (err) => {
  console.log('❌ Conexión rechazada:', err.message);
  process.exit(1);
});
socket.on('vm:created', (vm) => console.log('🆕 vm:created', vm));
socket.on('vm:updated', (vm) => console.log('🔄 vm:updated', vm));
socket.on('vm:deleted', (payload) => console.log('🗑️ vm:deleted', payload));
