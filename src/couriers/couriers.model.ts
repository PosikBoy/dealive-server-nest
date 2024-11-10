import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface CourierCreationAttrs {
  name: string;
  secondName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  hashPass: string;
  documentNumber: string;
  documentLink: string;
}

@Table({ tableName: 'couriers' })
export class Courier extends Model<Courier, CourierCreationAttrs> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
    field: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'document_link',
  })
  documentLink: string;

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
    type: DataType.STRING(10),
    allowNull: false,
    field: 'document_number',
  })
  documentNumber: string;

  @Column({
    type: DataType.BOOLEAN, // Здесь используется BOOLEAN
    allowNull: false,
    defaultValue: false,
    field: 'is_approved',
  })
  isApproved: boolean; // default is not approved

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'hash_pass',
  })
  hashPass: string;

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
