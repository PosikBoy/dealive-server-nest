import { ADDRESS_REPOSITORY } from '@/common/constants/sequelize';
import { Address } from './addresses.model';

export const addressesRepository = [
  {
    provide: ADDRESS_REPOSITORY,
    useValue: Address,
  },
];
