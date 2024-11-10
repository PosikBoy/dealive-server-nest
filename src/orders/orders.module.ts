import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ordersRepository } from './orders.providers';
import { OrdersController } from './orders.controller';
import { addressesRepository } from '@/addresses/addresses.providers';

@Module({
  providers: [OrdersService, ...ordersRepository, ...addressesRepository],
  controllers: [OrdersController],
})
export class OrdersModule {}
