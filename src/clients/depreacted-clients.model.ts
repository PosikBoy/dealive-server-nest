import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface ClientCreationAttrs {
  email: string;
  hashPass: string;
}

@Table({ tableName: 'clients' })
export class Client extends Model<Client, ClientCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    unique: true,
  })
  id: number;

  @ApiProperty({ example: 'Евгений', description: 'Имя пользователя' })
  @Column({ type: DataType.STRING(30), allowNull: true, unique: false })
  name: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'Электронная почта',
  })
  @Column({ type: DataType.STRING(45), allowNull: false, unique: true })
  email: string;

  @ApiProperty({
    example: '+7 (999) 999-99-99',
    description: 'Номер телефона',
  })
  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    unique: true,
    field: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: false,
    field: 'hash_pass',
  })
  hashPass: string;

  @ApiProperty({
    example: 'yes/no',
    description: 'Подтверждена ли почта пользователя',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'is_confirmed',
  })
  isConfirmed: boolean;

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
