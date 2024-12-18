import { Module } from '@nestjs/common';
import { CouriersController } from './couriers.controller';
import { CouriersService } from './couriers.service';
import { couriersProviders } from './couriers.providers';
import { TokensModule } from '@/tokens/tokens.module';
import { UserModule } from '@/users/user.module';

@Module({
  imports: [TokensModule, UserModule],
  controllers: [CouriersController],
  providers: [CouriersService, ...couriersProviders],
  exports: [CouriersService],
})
export class CouriersModule {}
