// auth.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  HttpStatus,
  Res,
  Body,
  Headers,
  Req,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as DeviceDetector from 'device-detector-js';
import * as geoip from 'geoip-lite';
import * as querystring from 'query-string';
import * as sharp from 'sharp';

import { AuthorizeDTO } from './dto';
import {
  UsersPatchPersoInfoDTO,
  UsersDTO,
  UsersIdentityDTO,
  UsersPasswordDTO,
  UsersLinksDTO,
  UsersGeoDataDTO,
} from '../users/dto';
import { CodesDTO } from '../codes/codes.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { oidcConstants } from './oidcConstants';
import { AuthService } from './auth.service';
import { ClientsService } from '../clients/clients.service';
import { UsersClientsService } from '../users-clients/users-clients.service';
import { CodesService } from '../codes/codes.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private serv: AuthService,
    private cliServ: ClientsService,
    private usrCliServ: UsersClientsService,
    private codeServ: CodesService,
  ) {}

  /**
   * Authorization Server Authenticates End-User : https://openid.net/specs/openid-connect-core-1_0.html#Authenticates
   * Authorization Server Obtains End-User Consent/Authorization : https://openid.net/specs/openid-connect-core-1_0.html#Consent
   * Login the user and check it's consent for the current application
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { query, user } = req; // destructurate request to retreave usefull params
      const {
        redirect_uri: queryRedirectUri, // Retreaving the redirect uri
        client_id: queryClientId, // Retreaving the client id
        consent: queryConsent, // Checking if consent is present in query params
        state: queryState, // Checking if consent is present in query params
      } = query || {}; // Checking if query is not null

      const giveConsent = queryConsent === 'true'; // check if user give his from query params
      const state = queryState ? { state: queryState } : {}; // checking if state query params is present, this var will be add in responses

      /** **********************************
       * * Checking basic errors
       ********************************** */
      // if there is a client_id but not a redirect_uri we throw an error
      if (!queryRedirectUri && !!queryClientId)
        throw new Error('Missing "redirect_uri" query params');

      // if there is a redirect_uri but not a client_id redirect to callback with an error
      if (!!queryRedirectUri && !queryClientId) {
        // We redirect to the callback with an error
        const redirectQParams = querystring.stringify({
          error: 'invalid_request_object',
          error_description: 'Missing "client_id" query params',
          ...state, // will add state if exist
        });
        // * Response redirection
        return res.redirect(
          HttpStatus.FOUND,
          `${queryRedirectUri}?${redirectQParams}`,
        );
      }

      /** ***********************************************
       * * Request to login from a Relaying Party (RP)
       ************************************************ */
      // If we have not previous error and we have redirect_uri query params
      // a RP trying to login a end-user
      if (queryRedirectUri) {
        // Checking if client has user data authorization
        const consent = await this.serv.checkUserConsent(
          user?.id, // Id of the user we want to check
          queryClientId, // Id of the client we want to check
        );

        // Retreave client infos
        const clientInfos = await this.cliServ.findById(queryClientId);

        // There is no consent in the db and not in query params
        // so we will ask the consent to the user
        if (!consent && !giveConsent) {
          // If the client doesn't exist
          if (!clientInfos) {
            // We redirect to the callback with an error
            const redirectParams = querystring.stringify({
              error: 'relying_party_not_know',
              error_description:
                'The Relying party is not authorize to access to our oidc',
              ...state, // will add state if exist
            });
            // * Response redirection
            return res.redirect(
              HttpStatus.FOUND,
              `${queryRedirectUri}?${redirectParams}`,
            );
          }
          // Else if the client exist we send client infos to ask consent to the end user
          // * Response Message
          res.status(200).send({
            error: 'consent_required',
            clientInfos: clientInfos,
          });
          return;

          // There is no consent in the db but user give his consent in the query
          // so we will set the consent in the db
        } else if (!consent && giveConsent) {
          await this.usrCliServ.patchOrCreateAuthorization(
            user?.id, // id of the user we want to check
            queryClientId, // id of the client we want to check
            queryConsent, // user consent value
          );
        }

        // After having the consent we will generate an authorization code for the RP
        const code = await this.serv.authenticate(clientInfos, user);
        // Retreaving the oidc issuer (this server @)
        const clientIssuer = oidcConstants.issuer;
        // Defining the sessionKey
        const sessionKey = `oidc:${new URL(clientIssuer).hostname}`;
        // Updating session from query
        const sessionValue = {
          ...(query?.state ? { state: query.state } : {}),
          max_age: undefined,
          // code_verifier: query?.code,
          response_type: 'code',
        };

        const sessionOptions = {
          secure: false, // TODO true when it will be secure
          path: '/',
          httpOnly: true,
          hostOnly: true,
          sameSite: false,
          expires: new Date(Date.now() + 9999999),
        };
        // And then redirect the user to the callback with the code
        const redirectParams = querystring.stringify({
          code, // RP authorization code
          ...state, // will add state if exist
        });

        // * Response redirection
        return res
          .cookie(sessionKey, sessionValue, sessionOptions)
          .set({
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
            'Access-Control-Allow-Origin': [oidcConstants.frontUrl],
            'Access-Control-Allow-Credentials': true,
          })
          .redirect(HttpStatus.FOUND, `${queryRedirectUri}?${redirectParams}`);
      }

      /** *****************************************
       * * Request to login from the OAuth server
       ****************************************** */
      // The OAuth app trying to login a end-user directly
      // * Response Message
      const profile = await this.serv.getProfile(req?.user);
      res.status(HttpStatus.OK).json({
        user: profile,
        message: 'User logged in',
      });
      return;
    } catch (error) {
      console.log('<login> error', error);
      return;
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  public async getProfile(@Request() req): Promise<UsersDTO> {
    return this.serv.getProfile(req?.user);
  }

  // @UseGuards(OidcAuthGuard)
  // @UseGuards(JwtAuthGuard)
  /**
   * Token Request Validation: https://openid.net/specs/openid-connect-core-1_0.html#TokenRequestValidation
   * The Authorization Server MUST validate the Token Request as follows:
   * 1. Authenticate the Client if it was issued Client Credentials or if it uses another Client Authentication method, per Section 9(https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication).
   * 2. Ensure the Authorization Code was issued to the authenticated Client.
   * 3. Verify that the Authorization Code is valid.
   * 4.(move to end) If possible, verify that the Authorization Code has not been previously used.
   * 5. Ensure that the redirect_uri parameter value is identical to the redirect_uri parameter value that was included in the initial Authorization Request. If the redirect_uri parameter value is not present when there is only one registered redirect_uri value, the Authorization Server MAY return an error (since the Client should have included the parameter) or MAY proceed without an error (since OAuth 2.0 permits the parameter to be omitted in this case).
   * 6. Verify that the Authorization Code used was issued in response to an OpenID Connect Authentication Request (so that an ID Token will be returned from the Token Endpoint).
   * */
  @Post('token')
  public async getToken(
    @Request() req,
    @Body() body,
    @Res() res: Response,
  ): Promise<any | undefined> {
    // Destructurate body
    const { client_id, grant_type, code, redirect_uri } = body;
    // TODO 1.
    // (2) Ensure the Authorization Code was issued to the authenticated Client.
    // And (3) Verify that the Authorization Code is valid.
    const valideCode: CodesDTO | undefined =
      await this.codeServ.checkAssociation(client_id, code);

    // Throw an error if the code is not valide
    if (!valideCode) {
      throw new Error(
        'Your authentification code is not valide, have been already been used, or has expired.',
      );
    }

    // (5) Ensure that the redirect_uri parameter value is identical to the redirect_uri parameter value that was included in the initial Authorization Request.
    // If the redirect_uri parameter value is not present when there is only one registered redirect_uri value,
    // the Authorization Server MAY return an error (since the Client should have included the parameter) or
    // MAY proceed without an error (since OAuth 2.0 permits the parameter to be omitted in this case).
    if (
      !redirect_uri ||
      !valideCode?.client?.redirectUris.includes(redirect_uri)
    ) {
      throw new Error(
        'redirect_uri is missing or does not correspond to the client redirect uri',
      );
    }

    // (6) Verify that the Authorization Code used was issued in response to an OpenID Connect Authentication Request
    // (so that an ID Token will be returned from the Token Endpoint).
    if (grant_type !== 'authorization_code' && valideCode?.scope === 'openid') {
      throw new Error(
        'The Authorization Code used need to be issued in response to an OpenID Connect Authentication Request',
      );
    }

    // (4) (move to end) If possible, verify that the Authorization Code has not been previously used.
    // we remove this code because it have been used
    await this.codeServ.removeById(valideCode.id);
    const tokens = await this.serv.getToken(valideCode);

    // If everything has been verifying with success we can generate an ID Token and redirect the user
    // * Response Message
    return res
      .status(HttpStatus.OK)
      .set({ 'Cache-Control': 'no-store', Pragma: 'no-cache' })
      .json(tokens);
  }

  /**
   * Methode used to send a reset password mail to a specific user
   * retreaving by it's identity
   * @param {object} body user identity used to retreave it's email
   * @param {Response} res express response object to response to the client
   * @returns the response with a status and a message
   */
  @Post('reset-password')
  public async resetPassword(
    @Body() body,
    @Res() res: Response,
  ): Promise<any | undefined> {
    // Destructurate to retreave the user identity
    const { identity }: { identity: string } = body;

    // Method used to send the email if possible, returing message status
    const emailresponse = await this.serv.sendResetEmail(identity);

    // * Response Messages
    // Success case only return the email and the status
    if (emailresponse?.status === 'FOUND') {
      return res.status(HttpStatus.OK).json(emailresponse?.message);
    } else if (emailresponse?.status === 'NOT_FOUND') {
      // Error case when no user exist
      return res.status(HttpStatus.BAD_REQUEST).json(emailresponse?.message);
    }
    // All other errors case returning the error message
    return res.status(HttpStatus.NO_CONTENT).json(emailresponse?.message);
  }

  /**
   * Mehtod used to change a user password
   * based of a token send by email in the method "resetPassword"
   * @param req *
   * @param headers used to retreave user client device and geolocalisation
   * @param body containing infos required info to change the current password
   * @param {Response} res express response object to response to the client
   * @returns the response with a status and a message
   */
  @Post('change-password')
  public async changePassword(
    @Req() req,
    @Headers() headers,
    @Body() body,
    @Res() res: Response,
  ): Promise<any | undefined> {
    // Destructurate the body
    const {
      password,
      passwordConfirmed,
      token,
    }: { password: string; passwordConfirmed: string; token: string } = body;

    // Device detector
    const deviceDetector = new DeviceDetector();
    const userAgent = headers['user-agent'];
    const device = deviceDetector.parse(userAgent);
    // Formatting the device in a string message
    const deviceString = [
      device?.client?.name || '',
      device?.os?.name || '',
      device?.device?.type || '',
      device?.device?.brand || '',
      device?.device?.model || '',
    ]
      .join(' ')
      .trim();

    // Geolocalisation detector based on ip
    const geo = geoip.lookup(req.ip);
    // Formatting the geoloc in a string message
    const geoString = [geo?.city || '', geo?.region || '', geo?.country || '']
      .join(' ')
      .trim();

    // Service method to change the password if the token is valid
    // and sending an email to notify the user about this change
    const passwordResponse = await this.serv.changePassword(
      password,
      passwordConfirmed,
      token,
      geoString,
      deviceString,
    );

    // * Response Messages
    if (passwordResponse?.status === 'SUCCESS') {
      return res.status(HttpStatus.OK).json(passwordResponse?.message);
    } else if (passwordResponse?.status === 'FORBIDDEN') {
      // Returning an error when the token is invalid or has expired
      return res.status(HttpStatus.FORBIDDEN).json(passwordResponse?.message);
    }
    // All other errors case returning the error message
    return res.status(HttpStatus.BAD_REQUEST).json(passwordResponse?.message);
  }

  /**
   * Method used to store a profile picture
   * @param {Express.Multer.File} file the file to upload as avatar picture
   * @param {Request} req
   * @returns {string} the signed path to retreave the stored picture
   */
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('picture')
  public async patchPicture(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const userId = req?.user?.id;
    let picturePath = '';
    // Upload client logo file to Object storage
    if (file?.buffer) {
      // converte and resize image
      const sharpedFile = await sharp(file.buffer)
        .resize(128, 128, {
          fit: 'cover',
          position: 'center',
        })
        .webp()
        .toBuffer();

      // generate the object path
      const path = `users/${userId}/avatar.webp`;
      picturePath = await this.serv.patchPicture(userId, sharpedFile, path);
      if (picturePath) {
        // updating the current session with the new picture path
        req.session.passport.user.picture = path;
      }
    }
    return { picture: picturePath };
  }

  /**
   * Method used to update personal information of the auth
   * @param {UsersPatchPersoInfoDTO} userPersoInfo the new personnal information to update
   * @param {Request} req
   * @returns {UsersPatchPersoInfoDTO | undefined} the updated and formatted personnal information or nothing
   */
  @UseGuards(AuthenticatedGuard)
  @Patch('personnal-information')
  public async patchPersonnalInformation(
    @Body() userPersoInfo: UsersPatchPersoInfoDTO,
    @Request() req,
  ): Promise<UsersPatchPersoInfoDTO | undefined> {
    const userId = req?.user?.id;
    const patchedUserPersoInfo = await this.serv.patchPersonnalInformation(
      userId,
      userPersoInfo,
    );

    if (patchedUserPersoInfo && typeof patchedUserPersoInfo === 'object') {
      // updating the current session with the patched data
      Object.keys(patchedUserPersoInfo)?.map((key) => {
        req.session.passport.user[key] = patchedUserPersoInfo[key];
      });

      return patchedUserPersoInfo;
    }
    return undefined;
  }

  /**
   * Method used to patch identity information of the auth
   * @param {UsersIdentityDTO} userIdentity new identity information to update
   * @param {Request} req
   * @returns {UsersIdentityDTO | undefined} the updated and formatted identity information or nothing
   */
  @UseGuards(AuthenticatedGuard)
  @Patch('identity')
  public async patchIdentity(
    @Body() userIdentity: UsersIdentityDTO,
    @Request() req,
  ): Promise<UsersIdentityDTO | undefined> {
    const {
      id: userId,
      email: userEmail,
      emailVerified: userEmailVerified,
      phoneNumber: userPhoneNumber,
      phoneNumberVerified: userPhoneNumberVerified,
    } = req?.user;

    // Formatted current identity data
    const currentUserIdentity = UsersIdentityDTO.from({
      email: userEmail,
      emailVerified: userEmailVerified,
      phoneNumber: userPhoneNumber,
      phoneNumberVerified: userPhoneNumberVerified,
    });

    // Patch in db
    const patchedUserIdentity = await this.serv.patchIdentity(
      userId,
      currentUserIdentity,
      userIdentity,
    );

    if (patchedUserIdentity && typeof patchedUserIdentity === 'object') {
      // updating the current session with the patched data
      Object.keys(patchedUserIdentity)?.map((key) => {
        req.session.passport.user[key] = patchedUserIdentity[key];
      });

      return patchedUserIdentity;
    }
    return undefined;
  }

  /**
   * Method used to patch the password of the auth
   * @param {UsersPasswordDTO} userPassword old, new and confirmed password to update
   * @param {Request} req
   * @returns {boolean} determine if the password has been patched
   */
  @UseGuards(AuthenticatedGuard)
  @Patch('password')
  public async patchPassword(
    @Body() userPassword: UsersPasswordDTO,
    @Request() req,
  ): Promise<boolean> {
    // Retreaving auth information
    const { id: userId, login: userLogin } = req?.user;

    // Patch in db
    const patchedUserPassword = await this.serv.patchPassword(
      userId,
      userLogin,
      userPassword,
    );

    return patchedUserPassword;
  }

  /**
   * Method used to patch external links profile and website of the auth
   * @param {UsersLinksDTO} userLinks external links profile and website to update
   * @param {Request} req
   * @returns {UsersLinksDTO | undefined} determine if external links profile and website has been patched
   */
  @UseGuards(AuthenticatedGuard)
  @Patch('links')
  public async patchLinks(
    @Body() userLinks: UsersLinksDTO,
    @Request() req,
  ): Promise<UsersLinksDTO | undefined> {
    // Retreaving auth information
    const { id: userId } = req?.user;

    // Patch in db
    const patchedUserLinks = await this.serv.patchLinks(userId, userLinks);

    if (patchedUserLinks && typeof patchedUserLinks === 'object') {
      // updating the current session with the patched data
      Object.keys(patchedUserLinks)?.map((key) => {
        req.session.passport.user[key] = patchedUserLinks[key];
      });

      return patchedUserLinks;
    }
    return undefined;
  }

  /**
   * Method used to patch geographique data zoneinfo and locale of the auth
   * @param {UsersGeoDataDTO} userGeoData geographique data zoneinfo and locale to update
   * @param {Request} req
   * @returns {UsersGeoDataDTO | undefined} determine if geographique data zoneinfo and locale has been patched
   */
  @UseGuards(AuthenticatedGuard)
  @Patch('geo-data')
  public async patchGeoData(
    @Body() userGeoData: UsersGeoDataDTO,
    @Request() req,
  ): Promise<UsersGeoDataDTO | undefined> {
    // Retreaving auth information
    const { id: userId } = req?.user;

    // Patch in db
    const patchedGeoData = await this.serv.patchGeoData(userId, userGeoData);

    if (patchedGeoData && typeof patchedGeoData === 'object') {
      // updating the current session with the patched data
      Object.keys(patchedGeoData)?.map((key) => {
        req.session.passport.user[key] = patchedGeoData[key];
      });

      return patchedGeoData;
    }

    return undefined;
  }

  /**
   * Method used send userInfo to the client with a unique id depending
   * of the client
   * @param req *
   * @param {Response} res express response object to response to the client
   * @returns the response with a status and a message
   */
  @UseGuards(JwtAuthGuard)
  @Get('userinfo')
  public async getUserinfo(@Request() req, @Res() res: Response): Promise<any> {
    console.log('============userinfo============');
    // Calling a service to retreave user info from a subject id (sub) and it's associated client id
    const { id, ...profile } = await this.serv.profile(
      req?.user?.sub,
      req?.user?.client_id,
    );

    // * Response Messages
    return res.status(HttpStatus.OK).json({ sub: id, ...profile });
  }

  // @UseGuards(OidcAuthGuard)
  @Get('callback')
  public async callback() {
    console.log('============callback============');
    // res.redirect('/');
    return true;
  }

  /**
   * Authorization Endpoint : https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
   * The Authorization Endpoint performs Authentication of the End-User.
   * This is done by sending the User Agent to the Authorization Server's Authorization Endpoint for Authentication and Authorization,
   * using request parameters defined by OAuth 2.0 and additional parameters and parameter values defined by OpenID Connect.
   */
  @Get('authorize')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async authorize(
    @Request() req,
    /**
     * Authentication Request Validation : https://openid.net/specs/openid-connect-core-1_0.html#AuthRequestValidation
     * 1. The Authorization Server MUST validate all the OAuth 2.0 parameters according to the OAuth 2.0 specification.
     * 2. Verify that a scope parameter is present and contains the openid scope value.
     * 3. The Authorization Server MUST verify that all the REQUIRED parameters are present and their usage conforms to this specification.
     */
    @Query() query: AuthorizeDTO,
    @Res() res: Response,
  ): Promise<any> {
    console.log('============authorize============');
    // Just Cast from DTO to JSON
    const parsedQuery = JSON.parse(JSON.stringify(query));

    /**
     * TODO : 4 - Si sub (sujet) est dans claims avec une valeur spécifique pour l'ID Token,
     * le serveur d'autorisation DOIT uniquement envoyer une réponse positive si l'utilisateur final identifié
     * par la valeur sub a une session active avec le serveur d'autorisation ou a été authentifié en tant que un résultat de la demande.
     * Le serveur d'autorisation NE DOIT PAS répondre avec un ID Token ou un Access Token pour un autre utilisateur,
     * même s'il a une session active avec le serveur d'autorisation.
     * Une telle demande peut être faite soit en utilisant un paramètre id_token_hint,
     * soit en demandant une valeur de réclamation spécifique comme décrit au paragraphe 5.5.1,
     * si le paramètre claims est pris en charge par la mise en œuvre.
     */
    const { claims } = query;
    console.log('<authorize> claims: ', claims); // TODO: 4
    if (claims?.sub) {
      return true;
    }

    // Redirect the user to the login url with all clients information
    // * Response redirection
    const redirectUrl = querystring.stringify(parsedQuery);
    res.redirect(
      HttpStatus.MOVED_PERMANENTLY,
      `${oidcConstants.loginURL}?${redirectUrl}`,
    );
    return true;
  }

  /**
   * Method used to logout a user and destroy his session
   */
  @Get('logout')
  async logout(@Req() req: Express.Request, @Res() res: Response) {
    req.logout((err) => {
      if (!err) {
        req.session.destroy(async (error) => {
          if (!error) {
            res.redirect(oidcConstants?.frontUrl);
          }
        });
      }
    });
  }
}
