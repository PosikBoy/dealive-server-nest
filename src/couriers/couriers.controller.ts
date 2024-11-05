import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CouriersService } from './couriers.service';
import { CreateCourierDto } from './dtos/create-courier.dto';

@Controller('courier')
export class CouriersController {
  constructor(private couriersService: CouriersService) {}

  @Get('/:id')
  getCourierById(@Param('id') id: number) {
    return this.couriersService.getCourierById(id);
  }

  @Post()
  create(@Body() courierDto: CreateCourierDto) {
    return this.couriersService.createCourier(courierDto);
  }
}
