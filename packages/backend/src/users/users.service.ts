import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { User, UserRoleEnum } from './user.entity';

interface UserWithoutPassword {
  id: string;
  email: string;
  emailVerified: Date;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    console.log(users)

    return users;
  }

  async getUserById(id: string): Promise<UserWithoutPassword> {
     const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastActivityAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async registerUser(userData: User): Promise<User> {
    this.validateUserInput(userData);
    const existingUser = await this.prisma.user.findUnique({ where: {
      email: userData.email
    }});
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser: User = {
      ...userData,
      password: hashedPassword,
    };
    const createdUser = await this.prisma.user.create({ data: newUser });

    return createdUser;
  }

  async editUser(userId: string, userData: User): Promise<User> {
    this.validateUserInput(userData);
    const existingUser = await this.prisma.user
      .findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new NotFoundException('User not found.');
    }

    const { email, ...updatedUserData } = userData;
    let updatedUser = await this.prisma.user.update({ where: { id: userId }, data: updatedUserData });
 
    if (email && email !== existingUser.email) {
      const userWithNewEmail = await this.prisma.user.findUnique({ where: { email } });
      if (userWithNewEmail) {
        throw new ConflictException('Email is already in use. Please choose a different email.');
      }

      updatedUser = await this.prisma.user.update({ where: { id: userId }, data: { email } });
    }

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const userToDelete = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userToDelete) {
      throw new NotFoundException('User not found.');
    }

    await this.prisma.user.delete({ where: { id: userId } });
  }

  private validateUserInput(userData: User): void {
    if (!userData.email || !this.isValidEmail(userData.email)) {
      throw new BadRequestException('Invalid email format.');
    }
    if (!userData.name) {
      throw new BadRequestException('Name is required.');
    }
    if (!userData.role || !this.isValidUserRole(userData.role)) {
      throw new BadRequestException('Invalid role.');
    }
    if (!userData.password) {
      throw new BadRequestException('Password is required.');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUserRole(role: string): role is UserRoleEnum {
    return Object.values(UserRoleEnum).includes(role as UserRoleEnum);
  }
}
