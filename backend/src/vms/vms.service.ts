import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Vm } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVmDto } from './dto/create-vm.dto';
import { UpdateVmDto } from './dto/update-vm.dto';

@Injectable()
export class VmsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Vm[]> {
    return this.prisma.vm.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateVmDto): Promise<Vm> {
    try {
      return await this.prisma.vm.create({ data: dto });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, dto: UpdateVmDto): Promise<Vm> {
    try {
      return await this.prisma.vm.update({ where: { id }, data: dto });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.vm.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una VM con ese nombre');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('La VM no existe');
      }
    }
    throw error;
  }
}
