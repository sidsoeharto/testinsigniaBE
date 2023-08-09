import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { User } from '../users/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
