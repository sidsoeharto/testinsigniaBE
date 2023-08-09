import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../users/user.entity';

export const Roles = (...roles: UserRoleEnum[]) => SetMetadata('roles', roles);
