import { CHATS_REPOSITORY } from '@/common/constants/sequelize';
import { JwtUser } from '@/common/types/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { ChatParticipantsService } from '../chatParticipants/chat-participants.service';
import { Chats } from './chat.model';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHATS_REPOSITORY) private chatRepository: typeof Chats,
    private chatParticipantsService: ChatParticipantsService,
  ) {}
  async createChat(user: JwtUser) {
    const chat = await this.chatRepository.create({ creatorId: user.id });
    await this.chatParticipantsService.addUserToChat(user.id, chat.id);
    return chat;
  }
}
