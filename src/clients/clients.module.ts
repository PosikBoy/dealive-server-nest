import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { clientsProvider } from './clients.providers';
import { ClientsController } from './clients.controller';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [TokensModule],
  providers: [ClientsService, ...clientsProvider],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
