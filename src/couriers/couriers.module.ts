import { Module } from '@nestjs/common';
import { CouriersController } from './couriers.controller';
import { CouriersService } from './couriers.service';
import { couriersProviders } from './couriers.providers';

@Module({
  imports: [],
  controllers: [CouriersController],
  providers: [CouriersService, ...couriersProviders],
})
export class CouriersModule {}
