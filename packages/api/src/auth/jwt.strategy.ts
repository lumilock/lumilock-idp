import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret,
      },
      (payload, done) => {
        console.log(payload, done);
        // check revoke
        done(null, true);
      },
    );
  }

  async validate(payload: any) {
    return { userId: payload.sub, login: payload.login };
  }
}
