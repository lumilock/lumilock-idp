import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from '../model/users.entity';
import { UsersController } from './users.controller';
import { Client } from '../model/clients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Client])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
