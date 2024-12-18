import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { clientsProvider } from './clients.providers';
import { ClientsController } from './clients.controller';
import { TokensModule } from '@/tokens/tokens.module';
import { UserModule } from '@/users/user.module';

@Module({
  imports: [TokensModule, UserModule],
  providers: [ClientsService, ...clientsProvider],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
