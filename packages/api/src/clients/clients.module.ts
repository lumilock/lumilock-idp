import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../model/clients.entity';
import { ClientsService } from './clients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
