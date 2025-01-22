import { ORDER_ACTION_REPOSITORY } from '@/constants/sequelize';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrderAction, OrderActionType } from './order-actions.model';
import { Messages } from '@/constants/messages';
import { Order } from '@/orders/orders.model';
import { JwtUser } from '@/types/jwt';
import { OrderStatusEnum } from '@/orders/ordersStatuses/orders.statuses';

@Injectable()
export class OrderActionService {
  constructor(
    @Inject(ORDER_ACTION_REPOSITORY)
    private orderActionsRepository: typeof OrderAction,
  ) {}
  async complete(statusId: number, user: JwtUser): Promise<void> {
    const currentStatus = await this.orderActionsRepository.findByPk(statusId);

    if (!currentStatus) {
      throw new BadRequestException(Messages.ORDER_ACTION_NOT_FOUND);
    }
    const order = await currentStatus.$get('order');

    if (user.id !== order.courierId) {
      throw new BadRequestException(Messages.ORDER_ACTION_NOT_FOUND);
    }

    if (currentStatus.actionType === OrderActionType.PAY_COMMISION) {
      throw new BadRequestException(
        'Это действие нельзя выполнить самостоятельно',
      );
    }
    // Если это первое действие, пропустить проверку
    if (currentStatus.sequence === 1) {
      currentStatus.isCompleted = true;
      currentStatus.completedAt = new Date();
      await currentStatus.save();
      return;
    }

    // Найти предыдущее действие
    const previousAction = await this.orderActionsRepository.findOne({
      where: { id: currentStatus.id - 1 },
    });

    if (!previousAction?.isCompleted) {
      throw new BadRequestException(Messages.PREVIOUS_ACTION_MUST_BE_COMPLETED);
    }

    currentStatus.isCompleted = true;
    currentStatus.completedAt = new Date();

    if (currentStatus.actionType === OrderActionType.COMPLETE_ORDER) {
      order.statusId = OrderStatusEnum.DELIVERED;
      await order.save();
    }

    await currentStatus.save();
  }

  async generate(order: Order) {
    let sequence: number = 1;

    // Используем for...of для последовательного выполнения
    for (const [index, address] of order.addresses.entries()) {
      await this.orderActionsRepository.create({
        actionType: OrderActionType.GO_TO,
        description: `Выезжаю на адрес ${address.address}`,
        orderId: order.id,
        addressId: address.id,
        sequence,
      });
      sequence += 1;

      await this.orderActionsRepository.create({
        actionType: OrderActionType.ARRIVED_AT,
        description: `Прибыл на адрес ${address.address}`,
        orderId: order.id,
        addressId: address.id,

        sequence,
      });
      sequence += 1;

      if (index === 0) {
        await this.orderActionsRepository.create({
          actionType: OrderActionType.PICKUP,
          description: `Получил ${order.parcelType}`,
          orderId: order.id,
          addressId: address.id,

          sequence,
        });
        sequence += 1;

        await this.orderActionsRepository.create({
          actionType: OrderActionType.COLLECT_PAYMENT,
          description: `Получил оплату в размере ${order.price} ₽  `,
          orderId: order.id,
          addressId: address.id,

          sequence,
        });
        sequence += 1;
      } else {
        await this.orderActionsRepository.create({
          actionType: OrderActionType.DELIVER,
          description: `Отдал ${order.parcelType}`,
          orderId: order.id,
          addressId: address.id,
          sequence,
        });
        sequence += 1;
      }
    }

    await this.orderActionsRepository.create({
      actionType: OrderActionType.PAY_COMMISION,
      description: `Оплатил комиссию ${order.price * 0.15}`,
      orderId: order.id,
      sequence,
    });
    sequence += 1;

    await this.orderActionsRepository.create({
      actionType: OrderActionType.COMPLETE_ORDER,
      description: `Заказ выполнен`,
      orderId: order.id,
      sequence,
    });

    // Вернём все действия для проверки
    return await this.orderActionsRepository.findAll({
      where: {
        orderId: order.id,
      },
      order: [['sequence', 'ASC']], // Гарантируем, что результат отсортирован
    });
  }
}
