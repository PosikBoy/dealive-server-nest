import { TokensModule } from "@/tokens/tokens.module";
import { UserModule } from "@/users/user.module";
import { Module } from "@nestjs/common";
import { CouriersController } from "./couriers.controller";
import { couriersProviders } from "./couriers.providers";
import { CouriersService } from "./couriers.service";

@Module({
  imports: [TokensModule, UserModule],
  controllers: [CouriersController],
  providers: [CouriersService, ...couriersProviders],
  exports: [CouriersService],
})
export class CouriersModule {}
