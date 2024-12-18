import { CHATS_REPOSITORY } from '@/constants/sequelize';
import { Chats } from './chat.model';

export const chatProviders = [
  {
    provide: CHATS_REPOSITORY,
    useValue: Chats,
  },
];
