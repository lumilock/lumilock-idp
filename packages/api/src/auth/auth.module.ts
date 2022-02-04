import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { OidcStrategy } from './oidc.strategy';
import { AuthController } from './auth.controller';
import { ClientsModule } from '../clients/clients.module';

// tuto
// https://docs.nestjs.com/security/authentication#implement-protected-route-and-jwt-strategy-guards
// Blacklist
// https://auth0.com/blog/denylist-json-web-token-api-keys/
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    ClientsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, OidcStrategy],
  exports: [AuthService],
})
export class AuthModule {}
