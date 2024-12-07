import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { JwtGuard, OptionalJwtGuard, RolesGuard } from '@/auth/auth.guards';
import { Request } from 'express';
import { Roles } from '@/auth/decorators/roles-auth.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Messages } from '@/constants/messages';
import { swaggerExamples } from '@/constants/swaggerExamples';
import { ApiResponses } from '@/constants/swaggerResponses';
import TakeOrderDto from './dtos/take-order.dto';

@ApiTags('Работа с заказами')
@Controller('')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Получение заказа по id' })
  @ApiResponse({
    status: 200,
    description: 'Заказ получен',
    example: swaggerExamples.orderResponse,
  })
  @ApiResponses.Unauthorized
  @ApiResponses.InvalidToken
  @UseGuards(JwtGuard)
  @Get('order/:id')
  async getOrderById(@Param('id') id: number, @Req() request: Request) {
    const user = request.user;
    const order = await this.ordersService.getOrderById(id, user);
    return order;
  }

  @ApiOperation({ summary: 'Создание заказа' })
  @ApiResponse({
    status: 201,
    description: 'Заказ успешно создан',
    example: swaggerExamples.orderResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Невалидные данные',
    example: {
      message: Messages.ORDER_CREATE_ERROR,
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponses.Unauthorized
  @ApiResponses.InvalidToken
  @UseGuards(OptionalJwtGuard)
  @Post('order/create')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ) {
    const user = request.user;
    const order = await this.ordersService.createOrder(createOrderDto, user);
    return order;
  }

  @ApiOperation({ summary: 'Получение всех заказов' })
  @ApiResponse({
    status: 200,
    description: 'Все заказы пользователя',
    example: [swaggerExamples.orderResponse, swaggerExamples.orderResponse],
  })
  @ApiResponses.Unauthorized
  @UseGuards(JwtGuard)
  @Get('orders')
  async getAllOrders(@Req() request: Request) {
    const user = request.user;
    const orders = await this.ordersService.getAllOrders(user);
    return orders;
  }

  @ApiOperation({ summary: 'Получение доступных заказов' })
  @ApiResponse({
    status: 200,
    description: 'Все доступные заказы для курьера',
    example: [swaggerExamples.orderResponse, swaggerExamples.orderResponse],
  })
  @ApiResponses.Unauthorized
  @ApiResponses.InvalidToken
  @Roles('courier')
  @UseGuards(RolesGuard)
  @Get('orders/available')
  async getAvailableOrders() {
    const orders = await this.ordersService.getAvailableOrders();
    return orders;
  }

  @ApiOperation({ summary: 'Получение активных заказов' })
  @ApiResponse({
    status: 200,
    description: 'Все активные заказы для курьера',
    example: [
      swaggerExamples.orderResponseWithoutSensitiveInfo,
      swaggerExamples.orderResponseWithoutSensitiveInfo,
    ],
  })
  @ApiResponses.Unauthorized
  @ApiResponses.InvalidToken
  @Roles('courier')
  @UseGuards(RolesGuard)
  @Get('orders/active')
  async getActiveOrders(@Req() request: Request) {
    const courier = request.user;
    const orders = await this.ordersService.getActiveOrders(courier);
    return orders;
  }
  @ApiResponse({
    status: 200,
    description: 'Заказ взят',
    example: swaggerExamples.orderResponse,
  })
  @ApiResponses.Unauthorized
  @ApiResponses.InvalidToken
  @Roles('courier')
  @UseGuards(RolesGuard)
  @Put('/order/take')
  async takeOrder(@Body() takeOrderDto: TakeOrderDto, @Req() request: Request) {
    const user = request.user;
    const order = await this.ordersService.takeOrder(
      takeOrderDto.orderId,
      user,
    );
    console.log('order', order);
    return order;
  }
}
