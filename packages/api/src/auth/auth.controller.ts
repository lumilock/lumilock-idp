// auth.controller.ts

import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { UsersDTO } from 'src/users/users.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private serv: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req) {
    return this.serv.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public async getProfile(@Request() req): Promise<UsersDTO> {
    return await this.serv.profile(req?.user?.userId);
  }
}
