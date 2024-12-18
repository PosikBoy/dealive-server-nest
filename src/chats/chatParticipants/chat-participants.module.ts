import { Module } from '@nestjs/common';
import { chatParticipantsProviders } from './chat-participants.providers';
import { ChatParticipantsService } from './chat-participants.service';

@Module({
  providers: [...chatParticipantsProviders, ChatParticipantsService],
  exports: [ChatParticipantsService],
})
export class ChatParticipantsModule {}
