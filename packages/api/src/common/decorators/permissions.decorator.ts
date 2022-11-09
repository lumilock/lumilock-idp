import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...Permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, Permissions);
