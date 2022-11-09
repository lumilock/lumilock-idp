// src/common/guards/authenticated.guard.ts
import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class TCPAuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    console.log('context', context);
    console.log('context', context.switchToRpc());
    console.log('context', context.switchToRpc().getData());
    console.log('context', context.switchToRpc().getContext());
    const request = context.switchToHttp().getRequest();
    console.log('request', request);
    console.log('request------------------');
    return request.isAuthenticated();
  }
}
