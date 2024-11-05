import {
  Column,
  CreatedAt,
  DataType,
  IsEmail,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface UserCreationAttrs {
  email: string;
  hashPass: string;
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

  @Column({ type: DataType.STRING(30), allowNull: true, unique: false })
  name: string;

  @Column({ type: DataType.STRING(45), allowNull: false, unique: true })
  email: string;

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

  @Column({
    type: DataType.STRING(3),
    allowNull: true,
    defaultValue: 'no',
    field: 'is_confirmed',
  })
  isConfirmed: string;

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
