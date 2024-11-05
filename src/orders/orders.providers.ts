import { ORDERS_REPOSITORY } from '@/constants/constants';
import { Order } from './orders.model';

export const ordersRepository = [
  {
    provide: ORDERS_REPOSITORY,
    useValue: Order,
  },
];
