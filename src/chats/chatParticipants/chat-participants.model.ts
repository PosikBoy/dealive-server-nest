import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '@/users/user.model';
import { Chats } from '../chat/chat.model';

interface ChatParticipantsCreationAttrs {
  chatId: number;
  userId: number;
}

@Table({
  tableName: 'chat_participants',
  timestamps: false,
  indexes: [
    {
      fields: ['chat_id'],
    },
    {
      fields: ['user_id'],
    },
  ],
})
export class ChatParticipants extends Model<
  ChatParticipants,
  ChatParticipantsCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Chats)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'chat_id',
  })
  chatId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  createdAt: Date;
}
