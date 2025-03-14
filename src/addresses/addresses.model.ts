import { Order } from '@/orders/orders.model';
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface AddressCreationAttrs {
  address: string;
  orderId: number;
  phoneNumber: string;
  floor?: string;
  apartment?: string;
  phoneName?: string;
  info?: string;
}

@Table({ tableName: 'order_addresses' })
export class Address extends Model<Address, AddressCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: false,
    field: 'order_id',
  })
  orderId: number;

  @Column({
    type: DataType.STRING(128),
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: null,
  })
  floor?: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    defaultValue: null,
  })
  apartment?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: true,
    defaultValue: null,
    field: 'phone_name',
  })
  phoneName?: string;

  @Column({
    type: DataType.STRING(1024),
    allowNull: true,
    defaultValue: null,
  })
  info?: string;

  @Column({
    type: DataType.STRING(1024),
    allowNull: true,
    defaultValue: null,
  })
  comment?: string;
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
}
