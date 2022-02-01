// auth.controller.ts

import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
  Query,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { UsersDTO } from 'src/users/users.dto';
import * as querystring from 'query-string';
import { AuthService } from './auth.service';
import { AuthorizeDTO } from './authorize.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { OidcAuthGuard } from './oidc.guard';
import { oidcConstants } from './oidcConstants';

@Controller('auth')
export class AuthController {
  constructor(private serv: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req) {
    // 1. login user
    // 2. check if service is auth to client
    // 2.1. if not return message to Obtains End-User Consent/Authorization
    // 2.2. if yes check if state is present
    // 3. return code&state
    console.log('req', req);
    return this.serv.login(req.user);
  }

  @UseGuards(OidcAuthGuard)
  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  public async getProfile(@Request() req): Promise<UsersDTO> {
    return await this.serv.profile(req?.user?.userId);
  }

  @UseGuards(OidcAuthGuard)
  @Get('callback')
  public async callback(@Request() req, @Response() res) {
    res.redirect('/');
  }

  @Get('authorize')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async authorize(
    @Request() req,
    // 1. Le serveur d'autorisation DOIT valider tous les paramètres OAuth 2.0 conformément à la spécification OAuth 2.0.
    // 2. Vérifiez qu'un paramètre scope est présent et contient la valeur scope openid. (Si aucune valeur scope openid n'est présente, la demande peut toujours être une demande OAuth 2.0 valide, mais n'est pas une demande OpenID Connect.)
    // 3. Le serveur d'autorisation DOIT vérifier que tous les paramètres EXIGÉS sont présents et que leur utilisation est conforme à la présente spécification.
    @Query() query: AuthorizeDTO,
    @Response() res,
  ): Promise<any> {
    const parsedQuery = JSON.parse(JSON.stringify(query));
    console.log('query: ', parsedQuery);
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
    console.log(redirectUrl);
    res.redirect(
      HttpStatus.MOVED_PERMANENTLY,
      `${oidcConstants.loginURL}?${redirectUrl}`,
    );
    return true;
  }
}
