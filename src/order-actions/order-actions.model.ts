import { Order } from '@/orders/orders.model';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';

export enum OrderActionType {
  GO_TO = 'GO_TO',
  ARRIVED_AT = 'ARRIVED_AT',
  PICKUP = 'PICKUP',
  DELIVER = 'DELIVER',
  COLLECT_PAYMENT = 'COLLECT_PAYMENT',
  PAY_COMMISION = 'PAY_COMMISION',
  COMPLETE_ORDER = 'COMPLETE_ORDER',
}

interface OrderActionCreationAttrs {
  orderId: number;
  actionType: OrderActionType;
  description: string;
  sequence: number;
}

@Table({
  tableName: 'order_actions',
  timestamps: true, // Автоматические createdAt и updatedAt
  indexes: [
    { fields: ['order_id'] }, // Индекс для быстрого поиска по orderId
    // { fields: ['orderId', 'scheduledAt'] }, // Составной индекс для поиска и сортировки
  ],
})
export class OrderAction extends Model<OrderAction, OrderActionCreationAttrs> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'order_id' })
  orderId: number; // Внешний ключ на таблицу заказов

  //Порядковый номер статуса
  @Column({ type: DataType.INTEGER, allowNull: false })
  sequence: number;
  @Column({
    type: DataType.ENUM(...Object.values(OrderActionType)),
    field: 'action_type',
  })
  actionType: OrderActionType; // Тип действия

  @Column({ type: DataType.STRING, allowNull: true })
  description: string; // Описание действия

  // @Column({ type: DataType.DATE, allowNull: true })
  // scheduledAt: Date; // Запланированное время выполнения

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_completed',
  })
  isCompleted: boolean; // Статус выполнения действия

  @Column({ type: DataType.DATE, allowNull: true, field: 'completed_at' })
  completedAt: Date; // Время завершения

  @BelongsTo(() => Order)
  order: Order; // Связь с заказом
}
