import { PrismaClient, Role, VmStatus, OperatingSystem } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const [adminHash, clientHash] = await Promise.all([
    bcrypt.hash('Admin123!', 10),
    bcrypt.hash('Cliente123!', 10),
  ]);

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Admin Demo',
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'cliente@demo.com' },
    update: {},
    create: {
      email: 'cliente@demo.com',
      name: 'Cliente Demo',
      passwordHash: clientHash,
      role: Role.CLIENT,
    },
  });

  const vms = [
    {
      name: 'web-server-01',
      cores: 4,
      ramGb: 8,
      diskGb: 100,
      os: OperatingSystem.UBUNTU,
      status: VmStatus.RUNNING,
    },
    {
      name: 'db-primary',
      cores: 8,
      ramGb: 32,
      diskGb: 500,
      os: OperatingSystem.DEBIAN,
      status: VmStatus.RUNNING,
    },
    {
      name: 'build-agent',
      cores: 2,
      ramGb: 4,
      diskGb: 50,
      os: OperatingSystem.CENTOS,
      status: VmStatus.STOPPED,
    },
    {
      name: 'ad-controller',
      cores: 4,
      ramGb: 16,
      diskGb: 200,
      os: OperatingSystem.WINDOWS_SERVER,
      status: VmStatus.RUNNING,
    },
  ];

  for (const vm of vms) {
    await prisma.vm.upsert({
      where: { name: vm.name },
      update: {},
      create: vm,
    });
  }

  console.log('Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
