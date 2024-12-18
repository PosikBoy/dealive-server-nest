import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { messagesProviders } from './messages.providers';
import { TokensModule } from '@/tokens/tokens.module';
import { ChatModule } from '../chat/chat.module';
import { ChatParticipantsModule } from '../chatParticipants/chat-participants.module';
import { MessagesController } from './messages.controller';

@Module({
  controllers: [MessagesController],
  imports: [TokensModule, forwardRef(() => ChatModule), ChatParticipantsModule],
  providers: [MessagesService, ...messagesProviders],
})
export class MessageModule {}
