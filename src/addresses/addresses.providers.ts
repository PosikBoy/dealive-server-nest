import { ADDRESS_REPOSITORY } from '@/constants/sequelize';
import { Address } from './addresses.model';

export const addressesRepository = [
  {
    provide: ADDRESS_REPOSITORY,
    useValue: Address,
  },
];
