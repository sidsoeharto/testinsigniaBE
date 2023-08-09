import { Body, Controller, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Returns jsonwebtoken' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto.email, loginDto.password);
    return { token };
  }
}