import { CHATS_PARTICIPANTS_REPOSITORY } from '@/common/constants/sequelize';
import { ChatParticipants } from './chat-participants.model';

export const chatParticipantsProviders = [
  {
    provide: CHATS_PARTICIPANTS_REPOSITORY,
    useValue: ChatParticipants,
  },
];
