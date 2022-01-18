import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identity',
      passwordField: 'password',
    });
  }

  async validate(identity: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(identity, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
