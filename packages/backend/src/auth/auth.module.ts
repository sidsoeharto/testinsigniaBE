import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, PrismaService, JwtStrategy, RolesGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
