import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('/:id')
  async getOrderById(@Param('id') id: number) {
    const order = await this.ordersService.getOrderById(id);
    return order;
  }
  @Post('/create')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.createOrder(createOrderDto);
    return order;
  }
}
