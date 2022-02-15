import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwa from 'jwa';

import { UsersService } from '../users/users.service';
import { CodesService } from '../codes/codes.service';
import getRandomString from '../utils/getRandomString';
import { LightenClientsDTO } from '../clients/lightenClients.dto';
import { CodesDTO } from '../codes/codes.dto';
import { bin2hex, randomBytes } from '../utils';
import { jwtConstants } from './constants';
import { oidcConstants } from './oidcConstants';
import { LightenUsersDTO } from 'src/users/LightenUsers.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private codesService: CodesService,
  ) {}

  // Function to validate if the user is auth
  async validateUser(identity: string, pass: string): Promise<any> {
    const user = await this.usersService.findByIdentity(identity);
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // generate authenticate jwa code
  // https://www.npmjs.com/package/jwa
  async authenticate(client: LightenClientsDTO, user: LightenUsersDTO) {
    const hmac = jwa('HS256');
    // 1. generate a random code based on : (5 random char / timestamp / 5 random char)
    const randomCode = `${getRandomString(5)}${Math.floor(
      Date.now() / 1000,
    )}${getRandomString(5)}`;
    const input = hmac.sign(randomCode, jwtConstants.secretCodeGenerator);

    // 2. removed all expires codes it in db
    this.codesService.checkExpiration(client?.id);

    // 3. saved it in db
    await this.codesService
      .create(
        CodesDTO.from({
          code: input,
          client,
          user,
        }),
      )
      .then((r) => (console.log('done ->', r.code, r.client, r.user), r));

    // 4. encode it before send it
    const signature = hmac.sign(input, jwtConstants.secretCodeGenerator);
    return signature;
  }

  // Function to generate the token send to the client
  // https://openid.net/specs/openid-connect-core-1_0.html#IDToken
  public async getToken(code: CodesDTO) {
    console.log('<getToken> : ', code);
    // 1. Generate the access_token
    const accessTokenPayload = {
      iss: oidcConstants.issuer,
      sub: 'user.id', // TODO
      aud: 'client.uri', // TODO
      client_id: 'client.id', // TODO
      iat: Math.floor(Date.now() / 1000),
      jti: Date.now() + '.' + bin2hex(randomBytes(20)), // unique id used to blacklist
      scope: 'create',
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: oidcConstants.accessTokenSecret,
      expiresIn: oidcConstants.tokenDuration + 's',
    });

    // 2. Generate the refresh_token
    const refreshTokenPayload = {
      iss: oidcConstants.issuer,
      sub: 'user.id', // TODO
      aud: 'client.uri', // TODO
      client_id: 'client.id', // TODO
      iat: Math.floor(Date.now() / 1000),
      jti: Date.now() + '.' + bin2hex(randomBytes(20)), // unique id used to blacklist
      scope: 'create',
    };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: oidcConstants.refreshTokenSecret,
      expiresIn: oidcConstants.refreshTokenDuration + 's',
    });

    // 3. Generate the id_token
    const idTokenPayload = {
      iss: oidcConstants.issuer,
      sub: 'user.id', // TODO
      aud: 'client.id', // TODO
      iat: Math.floor(Date.now() / 1000),
    };

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      refresh_token: refreshToken,
      expires_in: oidcConstants.tokenDuration,
      id_token: this.jwtService.sign(idTokenPayload, {
        secret: oidcConstants.idTokenSecret,
        expiresIn: oidcConstants.idTokenDuration + 's',
      }),
    };
  }

  async login(user: any) {
    const payload = { login: user.login, sub: user.id };
    console.log('2');
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // profiles info of the auth
  async profile(userId: string) {
    const user = await this.usersService.findById(userId);
    return user;
  }

  // Check if client have the consent of the user
  async checkUserConsent(userId, clientId) {
    const consent = await this.usersService.checkConsent(userId, clientId);
    return consent;
  }
}
