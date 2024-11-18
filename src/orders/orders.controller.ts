import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ClientJwtGuard, CourierJwtGuard } from '@/auth/auth.guards';
import { Request } from 'express';

@Controller('client')
export class ClientOrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(ClientJwtGuard)
  @Get('order/:id')
  async getOrderById(@Param('id') id: number, @Req() request: Request) {
    const user = request.user;
    const order = await this.ordersService.getClientOrderById(id, user);
    return order;
  }

  @Post('order/create')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.createOrder(createOrderDto);
    return order;
  }

  @UseGuards(ClientJwtGuard)
  @Get('orders')
  async getAllOrders(@Req() request: Request) {
    const user = request.user;
    const orders = await this.ordersService.getClientAllOrders(user);
    return orders;
  }
}

@Controller('courier/orders')
export class CourierOrdersController {
  constructor(private ordersService: OrdersService) {}

  //Получить доступные для выполнения заказы
  @UseGuards(CourierJwtGuard)
  @Get('available')
  async getAvailableOrders() {
    const orders = await this.ordersService.getCourierAvailableOrders();
    return orders;
  }

  // Получить активные заказы
  @UseGuards(CourierJwtGuard)
  @Get('active')
  async getTakenOrders(@Req() request: Request) {
    const courier = request.user;
    const orders = await this.ordersService.getActiveOrders(courier);
    return orders;
  }

  // Получить данные о заказе
  @UseGuards(CourierJwtGuard)
  @Get(':orderId')
  async getOrderById(
    @Param('orderId') orderId: number,
    @Req() request: Request,
  ) {
    const courier = request.user;
    const order = await this.ordersService.getCourierOrderById(
      orderId,
      courier,
    );
    return order;
  }

  // Взять заказ
  @UseGuards(CourierJwtGuard)
  @Post(':orderId/take')
  async takeOrder(@Param('orderId') orderId: number, @Req() request: Request) {
    const user = request.user;
    const order = await this.ordersService.takeOrder(orderId, user);
    return order;
  }
}
