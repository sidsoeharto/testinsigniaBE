import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User, UserRoleEnum } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns the user', type: User })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async getUsers(): Promise<User[]> {
    const users = await this.usersService.getUsers();

    return users;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 200, description: 'Returns new user', type: User })
  async registerUser(@Body() userData: User) {
    const newUser = await this.usersService.registerUser(userData);
    return newUser;
  }

  @Put('edit')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Edit user data by ID' })
  @ApiResponse({ status: 200, description: 'Returns the updated user', type: User })
  async editUserData(@Body() userData: User, @Request() req) {
    const userId = req.user.id;

    const updatedUser = await this.usersService.editUser(userId, userData);
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.deleteUser(id);
  }
}
