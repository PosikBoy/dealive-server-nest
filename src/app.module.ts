import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AddressesModule } from "./addresses/addresses.module";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chats/chat/chat.module";
import { MessageModule } from "./chats/messages/messages.module";
import { ClientsModule } from "./clients/clients.module";
import { CouriersModule } from "./couriers/couriers.module";
import { databaseProviders } from "./database.providers";
import { FilesModule } from "./files/files.module";
import { GeodataModule } from "./geodata/geodata.module";
import { OrderActionsModule } from "./order-actions/order-actions.module";
import { OrdersModule } from "./orders/orders.module";
import { PriceModule } from "./price/price.module";
import { RedisModule } from "./redis/redis.module";
import { SuggestionModule } from "./suggestions/suggestions.module";
import { TelegramNotifyModule } from "./telegram-notify/telegram-notify.module";
import { TokensModule } from "./tokens/tokens.module";

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    CouriersModule,
    OrdersModule,
    AddressesModule,
    ClientsModule,
    AuthModule,
    FilesModule,
    TokensModule,
    SuggestionModule,
    OrderActionsModule,
    MessageModule,
    ChatModule,
    TelegramNotifyModule,
    GeodataModule,
    PriceModule,
    RedisModule,
  ],
})
export class AppModule {}
