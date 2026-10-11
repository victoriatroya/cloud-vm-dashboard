import { OperatingSystem, VmStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';

export class CreateVmDto {
  @Matches(/^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/, {
    message:
      'El nombre debe tener entre 3 y 32 caracteres: minúsculas, números y guiones (sin empezar ni terminar en guion)',
  })
  name!: string;

  @IsInt({ message: 'Los cores deben ser un número entero' })
  @Min(1, { message: 'Mínimo 1 core' })
  @Max(64, { message: 'Máximo 64 cores' })
  cores!: number;

  @IsInt({ message: 'La RAM debe ser un número entero (GB)' })
  @Min(1, { message: 'Mínimo 1 GB de RAM' })
  @Max(512, { message: 'Máximo 512 GB de RAM' })
  ramGb!: number;

  @IsInt({ message: 'El disco debe ser un número entero (GB)' })
  @Min(10, { message: 'Mínimo 10 GB de disco' })
  @Max(4096, { message: 'Máximo 4096 GB de disco' })
  diskGb!: number;

  @IsEnum(OperatingSystem, { message: 'Sistema operativo no válido' })
  os!: OperatingSystem;

  @IsOptional()
  @IsEnum(VmStatus, { message: 'Estado no válido' })
  status?: VmStatus;
}
