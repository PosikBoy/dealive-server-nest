import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigModule } from '@nestjs/config';
import { CouriersModule } from './couriers/couriers.module';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { TokensModule } from './tokens/tokens.module';
import { SuggestionModule } from './suggestions/suggestions.module';
import { OrderActionsModule } from './order-actions/order-actions.module';
import { MessageModule } from './chats/messages/messages.module';
import { ChatModule } from './chats/chat/chat.module';
import { TelegramNotifyModule } from './telegram-notify/telegram-notify.module';
import { GeodataModule } from './geodata/geodata.module';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
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
  ],
})
export class AppModule {}
