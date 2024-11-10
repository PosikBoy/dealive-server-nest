import { Column, DataType, Model, Table } from 'sequelize-typescript';

//TODO: Убрать createdAt and updatedAt
@Table({ tableName: 'order_statuses' })
export class OrderStatus extends Model<OrderStatus> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  name: string;
}
