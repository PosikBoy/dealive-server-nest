import { ADDRESS_REPOSITORY, ORDERS_REPOSITORY } from '@/constants/sequelize';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Order } from './orders.model';
import { Address } from '@/addresses/addresses.model';
import { CreateOrderDto } from './dtos/create-order.dto';
import { JwtUser } from '@/types/jwt';
import { Messages } from '@/constants/messages';
import { Op } from 'sequelize';
import { OrderWithoutSensitiveInfoDto } from './dtos/courier-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY) private ordersRepository: typeof Order,
    @Inject(ADDRESS_REPOSITORY) private addressRepository: typeof Address,
  ) {}

  //Клиент получает свой заказ по id
  async getClientOrderById(id: number, client: JwtUser) {
    this.checkClientRole(client);
    const clientId = client.id;
    const order = await this.ordersRepository.findOne({
      where: { [Op.and]: [{ id }, { clientId }] },
      include: { all: true },
    });
    if (!order) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }
    return order;
  }

  //Клиент получает все сделанные заказы
  async getClientAllOrders(client: JwtUser) {
    this.checkClientRole(client);
    const clientId = client.id;
    const orders = await this.ordersRepository.findAll({
      where: {
        clientId,
      },
      include: {
        all: true,
      },
    });
    return orders;
  }

  //Курьер получает все доступные заказы без чувствительной информации
  async getCourierAvailableOrders() {
    const orders = await this.ordersRepository.findAll({
      where: {
        statusId: 1,
      },
      include: {
        model: Address,
        attributes: {
          exclude: ['phoneNumber', 'floor', 'apartment', 'updatedAt'],
        },
      },
    });
    return orders;
  }

  async getCourierOrderById(orderId: number, courier: JwtUser) {
    this.checkCourierRole(courier);

    const courierId = courier.id;
    const order = await this.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }

    if (order.courierId === courierId) {
      return order;
    }

    if (order.statusId !== 1) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }

    return new OrderWithoutSensitiveInfoDto(order);
  }

  async getActiveOrders(courier: JwtUser) {
    this.checkCourierRole(courier);

    const courierId = courier.id;

    const order = this.ordersRepository.findAll({
      where: {
        courierId,
        [Op.or]: [{ statusId: 2 }, { statusId: 3 }],
      },
      include: {
        model: Address,
      },
    });
    return order;
  }
  //Клиент создает заказ
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

  async takeOrder(orderId: number, courier: JwtUser) {
    this.checkCourierRole(courier);
    const courierId = courier.id;
    const order = await this.ordersRepository.findByPk(orderId);
    order.courierId = courierId;
    order.statusId = 2;

    await order.save();

    return order;
  }

  async cancelClientOrder(orderId: number, client: JwtUser) {
    this.checkClientRole(client);
    const order = await this.ordersRepository.findByPk(orderId);
    if (order.statusId == 1) {
      order.statusId = 5;
      order.save();
    } else {
      throw new BadRequestException(Messages.ORDER_CANCEL_NOT_AVAILABLE);
    }
    return order;
  }

  private checkCourierRole(courier: JwtUser) {
    if (courier.role !== 'courier') {
      throw new UnauthorizedException(Messages.AUTH_REQUIRED);
    }
  }

  private checkClientRole(courier: JwtUser) {
    if (courier.role !== 'courier') {
      throw new UnauthorizedException(Messages.AUTH_REQUIRED);
    }
  }

  private async getOrderById(orderId: number) {
    return await this.ordersRepository.findOne({
      where: {
        id: orderId,
      },
      include: [Address],
    });
  }
}
