import { User } from '@/users/user.model';
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface CourierCreationAttrs {
  userId: number;
  name?: string;
}

@Table({ tableName: 'clients' })
export class Client extends Model<Client, CourierCreationAttrs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    field: 'user_id',
  })
  userId: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: '',
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_number_confirmed',
  })
  isNumberConfirmed: boolean;

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
