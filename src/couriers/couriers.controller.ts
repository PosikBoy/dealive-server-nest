import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CouriersService } from './couriers.service';
import { CourierCreateDto } from './dtos/create-courier.dto';
import { CourierJwtGuard } from '@/auth/auth.guards';
import { Request } from 'express';

@Controller('courier')
export class CouriersController {
  constructor(private couriersService: CouriersService) {}

  @Get('/:id')
  @UseGuards(CourierJwtGuard)
  async getCourierById(@Req() request: Request) {
    const id = request.user.id;
    return await this.couriersService.findCourierById(id);
  }

  @Post('create')
  async create(@Body() courierDto: CourierCreateDto) {
    return await this.couriersService.createCourier(courierDto);
  }
}
