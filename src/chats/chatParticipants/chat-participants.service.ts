import { CHATS_PARTICIPANTS_REPOSITORY } from '@/common/constants/sequelize';
import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ChatParticipants } from './chat-participants.model';

@Injectable()
export class ChatParticipantsService {
  constructor(
    @Inject(CHATS_PARTICIPANTS_REPOSITORY)
    private chatParticipantsRepository: typeof ChatParticipants,
  ) {}

  async addUserToChat(userId: number, chatId: number) {
    const chatParticipants = await this.chatParticipantsRepository.create({
      userId,
      chatId,
    });
    return chatParticipants;
  }

  async isUserInThisChat(userId: number, chatId: number) {
    const participations = await this.chatParticipantsRepository.findOne({
      where: {
        [Op.and]: {
          userId,
          chatId,
        },
      },
    });
    if (participations) return true;
    return false;
  }
}
