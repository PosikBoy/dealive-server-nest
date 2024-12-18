import { CHATS_REPOSITORY } from '@/constants/sequelize';
import { Inject, Injectable } from '@nestjs/common';
import { Chats } from './chat.model';
import { JwtUser } from '@/types/jwt';
import { ChatParticipantsService } from '../chatParticipants/chat-participants.service';

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
