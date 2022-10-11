import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Role } from '../enums';

import { Permission } from '../enums/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const role = user?.role;
    // if the user is an admin he can access to everything
    if (role === Role.Admin) return true;

    const permissions = user?.permissions;

    const hasPermissions = requiredPermissions.some((permission) =>
      permissions?.includes(permission),
    );
    if (!hasPermissions) throw new ForbiddenException();
    return hasPermissions;
  }
}
