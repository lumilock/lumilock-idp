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
  HttpStatus,
  Res,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
// import { UsersDTO } from '../users/users.dto';
import * as querystring from 'query-string';
import { AuthService } from './auth.service';
import { AuthorizeDTO } from './authorize.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { oidcConstants } from './oidcConstants';
import { ClientsService } from '../clients/clients.service';
import { UsersClientsService } from '../users-clients/users-clients.service';
import { CodesService } from '../codes/codes.service';
import { CodesDTO } from '../codes/codes.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
// import { AuthenticatedGuard } from '../common/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private serv: AuthService,
    private cliServ: ClientsService,
    private usrCliServ: UsersClientsService,
    private codeServ: CodesService,
  ) {}

  // TODO add request axios that asked on specific route if user+ password as consent for spécific client_id, if yes classic form post
  /**
   * Authorization Server Authenticates End-User : https://openid.net/specs/openid-connect-core-1_0.html#Authenticates
   * Authorization Server Obtains End-User Consent/Authorization : https://openid.net/specs/openid-connect-core-1_0.html#Consent
   * Login the user and check it's consent for the current application
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response, // { passthrough: true }
  ) {
    try {
      console.log('<login> Start: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      const { query, user } = req; // destructurate request params usefull
      console.log('user', user);
      const { redirect_uri: queryRedirectUri, client_id: queryClientId } =
        query; // destructurate query params
      console.log('query', query);
      const queryConsent = query?.consent === 'true'; // check if consent is present in query params
      const state = query?.state ? { state: query?.state } : {}; // checking if state query params is present, this var will be add in responses
      console.log('queryRedirectUri', queryRedirectUri);
      console.log('queryClientId', queryClientId);
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

        return res.redirect(
          HttpStatus.FOUND,
          `${queryRedirectUri}?${redirectQParams}`,
        );
      }

      // if we have not previous error and we have redirect_uri query params
      // a rp trying to login a end-user
      if (queryRedirectUri) {
        // Checking if client has user auth
        const consent = await this.serv.checkUserConsent(
          user?.id, // id of the user we want to check
          queryClientId, // id of the client we want to check
        );

        // Retreave client infos
        const clientInfos = await this.cliServ.findById(queryClientId);

        if (!consent && !queryConsent) {
          // there is no consent in the db and not in query params
          // so we will ask the consent to the user
          if (!clientInfos) {
            // If the client doesn't exist
            // We redirect to the callback with an error
            const redirectParams = querystring.stringify({
              error: 'relying_party_not_know',
              error_description:
                'The Relying party is not authorize to access to our oidc',
              ...state, // will add state if exist
            });

            console.log('<login> End RP not know: <<<<<<<<<<<<<<<<<<<<<<<<<<<');
            console.log('');
            return res.redirect(
              HttpStatus.FOUND,
              `${queryRedirectUri}?${redirectParams}`,
            );
          }
          // Else if the client exist we send client infos to ask consent to the end user
          console.log('<login> clientInfos', clientInfos);

          console.log('<login> End ask consent: <<<<<<<<<<<<<<<<<<<<<<<<<<<');
          console.log('');
          // TODO redirect consent page
          res.status(200).send({
            error: 'consent_required',
            clientInfos: clientInfos,
          });
          return;
        } else if (!consent && queryConsent) {
          // there is no consent in the db but there is in the query
          // so we will set the consent in the db
          await this.usrCliServ.patchOrCreateAuthorization(
            user?.id, // id of the user we want to check
            queryClientId, // id of the client we want to check
            queryConsent, // user consent value
          );
        }

        // after having the consent we will generate an authorization code for the RP
        const code = await this.serv.authenticate(clientInfos, user);
        console.log('<login> code', code);
        const clientIssuer = oidcConstants.issuer;
        // Defining the sessionKey
        const sessionKey = `oidc:${new URL(clientIssuer).hostname}`;
        console.log(sessionKey);
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
        console.log(
          '<login> End redirect with code: <<<<<<<<<<<<<<<<<<<<<<<<<<<',
        );
        console.log('', `${queryRedirectUri}?${redirectParams}`);
        return res
          .cookie(sessionKey, sessionValue, sessionOptions) // TODO check session id
          .set({
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
            'Access-Control-Allow-Origin': ['https://192.168.99.1:3001'],
            'Access-Control-Allow-Credentials': true,
            // Origin: ['https://192.168.99.1:3000'],
            // Referer: ['https://192.168.99.1:3000'],
          })
          .redirect(HttpStatus.FOUND, `${queryRedirectUri}?${redirectParams}`);
      }
      // The OAuth app trying to login a end-user
      return res.redirect(HttpStatus.FOUND, oidcConstants.frontUrl);
    } catch (error) {
      console.log('<login> error', error);
    }
  }

  // @UseGuards(AuthenticatedGuard)
  // // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // public async getProfile(@Request() req): Promise<UsersDTO> {
  //   return await this.serv.profileById(req?.user?.userId);
  // }

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
    console.log('<token> Start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log('<token> headers', req.headers);
    const { client_id, grant_type, code, redirect_uri } = body;
    console.log(
      '<getToken> (client_id, grant_type, code, redirect_uri)',
      client_id,
      grant_type,
      code,
      redirect_uri,
    );

    // TODO 1.
    // (2) Ensure the Authorization Code was issued to the authenticated Client.
    // And (3) Verify that the Authorization Code is valid.
    const valideCode: CodesDTO | undefined =
      await this.codeServ.checkAssociation(client_id, code);
    console.log('<getToken> valideCode : ', valideCode);

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
    console.log('<token> tokens:', tokens);

    console.log('<token> sessionId', req?.session?.id);
    console.log('<token> End redirect with tokens <<<<<<<<<<<<<<<<<<<<<<<<<<');
    console.log('');
    // if everything has been verifying with success we can generate an ID Token and redirect the user
    return res
      .status(HttpStatus.OK)
      .set({ 'Cache-Control': 'no-store', Pragma: 'no-cache' })
      .json(tokens);
  }

  @Post('reset-password')
  public async resetPassword(
    @Request() req,
    @Body() body,
    @Res() res: Response,
  ): Promise<any | undefined> {
    const { identity }: { identity: string } = body;

    const profileEmail = await this.serv.getEmail(identity);

    // Success case only return the email and the status
    if (profileEmail?.status === 'FOUND') {
      return res.status(HttpStatus.OK).json(profileEmail?.message);
    } else if (profileEmail?.status === 'NOT_FOUND') {
      // Error case when no user exist
      return res.status(HttpStatus.BAD_REQUEST).json(profileEmail?.message);
    }
    // All other errors case returning the error message
    return res.status(HttpStatus.NO_CONTENT).json(profileEmail?.message);
  }

  @UseGuards(JwtAuthGuard)
  @Get('userinfo')
  public async getUserinfo(@Request() req, @Res() res: Response): Promise<any> {
    console.log('<getUserinfo> userInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log('<getUserinfo> req?.user', req?.user);
    console.log('<getUserinfo> req?.session', req?.session);
    const { id, ...profile } = await this.serv.profile(
      req?.user?.sub,
      req?.user?.client_id,
    );
    console.log({ sub: id, ...profile });
    console.log('<getUserinfo> End <<<<<<<<<<<<<<<<<<<<');
    return res.status(HttpStatus.OK).json({ sub: id, ...profile });
  }

  // @UseGuards(OidcAuthGuard)
  @Get('callback')
  public async callback() {
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
    console.log('<authorize> Start: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const parsedQuery = JSON.parse(JSON.stringify(query));
    console.log('<authorize> req.session: ', req.session);
    console.log('<authorize> req.session.id: ', req.session.id);
    console.log('<authorize> query: ', parsedQuery);
    console.log('<authorize> req.session: ', req.session);
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
    console.log('<authorize> claims: ', claims);
    if (claims?.sub) {
      console.log('<authorize> End claims sub: <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
      console.log('');
      return true;
    }
    const redirectUrl = querystring.stringify(parsedQuery);
    console.log('<authorize> End redirect: <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    console.log('');
    res.redirect(
      HttpStatus.MOVED_PERMANENTLY,
      `${oidcConstants.loginURL}?${redirectUrl}`,
    );
    return true;
  }
}
