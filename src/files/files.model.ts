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

@Table({ tableName: 'files' })
export class Files extends Model<Files, CourierCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    defaultValue: '',
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
}
