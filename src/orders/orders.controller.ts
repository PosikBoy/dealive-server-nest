import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('/:id')
  getOrderById(@Param('id') id: number) {
    const order = this.ordersService.getOrderById(id);
    return order;
  }
}
