import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ordersRepository } from './orders.providers';
import { OrdersController } from './orders.controller';

@Module({
  providers: [OrdersService, ...ordersRepository],
  controllers: [OrdersController],
})
export class OrdersModule {}
