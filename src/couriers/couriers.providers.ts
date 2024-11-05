import { COURIERS_REPOSITORY } from '@/constants/constants';
import { Courier } from './couriers.model';

export const couriersProviders = [
  {
    provide: COURIERS_REPOSITORY,
    useValue: Courier,
  },
];
