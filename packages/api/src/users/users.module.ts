import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Client } from '../model/clients.entity';
import { User } from '../model/users.entity';
import { UsersController } from './users.controller';
import { UsersClientsModule } from '../users-clients/users-clients.module';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Client]), UsersClientsModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
