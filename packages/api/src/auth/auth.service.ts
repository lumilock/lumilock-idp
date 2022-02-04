import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  // Login the user
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
