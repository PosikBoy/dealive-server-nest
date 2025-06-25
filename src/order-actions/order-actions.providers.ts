import { ORDER_ACTION_REPOSITORY } from '@/common/constants/sequelize';
import { OrderAction } from './order-actions.model';

export const orderActionsProviders = [
  {
    provide: ORDER_ACTION_REPOSITORY,
    useValue: OrderAction,
  },
];
