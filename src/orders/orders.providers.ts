import { ORDERS_REPOSITORY } from '@/common/constants/sequelize';
import { Order } from './orders.model';

export const ordersRepository = [
  {
    provide: ORDERS_REPOSITORY,
    useValue: Order,
  },
];
