import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ordersRepository } from './orders.providers';
import { OrdersController } from './orders.controller';
import { addressesRepository } from '@/addresses/addresses.providers';
import { TokensModule } from '@/tokens/tokens.module';
import { ClientsModule } from '@/clients/clients.module';
import { OrderActionsModule } from '@/order-actions/order-actions.module';
import { UserModule } from '@/users/user.module';

@Module({
  providers: [OrdersService, ...ordersRepository, ...addressesRepository],
  controllers: [OrdersController],
  imports: [TokensModule, ClientsModule, OrderActionsModule, UserModule],
})
export class OrdersModule {}
