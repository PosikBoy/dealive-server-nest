import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ordersRepository } from './orders.providers';
import { OrdersController } from './orders.controller';
import { addressesRepository } from '@/addresses/addresses.providers';
import { TokensModule } from '@/tokens/tokens.module';
import { ClientsModule } from '@/clients/clients.module';
import { OrderActionsModule } from '@/order-actions/order-actions.module';
import { UserModule } from '@/users/user.module';
import { TelegramNotifyModule } from '@/telegram-notify/telegram-notify.module';
import { GeodataModule } from '@/geodata/geodata.module';
import { ThrottlerModule } from '@nestjs/throttler';

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
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
})
export class OrdersModule {}
