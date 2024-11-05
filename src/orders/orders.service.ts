import { ORDERS_REPOSITORY } from '@/constants/constants';
import { Inject, Injectable } from '@nestjs/common';
import { Order } from './orders.model';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY) private ordersRepository: typeof Order,
  ) {}

  async getOrderById(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      include: { all: true },
    });
    return order;
  }
}
