import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { oidcConstants } from './oidcConstants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: oidcConstants.tokenSecret,
      },
      (payload, done) => {
        // check revoke
        done(null, payload);
      },
    );
  }

  async validate(payload: any) {
    return { userId: payload.sub, login: payload.login };
  }
}
