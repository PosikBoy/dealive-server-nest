import { USERS_REPOSITORY } from '@/constants/constants';
import { User } from './users.model';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
];
