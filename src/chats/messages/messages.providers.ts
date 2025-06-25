import { MESSAGES_REPOSITORY } from '@/common/constants/sequelize';
import { Messages } from './messages.model';

export const messagesProviders = [
  {
    provide: MESSAGES_REPOSITORY,
    useValue: Messages,
  },
];
