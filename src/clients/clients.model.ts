import { User } from '@/users/user.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface ClientCreationAttrs {
  userId: number;
  name?: string;
}

@Table({ tableName: 'clients' })
export class Client extends Model<Client, ClientCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    field: 'user_id',
  })
  userId: number;

  @ApiProperty({ example: 'Евгений', description: 'Имя пользователя' })
  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: '',
  })
  name: string;

  @ApiProperty({
    example: 'yes/no',
    description: 'Подтвержден ли номер телефона пользователя',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_number_confirmed',
  })
  isNumberConfirmed: boolean;

  @ApiProperty({
    example: 'yes/no',
    description: 'Подтверждена ли почта пользователя',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_email_confirmed',
  })
  isEmailConfirmed: boolean;

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
