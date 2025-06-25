import { CLIENTS_REPOSITORY } from '@/common/constants/sequelize';
import { Client } from './clients.model';

export const clientsProvider = [
  {
    provide: CLIENTS_REPOSITORY,
    useValue: Client,
  },
];
