import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as jwa from 'jwa';

import { UsersService } from '../users/users.service';
import { CodesService } from '../codes/codes.service';
import getRandomString from '../utils/getRandomString';
import { CodesDTO } from '../codes/codes.dto';
import { bin2hex, randomBytes } from '../utils';
import { oidcConstants } from './oidcConstants';
import { UsersDTO } from '../users/users.dto';
import { ClientsDTO } from '../clients/clients.dto';
import { SubjectDTO } from 'src/users/subject.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private codesService: CodesService,
    private readonly mailerService: MailerService,
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

  /**
   * Method used to retreave the email of a user by its identity
   * Mainly used to reset a password
   * @param {string} identity user identity (email or login)
   * @returns {object} email or error
   */
  async sendResetEmail(
    identity: string,
  ): Promise<{ status: string; message: string }> {
    const user = await this.usersService.findByIdentity(identity);
    // Checking if a user has been found
    if (!user?.id) {
      return {
        status: 'NOT_FOUND',
        message: 'No user associated to this identity',
      };
    }
    let response = {
      status: 'NO_EMAIL_SERVICE',
      message: 'This server is not allowed to send emails.',
    };

    if (user?.email) {
      // We generate a token (3min) with the current identity inside
      const payload = {
        identity: identity, // To retreave the user
        lastChangedDateTime: user?.lastChangedDateTime?.getTime(), // To block multi modifications
      };
      const token = this.jwtService.sign(payload, {
        expiresIn: 60 * 3 + 's',
      });
      // sending the email<
      await this.mailerService
        .sendMail({
          to: user?.email,
          // from: 'jean.perrin.topline@gmail.com',
          subject: 'Demande de changement de mot de passe 🔒',
          template: 'resetPassword',
          context: {
            // Data to be sent to template engine.
            src: 'https://www.mynetfair.com/_files/images/dynamic/products/tmp/200_200_customer_logos_100017583_1283951388_Jean_perrin.jpg', // TODO update with lumilock logo
            appName: process?.env?.APP_NAME || 'Lumilock',
            frontUrl: process?.env?.OAUTH2_CLIENT_FRONT_OIDC_URI,
            token: `${process?.env?.OAUTH2_CLIENT_FRONT_OIDC_URI}?page=reset-password&token=${token}`,
          },
        })
        .then(() => {
          // Response if the user has an email
          response = {
            status: 'FOUND',
            message: user?.email,
          };
        })
        .catch(() => {
          response = {
            status: 'EMAIL_NOT_SEND',
            message: 'Unable to send email, an error has occurred.',
          };
        });
    } else {
      // Response if the user hasn't an email
      response = {
        status: 'NO_EMAIL',
        message: 'Any email is associated to this user',
      };
    }

    return response;
  }

  async changePassword(
    password: string,
    passwordConfirmed: string,
    token: string,
    geoString: string,
    deviceString: string,
  ): Promise<{ status: string; message: string }> {
    try {
      // Check the validity and decode the token
      const valide = this.jwtService.verify(token);
      if (valide && password === passwordConfirmed) {
        if (valide?.identity) {
          const updatedEmail = await this.usersService.ChangePwdByIdentity(
            valide?.identity,
            valide?.lastChangedDateTime,
            password,
          );
          console.log(
            'updatedEmail',
            updatedEmail ? 'true' : 'false',
            updatedEmail,
          );
          if (!!updatedEmail) {
            // https://postmarkapp.com/guides/password-reset-email-best-practices
            await this.mailerService.sendMail({
              to: updatedEmail,
              subject: 'Votre mot de passe à été changé 🎉',
              template: 'passwordUpdated',
              context: {
                // Data to be sent to template engine.
                src: 'https://www.mynetfair.com/_files/images/dynamic/products/tmp/200_200_customer_logos_100017583_1283951388_Jean_perrin.jpg', // TODO update with lumilock logo
                appName: process?.env?.APP_NAME || 'Lumilock',
                when: new Date(Date.now()).toLocaleString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                }),
                where: geoString || 'Not found',
                device: deviceString || 'Not found',
                accountUrl: process?.env?.OAUTH2_CLIENT_FRONT_OIDC_URI,
                frontUrl: process?.env?.OAUTH2_CLIENT_FRONT_OIDC_URI,
              },
            });
            console.log('success');
            return {
              status: 'SUCCESS',
              message: 'The password has been changed',
            };
          }
          return {
            status: 'FAILED',
            message: 'Impossible to update the password',
          };
        }
      }
    } catch (error) {
      return {
        status: 'FORBIDDEN',
        message: 'The token is invalid or has expired',
      };
    }
    return { status: 'BAD_REQUEST', message: 'An error occurred' };
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

    // the subject is the userClient id
    const sub = await this.usersService.getUserClientId(userId, clientId);

    // 1. Generate the access_token
    const accessTokenPayload = {
      iss: oidcConstants.issuer,
      sub: sub, // subject (The user ID)
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
      sub: sub, // subject (The user ID)
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
      sub: sub, // subject (The user ID)
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
  async profile(
    userSub: string,
    clientId: string,
  ): Promise<SubjectDTO | undefined> {
    if (!userSub || !clientId) return undefined;
    return this.usersService.findBySub(userSub, clientId);
  }

  // Check if client have the consent of the user
  async checkUserConsent(userId, clientId) {
    const consent = await this.usersService.checkConsent(userId, clientId);
    return consent;
  }
}
