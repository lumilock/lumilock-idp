import { Strategy } from 'passport-openidconnect';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { oidcConstants } from './oidcConstants';

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(
      {
        issuer: oidcConstants.issuer,
        authorizationURL: oidcConstants.authorizationURL,
        tokenURL: oidcConstants.tokenURL,
        userInfoURL: oidcConstants.userInfoURL,
        clientID: oidcConstants.clientID,
        clientSecret: oidcConstants.clientSecret,
        callbackURL: oidcConstants.callbackURL,
      },
      (issuer, sub, profile, accessToken, refreshToken, done) => {
        console.log(
          'issuer:',
          issuer,
          ' sub :',
          sub,
          ' profile :',
          profile,
          ' accessToken :',
          accessToken,
          ' refreshToken :',
          refreshToken,
          ' done :',
          done,
        );
        return done(null, profile);
      },
    );
  }

  async validate(payload: any) {
    return { userId: payload.sub, login: payload.login };
  }
}
