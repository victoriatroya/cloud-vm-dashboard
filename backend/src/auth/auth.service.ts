import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import type { AuthUser, JwtPayload } from './types/auth-user';

@Injectable()
export class AuthService {
  // Se compara contra este hash cuando el email no existe, para que la respuesta
  // tarde lo mismo y no se pueda averiguar qué emails están registrados.
  private readonly dummyHash = bcrypt.hashSync('dummy-password', 10);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ user: AuthUser; token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    const isValid = await bcrypt.compare(
      dto.password,
      user?.passwordHash ?? this.dummyHash,
    );

    if (!user || !isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const payload: JwtPayload = {
      sub: user.id,
      ...authUserWithoutId(authUser),
    };
    const token = await this.jwt.signAsync(payload);

    return { user: authUser, token };
  }
}

function authUserWithoutId({ email, name, role }: AuthUser) {
  return { email, name, role };
}
