import { ADDRESS_REPOSITORY, ORDERS_REPOSITORY } from '@/constants/sequelize';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './orders.model';
import { Address } from '@/addresses/addresses.model';
import { CreateOrderDto } from './dtos/create-order.dto';
import { JwtUser } from '@/types/jwt';
import { Messages } from '@/constants/messages';
import { Op } from 'sequelize';
import { OrderWithoutSensitiveInfoDto } from './dtos/courier-order.dto';
import { orderStatuses } from './ordersStatuses/orders.statuses';
import { ClientsService } from '@/clients/clients.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY) private ordersRepository: typeof Order,
    @Inject(ADDRESS_REPOSITORY) private addressRepository: typeof Address,
    private clientService: ClientsService,
  ) {}

  async getAllOrders(user: JwtUser): Promise<Order[]> {
    const { id } = user;
    let orders: Order[];
    if (user.role === 'client') {
      orders = await this.ordersRepository.findAll({
        where: { clientId: id },
        include: {
          all: true,
        },
      });
    } else if (user.role === 'courier') {
      orders = await this.ordersRepository.findAll({
        where: { courierId: id },
        attributes: {
          exclude: ['clientId', 'phoneNumber', 'phoneName', 'updatedAt'],
        },
        include: {
          model: Address,
          attributes: {
            exclude: ['phoneNumber', 'floor', 'apartment', 'updatedAt'],
          },
        },
      });
    }
    console.log(orders);
    if (!orders) {
      throw new NotFoundException(Messages.ORDERS_NOT_FOUND);
    }
    return orders;
  }

  //Получение заказа по айди и роли
  async getOrderById(
    id: number,
    user: JwtUser,
  ): Promise<Order | OrderWithoutSensitiveInfoDto> {
    const order = await this.ordersRepository.findByPk(id, {
      include: { all: true },
    });
    if (!order) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }
    if (user.role === 'client' && order.clientId !== user.id) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }

    if (user.role === 'courier' && order.courierId !== user.id) {
      if (order.statusId != orderStatuses.searchCourier) {
        throw new NotFoundException(Messages.ORDER_NOT_FOUND);
      }

      return new OrderWithoutSensitiveInfoDto(order);
    }

    if (
      user.role === 'courier' &&
      order.courierId === user.id &&
      order.statusId != orderStatuses.courierInTransit
    ) {
      console.log(
        user.role === 'courier' &&
          order.courierId === user.id &&
          order.statusId != orderStatuses.courierInTransit,
      );

      return new OrderWithoutSensitiveInfoDto(order);
    }
    return order;
  }

  //Курьер получает все доступные заказы без чувствительной информации
  async getAvailableOrders() {
    const orders = await this.ordersRepository.findAll({
      where: {
        statusId: orderStatuses.searchCourier,
      },
      attributes: {
        exclude: ['clientId', 'phoneNumber', 'phoneName', 'updatedAt'],
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

  //Курьер получает все активные заказы
  async getActiveOrders(courier: JwtUser) {
    const courierId = courier.id;

    const order = this.ordersRepository.findAll({
      where: {
        [Op.and]: [{ courierId }, { statusId: orderStatuses.courierInTransit }],
      },
      include: {
        model: Address,
      },
    });
    return order;
  }
  //Клиент создает заказ
  async createOrder(createOrderDto: CreateOrderDto, user: JwtUser) {
    const { parcelType, weight, price, addresses } = createOrderDto;

    // Проверка входных данных
    if (
      !parcelType ||
      !weight ||
      !price ||
      !addresses ||
      addresses.length < 2
    ) {
      throw new BadRequestException(Messages.ORDER_CREATE_ERROR);
    }

    // Проверка адресов на наличие обязательных данных
    const invalidAddress = addresses.some((address) => {
      return !address.address || !address.phoneNumber;
    });
    if (invalidAddress) {
      throw new BadRequestException(Messages.ORDER_CREATE_ERROR);
    }

    // Инициализация данных для заказа
    let clientId = null;
    let phoneNumber = null;
    let phoneName = null;

    // Если пользователь авторизован, получаем данные клиента
    if (user) {
      const client = await this.clientService.findClient('id', user.id);
      clientId = client.id;
      phoneNumber = client.phoneNumber;
      phoneName = client.name;
    }

    // Создание заказа
    const order = await this.ordersRepository.create({
      parcelType,
      weight,
      price,
      clientId,
      phoneNumber,
      phoneName,
    });

    // Создание адресов, связанных с заказом
    const addressPromises = addresses.map((address) =>
      this.addressRepository.create({
        ...address,
        orderId: order.id,
      }),
    );
    const createdAddresses = await Promise.all(addressPromises);

    // Возвращаем созданный заказ с адресами
    return { ...order.dataValues, addresses: createdAddresses };
  }

  async takeOrder(orderId: number, courier: JwtUser) {
    const courierId = courier.id;

    const order = await this.ordersRepository.findByPk(orderId);
    if (order.statusId != orderStatuses.searchCourier) {
      throw new BadRequestException(Messages.ORDER_TAKE_ERROR);
    }
    order.courierId = courierId;
    order.statusId = orderStatuses.courierInTransit;

    await order.save();

    return order;
  }

  async cancelClientOrder(orderId: number, client: JwtUser) {
    const order = await this.ordersRepository.findByPk(orderId);
    if (order.statusId == orderStatuses.searchCourier) {
      order.statusId = orderStatuses.cancelled;
      order.save();
    } else {
      throw new BadRequestException(Messages.ORDER_CANCEL_NOT_AVAILABLE);
    }
    return order;
  }
}
