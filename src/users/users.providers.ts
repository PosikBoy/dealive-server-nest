import { USERS_REPOSITORY } from '@/constants/constants';
import { User } from './users.model';

export const usersRepository = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
];
