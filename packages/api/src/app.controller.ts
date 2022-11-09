import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { oidcConfiguration } from './auth/oidcConfiguration';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('.well-known/openid-configuration')
  public async openidConfiguration() {
    return oidcConfiguration;
  }
}
