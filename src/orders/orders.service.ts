import { Address } from "@/addresses/addresses.model";
import { ClientsService } from "@/clients/clients.service";
import { Messages } from "@/common/constants/error-messages";
import {
  ADDRESS_REPOSITORY,
  ORDERS_REPOSITORY,
} from "@/common/constants/sequelize";
import { JwtUser } from "@/common/types/jwt";
import { Courier } from "@/couriers/couriers.model";
import { GeodataService } from "@/geodata/geodata.service";
import { OrderAction } from "@/order-actions/order-actions.model";
import { OrderActionService } from "@/order-actions/order-actions.service";
import { TelegramNotifyService } from "@/telegram-notify/telegram-notify.service";
import { User, UserRolesEnum } from "@/users/user.model";
import { UserService } from "@/users/user.service";
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Op } from "sequelize";
import { CreateOrderDto } from "./dtos/create-order.dto";
import {
  AddressWithGeoData,
  OrderWithoutSensitiveInfoDto,
} from "./dtos/order.dto";
import { Order } from "./orders.model";
import { OrderStatusEnum } from "./ordersStatuses/order-statuses-enum";

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY) private ordersRepository: typeof Order,
    @Inject(ADDRESS_REPOSITORY) private addressRepository: typeof Address,
    private clientService: ClientsService,
    private orderActionsService: OrderActionService,
    private userService: UserService,
    private telegramNotifyService: TelegramNotifyService,
    private geodataService: GeodataService
  ) {}

  async getAllOrders(
    user: JwtUser
  ): Promise<Order[] | OrderWithoutSensitiveInfoDto[]> {
    const { id } = user;
    let orders: Order[];

    switch (user.role) {
      case "client":
        orders = await this.ordersRepository.findAll({
          where: { clientId: id },
          include: {
            model: Address,
          },
        });
        break;
      case "courier":
        orders = await this.ordersRepository.findAll({
          where: { courierId: id },
          attributes: {
            exclude: ["clientId", "phoneNumber", "phoneName", "updatedAt"],
          },
          include: {
            model: Address,
            attributes: {
              exclude: ["phoneNumber", "floor", "apartment", "updatedAt"],
            },
          },
        });
        const ordersWithGeo = await this.enrichOrdersWithGeodata(orders);
        const ordersWithoutSensitiveInfo = ordersWithGeo.map((order) => {
          return new OrderWithoutSensitiveInfoDto(order);
        });
        return ordersWithoutSensitiveInfo;
    }
    if (!orders) {
      throw new NotFoundException(Messages.ORDERS_NOT_FOUND);
    }
    return orders;
  }

  //Получение заказа по айди и роли
  async getOrderById(
    id: number,
    user: JwtUser
  ): Promise<Order | OrderWithoutSensitiveInfoDto> {
    //Получение заказа из БД
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
        ["actions", "sequence", "ASC"],
        ["addresses", "id", "ASC"],
      ],
    });

    //Нет заказа - ошибка
    if (!order) {
      throw new NotFoundException(Messages.ORDER_NOT_FOUND);
    }

    switch (user.role) {
      //Для клиента
      case "client": {
        if (order.clientId !== user.id) {
          throw new NotFoundException(Messages.ORDER_NOT_FOUND);
        }
        return order;
      }
      //Для курьера
      case "courier": {
        //Если заказ не принадлежит курьеру
        if (order.courierId !== user.id) {
          //Если статус заказа в поиске курьера - возвращаем заказ с геоданными
          if (order.statusId == OrderStatusEnum.SEARCH_COURIER) {
            const enrichedOrder = await this.enrichOrderWithGeodata(order);

            return new OrderWithoutSensitiveInfoDto(enrichedOrder);
          }

          throw new NotFoundException(Messages.ORDER_NOT_FOUND);
        }
        const enrichedOrder = await this.enrichOrderWithGeodata(order);

        if (order.statusId == OrderStatusEnum.COURIER_IN_TRANSIT) {
          return enrichedOrder;
        }

        return new OrderWithoutSensitiveInfoDto(enrichedOrder);
      }

      default:
        return order;
    }
  }

  //Курьер получает все доступные заказы без чувствительной информации
  async getAvailableOrders() {
    const orders = await this.ordersRepository.findAll({
      where: {
        statusId: OrderStatusEnum.SEARCH_COURIER,
      },
      attributes: {
        exclude: ["clientId", "phoneNumber", "phoneName", "updatedAt"],
      },
      include: [
        {
          model: Address,
          attributes: {
            exclude: ["phoneNumber", "floor", "apartment", "updatedAt"],
          },
        },
        {
          model: OrderAction,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    const enrichedOrders = await this.enrichOrdersWithGeodata(orders);

    const ordersWithoutSensitiveInfo = enrichedOrders.map((order) => {
      return new OrderWithoutSensitiveInfoDto(order);
    });

    return ordersWithoutSensitiveInfo;
  }

  async getActiveOrders(courier: JwtUser) {
    const courierId = courier.id;

    const orders = await this.ordersRepository.findAll({
      where: {
        [Op.and]: [
          { courierId },
          { statusId: OrderStatusEnum.COURIER_IN_TRANSIT },
        ],
      },
      include: [
        {
          model: Address,
        },
        {
          model: OrderAction,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    return await this.enrichOrdersWithGeodata(orders);
  }

  //Клиент создает заказ
  async createOrder(createOrderDto: CreateOrderDto, user: JwtUser) {
    const { parcelType, weight, price, addresses } = createOrderDto;
    let clientId = null;
    let phoneNumber = null;
    let phoneName = null;

    if (user) {
      const userDB = await this.userService.findUser(
        "id",
        user.id,
        UserRolesEnum.CLIENT
      );
      const client = await this.clientService.findClient(user.id);

      clientId = client.userId;
      if ("phoneNumber" in userDB) phoneNumber = userDB.phoneNumber || "";
      phoneName = client.name;
    }

    const trackNumber =
      "MSK" + Math.random().toString(36).substring(2, 13).toUpperCase();

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Создание заказа
    const order = await this.ordersRepository.create({
      parcelType,
      weight,
      price,
      clientId,
      phoneNumber,
      phoneName,
      trackNumber,
      code,
    });
    // Создание адресов, связанных с заказом

    const createdAddresses = [];
    for (const address of addresses) {
      const created = await this.addressRepository.create({
        ...address,
        orderId: order.id,
      });
      createdAddresses.push(created);
    }

    const orderFromDb = await this.ordersRepository.findByPk(order.id, {
      include: {
        model: Address,
      },
    });

    const actions = await this.orderActionsService.generate(orderFromDb);
    try {
      this.telegramNotifyService.newOrder(orderFromDb);
    } catch (e) {
      console.error("Ошибка уведомления Telegram:", e);
    }
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
    // Добавить проверку роли
    const order = await this.ordersRepository.findByPk(orderId);
    if (
      order.statusId == OrderStatusEnum.SEARCH_COURIER &&
      order.clientId == client.id
    ) {
      order.statusId = OrderStatusEnum.CANCELLED;
      order.save();
    } else {
      throw new BadRequestException(Messages.ORDER_CANCEL_NOT_AVAILABLE);
    }
    return order;
  }

  async trackOrder(trackNumber: string, code: string) {
    const order = await this.ordersRepository.findOne({
      where: {
        trackNumber,
      },
      include: [
        {
          model: Address,
        },
        {
          model: OrderAction,
        },
        {
          model: Courier,
          attributes: ["name", "secondName", "lastName", "userId"],
          include: [
            {
              model: User,
              attributes: ["phoneNumber"],
            },
          ],
        },
      ],
    });

    if (order?.code != code || !order) {
      throw new NotFoundException(Messages.ORDER_TRACK_ERROR);
    }

    const orderData = {
      ...order.dataValues,
      courier: {
        ...order.courier?.dataValues,
        phoneNumber: order.courier?.user.phoneNumber,
      },
    };

    return orderData;
  }

  async enrichOrderWithGeodata(order: Order) {
    const addressesGeodata = await this.geodataService.getAddresses(
      order.addresses
    );

    const addressesWithGeodata = order.addresses.map((address, index) => {
      return new AddressWithGeoData(address, addressesGeodata[index]);
    });

    const orderWithGeo = {
      ...order.dataValues,
      addresses: addressesWithGeodata,
    };

    return orderWithGeo;
  }

  async enrichOrdersWithGeodata(orders: Order[]) {
    const ordersWithGeo = orders.map(async (order) => {
      return this.enrichOrderWithGeodata(order);
    });
    return Promise.all(ordersWithGeo);
  }
}
