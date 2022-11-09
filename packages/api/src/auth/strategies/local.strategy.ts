import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identity', // email || login
      passwordField: 'password',
    });
  }

  async validate(identity: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(identity, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
