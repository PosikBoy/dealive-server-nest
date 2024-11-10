import { Module } from '@nestjs/common';
import { CouriersController } from './couriers.controller';
import { CouriersService } from './couriers.service';
import { couriersProviders } from './couriers.providers';

@Module({
  controllers: [CouriersController],
  providers: [CouriersService, ...couriersProviders],
  exports: [CouriersService],
})
export class CouriersModule {}
