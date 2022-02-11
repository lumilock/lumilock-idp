import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    console.log('<LocalAuthGuard> can : ', can);
    if (can) {
      const request = context.switchToHttp().getRequest();
      super.logIn(request);
    }
    return true;
  }
}
