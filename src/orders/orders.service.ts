import { ADDRESS_REPOSITORY, ORDERS_REPOSITORY } from '@/constants/constants';
import { Inject, Injectable } from '@nestjs/common';
import { Order, OrderCreationAttrs } from './orders.model';
import { Address } from '@/addresses/addresses.model';
import { CreateOrderDto } from './dtos/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY) private ordersRepository: typeof Order,
    @Inject(ADDRESS_REPOSITORY) private addressRepository: typeof Address,
  ) {}

  async getOrderById(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      include: { all: true },
    });
    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { info, addresses } = createOrderDto;
    const order = await this.ordersRepository.create(info);
    console.log(order.id);
    if (addresses && addresses.length > 0) {
      let addressPromises = addresses.map((address) => {
        return this.addressRepository.create({
          ...address,
          orderId: order.id,
        });
      });
      await Promise.all(addressPromises);
    }
    return { order, addresses };
  }
}
