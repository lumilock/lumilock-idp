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
} from '@nestjs/common';
import { UsersDTO } from 'src/users/users.dto';
import * as querystring from 'query-string';
import { AuthService } from './auth.service';
import { AuthorizeDTO } from './authorize.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { OidcAuthGuard } from './oidc.guard';
import { oidcConstants } from './oidcConstants';
import { ClientsService } from '../clients/clients.service';
import { UsersClientsService } from '../users-clients/users-clients.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private serv: AuthService,
    private cliServ: ClientsService,
    private usrCliServ: UsersClientsService,
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
    // if (!query?.consent && !consent) {
    //   const redirectUrl = querystring.stringify({
    //     error: 'consent_required',
    //     error_description: 'The Authorization Server requires End-User consent',
    //     ...state, // will add state if exist
    //   });
    //   console.log('<login> redirectUrl', redirectUrl);
    //   console.log(
    //     '<login> redirectUrl',
    //     `${query?.redirect_uri || oidcConstants.callbackURL}?${redirectUrl}`,
    //   );
    //   return null;
    // }
    console.log('<login> consent', consent);
    // 2.1. if not return message to Obtains End-User Consent/Authorization
    // 2.2. if yes check if state is present
    // 3. return code&state
    console.log('<login> req', query);
    console.log(this.serv.authenticate(clientInfos));
    const login = await this.serv.login(user);
    return res.status(200).send(login);
  }

  @UseGuards(OidcAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  public async getProfile(@Request() req): Promise<UsersDTO> {
    return await this.serv.profile(req?.user?.userId);
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
