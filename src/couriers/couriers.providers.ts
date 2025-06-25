import { COURIERS_REPOSITORY } from '@/common/constants/sequelize';
import { Courier } from './couriers.model';

export const couriersProviders = [
  {
    provide: COURIERS_REPOSITORY,
    useValue: Courier,
  },
];
