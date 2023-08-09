import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRoleEnum[]>('roles', context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      // If no required roles are specified, allow access by default
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.role;

    if (!userRole || !requiredRoles.includes(userRole)) {
      // If user role does not match the required roles, deny access
      throw new UnauthorizedException('You do not have permission to access this resource.');
    }

    return true;
  }
}
