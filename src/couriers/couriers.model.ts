import { User } from '@/users/user.model';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

export interface CourierDataCreationAttrs {
  userId: number;
  name: string;
  secondName: string;
  lastName: string;
  birthDate: Date;
  documentNumber: string;
  documentLink: string;
}

@Table({ tableName: 'couriers' })
export class Courier extends Model<Courier, CourierDataCreationAttrs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    field: 'user_id',
  })
  userId: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    field: 'second_name',
  })
  secondName: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'birth_date',
  })
  birthDate: Date;

  @Column({
    type: DataType.STRING(11),
    allowNull: false,
    field: 'document_number',
  })
  documentNumber: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'document_link',
  })
  documentLink: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_approved',
  })
  isApproved: boolean;

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

  @BelongsTo(() => User) // Ассоциация "принадлежит" User
  user: User;
}
