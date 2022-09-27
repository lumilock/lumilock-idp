import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { ClientsModule } from '../clients/clients.module';
import { UsersClientsModule } from '../users-clients/users-clients.module';
import { CodesModule } from '../codes/codes.module';
import { LocalSerializer } from './local.serializer';
import { oidcConstants } from './oidcConstants';

// tuto
// https://docs.nestjs.com/security/authentication#implement-protected-route-and-jwt-strategy-guards
// Blacklist
// https://auth0.com/blog/denylist-json-web-token-api-keys/
@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'local',
      session: true,
    }),
    JwtModule.register({
      secret: oidcConstants.accessTokenSecret,
      signOptions: { expiresIn: `${oidcConstants.accessTokenDuration}s` },
    }),
    ClientsModule,
    UsersClientsModule,
    CodesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalSerializer, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
