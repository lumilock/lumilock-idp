import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersClientsService } from './users-clients.service';
import { UsersClients } from '../model/users_clients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersClients])],
  providers: [UsersClientsService],
  exports: [UsersClientsService],
})
export class UsersClientsModule {}
