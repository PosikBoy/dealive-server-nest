import { forwardRef, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { chatProviders } from './chat.providers';
import { ChatService } from './chat.service';
import { TokensModule } from '@/tokens/tokens.module';
import { MessageModule } from '../messages/messages.module';
import { ChatParticipantsModule } from '../chatParticipants/chat-participants.module';

@Module({
  controllers: [ChatController],
  providers: [...chatProviders, ChatService],
  imports: [
    TokensModule,
    forwardRef(() => MessageModule),
    ChatParticipantsModule,
  ],
})
export class ChatModule {}
