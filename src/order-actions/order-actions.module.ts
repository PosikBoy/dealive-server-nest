import { Module } from '@nestjs/common';
import { OrderActionService } from './order-actions.service';
import { OrderActionController } from './order-actions.controller';
import { orderActionsProviders } from './order-actions.providers';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [TokensModule],
  providers: [OrderActionService, ...orderActionsProviders],
  controllers: [OrderActionController],
  exports: [OrderActionService],
})
export class OrderActionsModule {}
