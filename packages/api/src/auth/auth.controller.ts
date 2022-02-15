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
import { UsersDTO } from '../users/users.dto';
import * as querystring from 'query-string';
import { AuthService } from './auth.service';
import { AuthorizeDTO } from './authorize.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { OidcAuthGuard } from './oidc.guard';
import { oidcConstants } from './oidcConstants';
import { ClientsService } from '../clients/clients.service';
import { UsersClientsService } from '../users-clients/users-clients.service';
import { CodesService } from '../codes/codes.service';
import { CodesDTO } from 'src/codes/codes.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private serv: AuthService,
    private cliServ: ClientsService,
    private usrCliServ: UsersClientsService,
    private codeServ: CodesService,
  ) {}

  // 1. login user
  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async login(@Request() req, @Res() res: Response) {
    const { query, user } = req; // destructurate request params usefull
    const queryConsent = query?.consent === 'true';
    const state = query?.state ? { state: query?.state } : {}; // checking if state query params is present

    // 2. check if client has user auth
    const consent = await this.serv.checkUserConsent(
      user?.id, // id of the user we want to check
      query?.client_id, // id of the client we want to check
    );
    console.log('<login> clientIds', query?.client_id, oidcConstants?.clientID);
    const clientInfos = await this.cliServ.findById(query?.client_id);
    // Checking if we trying to login in from a RP
    if (query?.client_id !== oidcConstants?.clientID) {
      console.log('<login> consent', consent, queryConsent);
      if (!consent && !queryConsent) {
        // there is no consent in the db and not in query params
        // so we will ask the consent to the user
        // If the client doesn't exist
        if (!clientInfos) {
          const redirectUrl = querystring.stringify({
            error: 'relying_party_not_know',
            error_description:
              'The Relying party is not authorize to access to our oidc',
            ...state, // will add state if exist
          });
          console.log('<login> redirectUrl', redirectUrl);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const callbackURL = query?.redirect_uri || oidcConstants.callbackURL;
          return res.redirect(
            HttpStatus.MOVED_PERMANENTLY,
            `${callbackURL}?${redirectUrl}`,
          );
        }
        console.log('<login> clientInfos', clientInfos);
        // Return what consent required message
        return res.status(200).send({
          error: 'consent_required',
          clientInfos: clientInfos,
        });
      } else if (!consent && queryConsent) {
        // there is no consent in the db but there is in the query
        // so we will set the consent in the db
        await this.usrCliServ.patchOrCreateAuthorization(
          user?.id, // id of the user we want to check
          query?.client_id, // id of the client we want to check
          queryConsent, // user consent value
        );
      }
    }
    console.log('<login> consent', consent);
    // 2.1. if not return message to Obtains End-User Consent/Authorization
    // 2.2. if yes check if state is present
    // 3. return code&state
    console.log('<login> req', query);
    const code = await this.serv.authenticate(clientInfos, user);
    console.log('<login> code', code);

    const redirectUrl = querystring.stringify({
      code, // RP authorization code
      ...state, // will add state if exist
    });
    console.log('<login> redirectUrl', redirectUrl);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const callbackURL = query?.redirect_uri || oidcConstants.callbackURL;
    return res.redirect(
      HttpStatus.MOVED_PERMANENTLY,
      `${callbackURL}?${redirectUrl}`,
    );
    // const login = await this.serv.login(user);
    // return res.status(200).send(login);
  }

  @UseGuards(OidcAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  public async getProfile(@Request() req): Promise<UsersDTO> {
    return await this.serv.profile(req?.user?.userId);
  }

  // @UseGuards(OidcAuthGuard)
  // @UseGuards(JwtAuthGuard)
  /**
   * The Authorization Server MUST validate the Token Request as follows:
   * 1. Authenticate the Client if it was issued Client Credentials or if it uses another Client Authentication method, per Section 9(https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication).
   * 2. Ensure the Authorization Code was issued to the authenticated Client.
   * 3. Verify that the Authorization Code is valid.
   * 4.(move to end) If possible, verify that the Authorization Code has not been previously used.
   * 5. Ensure that the redirect_uri parameter value is identical to the redirect_uri parameter value that was included in the initial Authorization Request. If the redirect_uri parameter value is not present when there is only one registered redirect_uri value, the Authorization Server MAY return an error (since the Client should have included the parameter) or MAY proceed without an error (since OAuth 2.0 permits the parameter to be omitted in this case).
   * 6. Verify that the Authorization Code used was issued in response to an OpenID Connect Authentication Request (so that an ID Token will be returned from the Token Endpoint).
   * */
  @Post('token')
  public async getToken(@Request() req, @Body() body): Promise<boolean> {
    console.log('req', req.headers);
    const { client_id, grant_type, code, redirect_uri } = body;
    console.log(
      '<getToken> (client_id, grant_type, code, redirect_uri)',
      client_id,
      grant_type,
      code,
      redirect_uri,
    );
    // TODO 1.
    // 2. Ensure the Authorization Code was issued to the authenticated Client.
    // 3. Verify that the Authorization Code is valid.
    const valideCode: CodesDTO | undefined =
      await this.codeServ.checkAssociation(client_id, code);
    console.log('<getToken> valideCode : ', valideCode);

    if (!valideCode) {
      throw new Error(
        'Your authentification code is not valide, have been already used, or have expired.',
      );
    }
    // 5. Ensure that the redirect_uri parameter value is identical to the redirect_uri parameter value that was included in the initial Authorization Request.
    // If the redirect_uri parameter value is not present when there is only one registered redirect_uri value,
    // the Authorization Server MAY return an error (since the Client should have included the parameter) or
    // MAY proceed without an error (since OAuth 2.0 permits the parameter to be omitted in this case).
    if (!redirect_uri || valideCode?.client?.callbackUrl !== redirect_uri) {
      throw new Error(
        'redirect_uri is missing or does not correspond to the client redirect uri',
      );
    }
    // 6. Verify that the Authorization Code used was issued in response to an OpenID Connect Authentication Request (so that an ID Token will be returned from the Token Endpoint).
    if (grant_type !== 'authorization_code' && valideCode?.scope === 'openid') {
      throw new Error(
        'The Authorization Code used need to be issued in response to an OpenID Connect Authentication Request',
      );
    }

    // 4.(move to end) If possible, verify that the Authorization Code has not been previously used.
    // we remove this code because it have been used
    await this.codeServ.removeById(valideCode.id);
    const tokens = this.serv.getToken(valideCode);
    console.log(tokens);
    // if everything has been verifying with success we can generate an ID Token and redirect the user
    // Cache-Control	no-store
    // Pragma	no-cache
    return true;
  }

  // @UseGuards(OidcAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @Get('userinfo')
  public async getUserinfo(@Request() req): Promise<boolean> {
    console.log('<getUserinfo> req', req);
    console.log('<getUserinfo> here');
    return true;
  }

  // @UseGuards(OidcAuthGuard)
  @Get('callback')
  public async callback() {
    // res.redirect('/');
    return true;
  }

  @Get('authorize')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async authorize(
    @Request() req,
    // 1. Le serveur d'autorisation DOIT valider tous les paramètres OAuth 2.0 conformément à la spécification OAuth 2.0.
    // 2. Vérifiez qu'un paramètre scope est présent et contient la valeur scope openid. (Si aucune valeur scope openid n'est présente, la demande peut toujours être une demande OAuth 2.0 valide, mais n'est pas une demande OpenID Connect.)
    // 3. Le serveur d'autorisation DOIT vérifier que tous les paramètres EXIGÉS sont présents et que leur utilisation est conforme à la présente spécification.
    @Query() query: AuthorizeDTO,
    @Res() res: Response,
  ): Promise<any> {
    const parsedQuery = JSON.parse(JSON.stringify(query));
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
    if (claims?.sub) {
      return true;
    }
    const redirectUrl = querystring.stringify(parsedQuery);
    console.log('<authorize> redirectUrl', redirectUrl);
    res.redirect(
      HttpStatus.MOVED_PERMANENTLY,
      `${oidcConstants.loginURL}?${redirectUrl}`,
    );
    return true;
  }
}
