// src/common/guards/authenticated.guard.ts
import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isAuth = await request.isAuthenticated();
    if (!isAuth) throw new UnauthorizedException();
    return isAuth;
  }
}
