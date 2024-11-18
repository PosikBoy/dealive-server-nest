import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ordersRepository } from './orders.providers';
import {
  ClientOrdersController,
  CourierOrdersController,
} from './orders.controller';
import { addressesRepository } from '@/addresses/addresses.providers';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  providers: [OrdersService, ...ordersRepository, ...addressesRepository],
  controllers: [ClientOrdersController, CourierOrdersController],
  imports: [TokensModule],
})
export class OrdersModule {}
