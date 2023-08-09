import { Prisma } from '@prisma/client';

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export class User implements Prisma.UserCreateInput {
  id?: string;
  email: string;
  emailVerified?: Date;
  name: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastActivityAt?: Date;
}
