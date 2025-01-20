import { Address } from '@/addresses/addresses.model';
import { Courier } from '@/couriers/couriers.model';
import { Client } from '@/clients/clients.model';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { OrderStatus } from './order-statuses.model';
import { OrderAction } from '@/order-actions/order-actions.model';
import { OrderStatusEnum } from './ordersStatuses/orders.statuses';

export interface OrderCreationAttrs {
  clientId?: number;
  phoneNumber?: string;
  phoneName?: string;
  parcelType: string;
  weight: string;
  price: number;
  trackNumber: string;
  code: string;
}
@Table({
  tableName: 'orders',
  indexes: [
    {
      fields: ['client_id'],
    },
    {
      fields: ['courier_id'],
    },
    { fields: ['track_number'] },

    { fields: ['status_id'] },
    { fields: ['status_id', 'date'] },
  ],
})
export class Order extends Model<Order, OrderCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: false,
    field: 'client_id',
  })
  clientId?: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    unique: false,
    defaultValue: DataType.NOW,
  })
  date: Date;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    unique: false,
    field: 'phone_number',
  })
  phoneNumber?: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: true,
    unique: false,
    field: 'phone_name',
  })
  phoneName?: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
    unique: false,
    field: 'parcel_type',
  })
  parcelType: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    unique: false,
    defaultValue: 'До 5 кг',
  })
  weight: string;

  @ForeignKey(() => OrderStatus)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: false,
    defaultValue: OrderStatusEnum.SEARCH_COURIER,
    field: 'status_id',
  })
  statusId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: false,
  })
  price: number;

  @ForeignKey(() => Courier)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: false,
    field: 'courier_id',
  })
  courierId?: number;

  @Column({
    type: DataType.STRING(128),
    allowNull: true,
    field: 'track_number',
  })
  trackNumber?: string;

  @Column({
    type: DataType.STRING(6),
    allowNull: true,
  })
  code?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt?: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt?: Date;

  @HasMany(() => Address)
  addresses: Address[];

  @HasMany(() => OrderAction, 'order_id')
  actions: OrderAction[];

  @BelongsTo(() => OrderStatus)
  status: OrderStatus;

  @BelongsTo(() => Courier)
  courier: Courier;
}
