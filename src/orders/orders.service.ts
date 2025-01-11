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
import {
  AddressWithGeoData,
  OrderWithoutSensitiveInfoDto,
} from './dtos/courier-order.dto';
import { ClientsService } from '@/clients/clients.service';
import { OrderStatusEnum } from './ordersStatuses/orders.statuses';
import { OrderAction } from '@/order-actions/order-actions.model';
import { OrderActionService } from '@/order-actions/order-actions.service';
import { Courier } from '@/couriers/couriers.model';
import { UserService } from '@/users/user.service';
import { UserRolesEnum } from '@/users/user.model';
import { TelegramNotifyService } from '@/telegram-notify/telegram-notify.service';
import { GeodataService } from '@/geodata/geodata.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY) private ordersRepository: typeof Order,
    @Inject(ADDRESS_REPOSITORY) private addressRepository: typeof Address,
    private clientService: ClientsService,
    private orderActionsService: OrderActionService,
    private userService: UserService,
    private telegramNotifyService: TelegramNotifyService,
    private geodataService: GeodataService,
  ) {}

  async getAllOrders(
    user: JwtUser,
  ): Promise<Order[] | OrderWithoutSensitiveInfoDto[]> {
    const { id } = user;
    let orders: Order[];

    if (user.role === 'client') {
      orders = await this.ordersRepository.findAll({
        where: { clientId: id },
        include: {
          model: Address,
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

    if (user.role == 'courier') {
      const ordersWithGeo = orders.map(async (order) => {
        const addressesGeodata = await this.geodataService.getAddresses(
          order.addresses,
        );

        const addressesWithGeodata = order.addresses.map((address, index) => {
          return new AddressWithGeoData(address, addressesGeodata[index]);
        });

        const orderWithGeo = {
          ...order.dataValues,
          addresses: addressesWithGeodata,
        };
        return new OrderWithoutSensitiveInfoDto(orderWithGeo);
      });
      return Promise.all(ordersWithGeo);
    }
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
      include: [
        {
          model: Address,
        },
        {
          model: OrderAction,
        },
      ],
      order: [
        ['actions', 'sequence', 'ASC'],
        ['addresses', 'id', 'ASC'],
      ],
    });

    if (!order) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }

    const addressesGeodata = await this.geodataService.getAddresses(
      order.addresses,
    );

    const addressesWithGeodata = order.addresses.map((address, index) => {
      return new AddressWithGeoData(address, addressesGeodata[index]);
    });

    const orderWithGeo = {
      ...order.dataValues,
      addresses: addressesWithGeodata,
    };

    if (user.role === 'client' && order.clientId !== user.id) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }

    if (user.role === 'courier' && order.courierId !== user.id) {
      if (order.statusId != OrderStatusEnum.SEARCH_COURIER) {
        throw new NotFoundException(Messages.ORDER_NOT_FOUND);
      }

      return new OrderWithoutSensitiveInfoDto(orderWithGeo);
    }

    if (
      user.role === 'courier' &&
      order.courierId === user.id &&
      order.statusId != OrderStatusEnum.COURIER_IN_TRANSIT
    ) {
      return new OrderWithoutSensitiveInfoDto(orderWithGeo);
    }

    return orderWithGeo;
  }

  //Курьер получает все доступные заказы без чувствительной информации
  async getAvailableOrders() {
    const orders = await this.ordersRepository.findAll({
      where: {
        statusId: OrderStatusEnum.SEARCH_COURIER,
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
    const ordersWithGeo = orders.map(async (order) => {
      const addressesGeodata = await this.geodataService.getAddresses(
        order.addresses,
      );

      const addressesWithGeodata = order.addresses.map((address, index) => {
        return new AddressWithGeoData(address, addressesGeodata[index]);
      });

      const orderWithGeo = {
        ...order.dataValues,
        addresses: addressesWithGeodata,
      };
      return new OrderWithoutSensitiveInfoDto(orderWithGeo);
    });
    return Promise.all(ordersWithGeo);
  }

  //Курьер получает все активные заказы
  async getActiveOrders(courier: JwtUser) {
    const courierId = courier.id;

    const orders = await this.ordersRepository.findAll({
      where: {
        [Op.and]: [
          { courierId },
          { statusId: OrderStatusEnum.COURIER_IN_TRANSIT },
        ],
      },
      include: {
        model: Address,
      },
    });

    const ordersWithGeo = orders.map(async (order) => {
      const addressesGeodata = await this.geodataService.getAddresses(
        order.addresses,
      );

      const addressesWithGeodata = order.addresses.map((address, index) => {
        return new AddressWithGeoData(address, addressesGeodata[index]);
      });

      const orderWithGeo = {
        ...order.dataValues,
        addresses: addressesWithGeodata,
      };
      return new OrderWithoutSensitiveInfoDto(orderWithGeo);
    });
    return Promise.all(ordersWithGeo);
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
      const userDB = await this.userService.findUser(
        'id',
        user.id,
        UserRolesEnum.CLIENT,
      );
      const client = await this.clientService.findClient(user.id);

      clientId = client.userId;
      if ('phoneNumber' in userDB) phoneNumber = userDB.phoneNumber || '';
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

    const orderFromDb = await this.ordersRepository.findByPk(order.id, {
      include: {
        model: Address,
      },
    });
    const actions = await this.orderActionsService.generate(orderFromDb);
    this.telegramNotifyService.newOrder(orderFromDb);
    // Возвращаем созданный заказ с адресами
    return { ...order.dataValues, addresses: createdAddresses, actions };
  }

  async takeOrder(orderId: number, courier: JwtUser) {
    const courierId = courier.id;

    const order = await this.ordersRepository.findByPk(orderId);
    if (order.statusId != OrderStatusEnum.SEARCH_COURIER) {
      throw new BadRequestException(Messages.ORDER_TAKE_ERROR);
    }
    order.courierId = courierId;
    order.statusId = OrderStatusEnum.COURIER_IN_TRANSIT;

    await order.save();

    return order;
  }

  async cancelClientOrder(orderId: number, client: JwtUser) {
    const order = await this.ordersRepository.findByPk(orderId);
    if (order.statusId == OrderStatusEnum.SEARCH_COURIER) {
      order.statusId = OrderStatusEnum.CANCELLED;
      order.save();
    } else {
      throw new BadRequestException(Messages.ORDER_CANCEL_NOT_AVAILABLE);
    }
    return order;
  }
}
