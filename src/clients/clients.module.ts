import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { clientsProvider } from './clients.providers';
import { ClientsController } from './clients.controller';

@Module({
  providers: [ClientsService, ...clientsProvider],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
