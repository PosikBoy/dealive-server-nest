import { addressesRepository } from "@/addresses/addresses.providers";
import { ClientsModule } from "@/clients/clients.module";
import { GeodataModule } from "@/geodata/geodata.module";
import { OrderActionsModule } from "@/order-actions/order-actions.module";
import { PriceModule } from "@/price/price.module";
import { TelegramNotifyModule } from "@/telegram-notify/telegram-notify.module";
import { TokensModule } from "@/tokens/tokens.module";
import { UserModule } from "@/users/user.module";
import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { OrdersController } from "./orders.controller";
import { ordersRepository } from "./orders.providers";
import { OrdersService } from "./orders.service";

@Module({
  providers: [OrdersService, ...ordersRepository, ...addressesRepository],
  controllers: [OrdersController],
  imports: [
    TokensModule,
    ClientsModule,
    OrderActionsModule,
    UserModule,
    TelegramNotifyModule,
    GeodataModule,
    PriceModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
})
export class OrdersModule {}
