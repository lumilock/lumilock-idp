import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwa from 'jwa';

import { UsersService } from '../users/users.service';
import { CodesService } from '../codes/codes.service';
import getRandomString from '../utils/getRandomString';
import { CodesDTO } from '../codes/codes.dto';
import { bin2hex, randomBytes } from '../utils';
import { oidcConstants } from './oidcConstants';
import { UsersDTO } from '../users/users.dto';
import { ClientsDTO } from '../clients/clients.dto';

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
  async authenticate(client: ClientsDTO, user: UsersDTO) {
    const hmac = jwa('HS256');
    // 1. generate a random code based on : (5 random char / timestamp / 5 random char)
    const randomCode = `${getRandomString(5)}${Math.floor(
      Date.now() / 1000,
    )}${getRandomString(5)}`;
    const input = hmac.sign(randomCode, oidcConstants.secretCodeGenerator);

    // 2. removed all expires codes it in db
    this.codesService.checkExpiration(client?.id);

    // 3. saved it in db
    await this.codesService
      .create(
        CodesDTO.from({
          code: input,
          client: ClientsDTO.from({ ...client, secret: '' }),
          user,
        }),
      )
      .then((r) => (console.log('done ->', r.code, r.client, r.user), r));

    // 4. encode it before send it
    const signature = hmac.sign(input, oidcConstants.secretCodeGenerator);
    return signature;
  }

  // Function to generate the token send to the client
  // https://openid.net/specs/openid-connect-core-1_0.html#IDToken
  public async getToken(code: CodesDTO) {
    const userId = code?.user?.id;
    const clientId = code?.client?.id;
    const authTime = code?.createDateTime;
    const clientOrigin = new URL(code?.client?.redirectUris?.[0])?.origin; // ? could be better ([0])
    const clientSecret = code?.client?.secret;

    // 1. Generate the access_token
    const accessTokenPayload = {
      iss: oidcConstants.issuer,
      sub: userId, // subject (The user ID)
      aud: clientOrigin, // Audience (The identifier of the resource server)
      client_id: clientId, // Client ID
      iat: Math.floor(Date.now() / 1000),
      jti: Date.now() + '.' + bin2hex(randomBytes(20)), // unique id used to blacklist
      scope: 'create',
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: oidcConstants.accessTokenSecret,
      expiresIn: oidcConstants.accessTokenDuration + 's',
    });

    // 2. Generate the refresh_token
    const refreshTokenPayload = {
      iss: oidcConstants.issuer,
      sub: userId, // subject (The user ID)
      aud: clientOrigin, // Audience (The identifier of the resource server)
      client_id: clientId, // Client ID
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
      sub: userId, // subject (The user ID)
      aud: clientId, // Client ID
      auth_time: Math.floor(new Date(authTime).getTime() / 1000),
      iat: Math.floor(Date.now() / 1000),
    };
    console.log('clientSecret', clientSecret);
    const idToken = this.jwtService.sign(idTokenPayload, {
      secret: clientSecret,
      expiresIn: oidcConstants.idTokenDuration + 's',
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      refresh_token: refreshToken,
      expires_in: oidcConstants.idTokenDuration,
      id_token: idToken,
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
