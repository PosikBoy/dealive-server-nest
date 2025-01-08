import { Client } from '@/clients/clients.model';
import { Courier } from '@/couriers/couriers.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreatedAt,
  DataType,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

export enum UserRolesEnum {
  COURIER = 'courier',
  CLIENT = 'client',
  SUPPORT = 'support',
}

export interface UserCreationAttrs {
  email?: string;
  phoneNumber?: string;
  hashPass: string;
  role: UserRolesEnum;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    unique: true,
  })
  id: number;

  @ApiProperty({
    example: 'example@example.com',
    description: 'Электронная почта',
  })
  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    unique: false,
  })
  email: string;

  @ApiProperty({
    example: '+7 (999) 999-99-99',
    description: 'Номер телефона',
  })
  @Column({
    type: DataType.STRING(20),
    unique: false,
    field: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'hash_pass',
  })
  hashPass: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  role: UserRolesEnum;

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

  @HasOne(() => Courier)
  courier?: Courier;

  @HasOne(() => Client)
  client?: Client;
}
