import { CHATS_REPOSITORY } from '@/common/constants/sequelize';
import { Chats } from './chat.model';

export const chatProviders = [
  {
    provide: CHATS_REPOSITORY,
    useValue: Chats,
  },
];
