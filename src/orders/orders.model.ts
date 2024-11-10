import { Address } from '@/addresses/addresses.model';
import { Courier } from '@/couriers/couriers.model';
import { User } from '@/users/users.model';
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Index,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { OrderStatus } from './order-statuses.model';

export interface OrderCreationAttrs {
  userId?: number;
  phoneNumber?: string;
  phoneName?: string;
  parcelType: string;
  weight: string;
  price: number;
}
@Table({
  tableName: 'orders',
  indexes: [
    {
      fields: ['user_id'],
    },
    {
      fields: ['courier_id'],
    },
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: false,
    field: 'user_id',
  })
  userId?: number;

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
    type: DataType.STRING(10),
    allowNull: true,
    unique: false,
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
}
