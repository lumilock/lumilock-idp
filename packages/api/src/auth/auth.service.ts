import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as jwa from 'jwa';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { CodesService } from '../codes/codes.service';
import getRandomString from '../utils/getRandomString';
import fileStorageSystem from '../config/fileStorageSystem';
import { CodesDTO } from '../codes/codes.dto';
import { bin2hex, randomBytes } from '../utils';
import { oidcConstants } from './oidcConstants';
import { UsersDTO } from '../users/dto/users.dto';
import { ClientsDTO } from '../clients/dto/clients.dto';
import { SubjectDTO } from '../users/subject.dto';
import {
  UsersGeoDataDTO,
  UsersIdentityDTO,
  UsersInfosDTO,
  UsersLinksDTO,
  UsersPasswordDTO,
  UsersPatchPersoInfoDTO,
} from '../users/dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private codesService: CodesService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * Method to validate if the user can be authenticate
   * checking his identity and his password
   * @param {string} identity the email login or phoneNumber of an user
   * @param {string} password the user password
   * @returns null if user is not authenticate or UserDTO if he is
   */
  async validateUser(
    identity: string,
    password: string,
  ): Promise<UsersInfosDTO | undefined> {
    // retreaving a user by identity
    const user = await this.usersService.findByIdentity(identity);
    // checking if we retreave the user
    if (user) {
      // using bcrypt to validate the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result } = user; // return everything except the password
        return UsersInfosDTO.from({
          password: undefined,
          ...result,
        });
      }
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
    // Retreaving the user by his identity
    const user = await this.usersService.findByIdentity(identity);
    // Checking if a user has been found
    if (!user?.id) {
      return {
        status: 'NOT_FOUND',
        message: 'No user associated to this identity',
      };
    }
    // Default response message (it's an error message)
    let response = {
      status: 'NO_EMAIL_SERVICE',
      message: 'This server is not allowed to send emails.',
    };

    // Checking if the current user has an email address
    if (user?.email) {
      // We generate data presents in the token: the current identity and the lastChangedDateTime -> used to check if this token has already been used)
      const payload = {
        identity: identity, // To retreave the user
        lastChangedDateTime: user?.lastChangedDateTime?.getTime(), // To block multi modifications
      };
      // Generation of the token and we adding an expiration time (3min)
      const token = this.jwtService.sign(payload, {
        expiresIn: 60 * 3 + 's',
      });
      // sending the email
      await this.mailerService
        .sendMail({
          to: user?.email,
          subject: 'Demande de changement de mot de passe 🔒', // TODO: translation
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

  /**
   * Method used to change the password of a specific user
   * thanks to the token, send by an email from the method "sendResetEmail"
   * @param {string} password New user password
   * @param {string} passwordConfirmed New user password that must be identical to "password"
   * @param {string} token the token containing the identity of the user who want to change his password
   * @param {string} geoString the localisation of the client who asking to change password
   * @param {string} deviceString the device of the client who asking to change password
   * @returns {object} object with a status and a message keys
   */
  async changePassword(
    password: string,
    passwordConfirmed: string,
    token: string,
    geoString: string,
    deviceString: string,
  ): Promise<{ status: string; message: string }> {
    try {
      // Checking the validity and decode the token
      const valide = this.jwtService.verify(token);
      if (valide && password === passwordConfirmed) {
        if (valide?.identity) {
          const updatedEmail = await this.usersService.ChangePwdByIdentity(
            valide?.identity,
            valide?.lastChangedDateTime,
            password,
          );

          if (!!updatedEmail) {
            // https://postmarkapp.com/guides/password-reset-email-best-practices
            await this.mailerService.sendMail({
              to: updatedEmail,
              subject: 'Votre mot de passe à été changé 🎉', // TODO: translation
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

  /**
   * Method used to generate the authenticate jwa code
   * https://www.npmjs.com/package/jwa
   * @param {ClientsDTO} client the RP which asking to generate a code
   * @param {UsersDTO} user the user concern by the RP request
   * @returns {string} the code sign by jwa('HS256') protocol
   */
  async authenticate(client: ClientsDTO, user: UsersDTO): Promise<string> {
    const hmac = jwa('HS256');
    // 1. generate a random code based on : (5 random char / timestamp / 5 random char)
    const randomCode = `${getRandomString(5)}${Math.floor(
      Date.now() / 1000,
    )}${getRandomString(5)}`;
    const input = hmac.sign(randomCode, oidcConstants.secretCodeGenerator);

    // 2. removed all expires codes in db
    this.codesService.checkExpiration(client?.id);

    // 3. saved it in db
    await this.codesService.create(
      CodesDTO.from({
        code: input,
        client: ClientsDTO.from({ ...client, secret: '' }),
        user,
      }),
    );

    // 4. encode it before send it
    const signature = hmac.sign(input, oidcConstants.secretCodeGenerator);
    return signature;
  }

  /**
   * Method to generate the token send to the client
   * https://openid.net/specs/openid-connect-core-1_0.html#IDToken
   * @param {CodesDTO} code all data associate to the authenticate code generated in the method "authenticate"
   * @returns an object containing all token: { access_token, token_type, refresh_token, expires_in, id_token }
   */
  public async getToken(code: CodesDTO) {
    // Destructurate the code
    const userId = code?.user?.id;
    const clientId = code?.client?.id;
    const authTime = code?.createDateTime;
    const clientOrigin = new URL(code?.client?.redirectUris?.[0])?.origin; // TODO could be better ([0]) ? yes filter by redirect_uri from controller
    const clientSecret = code?.client?.secret;

    // the subject is the usersClients relation id
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

  /**
   * ? what is this function
   * ! deprecated
   */
  async login(user: any) {
    const payload = { login: user.login, sub: user.id };
    console.log('2');
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Method used to retreave profile infos of a specific user
   * based on the clientId which asking for it and the user id known by this client
   * @param {string} userSub the id of the user base on the RP which asking
   * @param {string} clientId The id of the RP which asking
   * @returns {SubjectDTO} all user info for this subject
   */
  async profile(
    userSub: string,
    clientId: string,
  ): Promise<SubjectDTO | undefined> {
    if (!userSub || !clientId) return undefined;
    return this.usersService.findBySub(userSub, clientId);
  }

  /**
   * Method used to patch the profile picture of an user
   * @param {string} userId The id of the target user
   * @param {object} file the new picture file to store in db and s3
   * @param {string} path The picture location in the object server storage
   * @returns {string} the signed path to display the stored file
   */
  async patchPicture(
    userId: string,
    file: object,
    path: string,
  ): Promise<string> {
    // checking if there is a file
    if (!file || !userId) return undefined;

    // upload to object storage
    fileStorageSystem.putObject(file, path);

    // save path in db
    const hasBeenSaved = await this.usersService.patchPicture(userId, path);

    // sign the path in order to return it in front
    if (hasBeenSaved) {
      let pictureUrl = '';
      // signed path
      const duration = 60; // 60 seconds
      await fileStorageSystem
        .signedUrl(path, duration)
        .then((url) => (pictureUrl = url))
        .catch(console.error);

      return pictureUrl;
    }
    return '';
  }

  /**
   * Method used to patch the personnal information of the auth user
   * @param {string} userId The id of the auth
   * @param {UsersPatchPersoInfoDTO} userPersoInfo the new personnal information to update
   * @returns {UsersPatchPersoInfoDTO | string} the updated and formatted personnal information or an empty string
   */
  async patchPersonnalInformation(
    userId: string,
    userPersoInfo: UsersPatchPersoInfoDTO,
  ): Promise<UsersPatchPersoInfoDTO | string> {
    // checking if there are data
    if (!userPersoInfo || Object.keys(userPersoInfo)?.length <= 0 || !userId)
      return undefined;

    // We format the data in order to generate the full name
    const formattedUserPersoInfo = UsersPatchPersoInfoDTO.from(userPersoInfo);
    // patch personnal information in db
    const hasBeenSaved = await this.usersService.patchPersonnalInformation(
      userId,
      formattedUserPersoInfo,
    );

    return hasBeenSaved ? formattedUserPersoInfo : '';
  }

  /**
   * Method used to patch the identity information of the auth user
   * @param {string} userId The id of the auth
   * @param {UsersIdentityDTO} currentUserIdentity previous identity information of the current auth
   * @param {UsersIdentityDTO} userIdentity new identity information to update
   * @returns {UsersPatchPersoInfoDTO | string} the updated and formatted identity information or an empty string
   */
  async patchIdentity(
    userId: string,
    currentUserIdentity: UsersIdentityDTO,
    userIdentity: UsersIdentityDTO,
  ): Promise<UsersIdentityDTO | string> {
    // checking if there are data
    if (!userIdentity || !userId) return undefined;
    // Destructurate updated data
    const { email: uEmail, phoneNumber: uPhoneNumber } = userIdentity;
    const {
      email: cEmail,
      emailVerified: cEmailVerified,
      phoneNumber: cPhoneNumber,
      phoneNumberVerified: cphoneNumberVerified,
    } = currentUserIdentity;

    // We format the data in order to generate the full name
    const formattedUserIdentity = UsersIdentityDTO.from({
      email: uEmail,
      emailVerified: uEmail !== cEmail ? false : cEmailVerified,
      phoneNumber: uPhoneNumber,
      phoneNumberVerified:
        uPhoneNumber !== cPhoneNumber ? false : cphoneNumberVerified,
    });

    // patch identity in db
    const hasBeenSaved = await this.usersService.patchIdentity(
      userId,
      formattedUserIdentity,
    );

    return hasBeenSaved ? formattedUserIdentity : '';
  }

  /**
   * Method used to patch the password of the auth user
   * @param {string} userId The id of the auth
   * @param {string} userLogin the unique identity login of the auth
   * @param {UsersPasswordDTO} userPassword old, new and confirmed password to update
   * @returns {boolean} boolean to determine if the password has been updated
   */
  async patchPassword(
    userId: string,
    userLogin: string,
    userPassword: UsersPasswordDTO,
  ): Promise<boolean> {
    // checking if there are data
    if (!userPassword || !userLogin || !userId) return undefined;

    // Validate the current password
    const userValidated = await this.validateUser(
      userLogin,
      userPassword?.password,
    );

    // checking if the old password is corrent
    if (!userValidated)
      throw new BadRequestException({
        statusCode: 400,
        message: {
          password: 'This password does not match your current password',
        },
        error: 'Bad Request',
      });

    // patch password in db
    const hasBeenSaved = await this.usersService.patchPassword(
      userId,
      userPassword?.newPassword,
    );

    return hasBeenSaved;
  }

  /**
   * Method used to patch external links profile and website of the auth user
   * @param {string} userId The id of the auth
   * @param {UsersLinksDTO} userLinks new external links profile and website to update
   * @returns {UsersLinksDTO | string} the patched links if they have been updated or an empty string
   */
  async patchLinks(
    userId: string,
    userLinks: UsersLinksDTO,
  ): Promise<UsersLinksDTO | string> {
    // checking if there are data
    if (!userLinks || !userId) return undefined;

    // patch external links in db
    const hasBeenSaved = await this.usersService.patchLinks(userId, userLinks);

    return hasBeenSaved ? userLinks : '';
  }

  /**
   * Method used to patch geographique data zoneinfo and locale of the auth user
   * @param {string} userId The id of the auth
   * @param {UsersGeoDataDTO} userGeoData new geographique data zoneinfo and locale to update
   * @returns {UsersGeoDataDTO | string} the patched geographique data if they have been updated or an empty string
   */
  async patchGeoData(
    userId: string,
    userGeoData: UsersGeoDataDTO,
  ): Promise<UsersGeoDataDTO | string> {
    // checking if there are data
    if (!userGeoData || !userId) return undefined;

    // patch external links in db
    const hasBeenSaved = await this.usersService.patchGeoData(
      userId,
      userGeoData,
    );

    return hasBeenSaved ? userGeoData : '';
  }

  /**
   * Method used to signed the user picture path
   * @param {UsersDTO} user all users data
   * @returns {UsersDTO} the user dto with a signed picture url
   */
  async getProfile(user: UsersDTO): Promise<UsersDTO> {
    // checking if there is an user
    if (!user) return undefined;
    const userCopy = JSON.parse(JSON.stringify(user));

    if (userCopy?.picture) {
      // signed path
      const duration = 60; // 60 seconds
      await fileStorageSystem
        .signedUrl(user?.picture, duration)
        .then((url) => (userCopy.picture = url))
        .catch(console.error);
    }
    return userCopy;
  }

  /**
   * Check if client have the consent of the user
   * @param {string} userSub the id of the user base on the asking RP which
   * @param {string} clientId The id of the asking RP
   * @returns {boolean} is the user give his consent or not to this RP?
   */
  async checkUserConsent(userId: string, clientId: string) {
    const consent = await this.usersService.checkConsent(userId, clientId);
    return consent;
  }
}
