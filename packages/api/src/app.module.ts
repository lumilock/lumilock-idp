import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { UsersClientsModule } from './users-clients/users-clients.module';
import { CodesModule } from './codes/codes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ConfigModule.forRoot(),
    MailerModule.forRoot(configService.getMailerConfig()),
    AuthModule,
    UsersModule,
    ClientsModule,
    UsersClientsModule,
    CodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
