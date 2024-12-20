import { Module } from '@nestjs/common';
import { TelegramNotifyService } from './telegram-notify.service';

@Module({
  providers: [TelegramNotifyService],
  exports: [TelegramNotifyService],
})
export class TelegramNotifyModule {}
