import { CouriersModule } from '@/couriers/couriers.module';
import { FilesModule } from '@/files/files.module';
import { TokensModule } from '@/tokens/tokens.module';
import { ClientsModule } from '@/clients/clients.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CourierAuthController, ClientAuthController } from './auth.controller';
import { UserModule } from '@/users/user.module';
import { TelegramNotifyModule } from '@/telegram-notify/telegram-notify.module';

@Module({
  providers: [AuthService],
  controllers: [ClientAuthController, CourierAuthController],
  imports: [
    ClientsModule,
    TokensModule,
    CouriersModule,
    FilesModule,
    UserModule,
    TelegramNotifyModule,
  ],
})
export class AuthModule {}
