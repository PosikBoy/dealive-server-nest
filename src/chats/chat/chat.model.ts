import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { ChatParticipants } from '../chatParticipants/chat-participants.model';
import { Messages } from '../messages/messages.model';
import { User } from '@/users/user.model';

interface ChatCreationAttrs {
  creatorId: number;
}

export enum ChatTypes {
  DIALOG = 'dialog',
  CHAT = 'group',
}

@Table({
  tableName: 'chats',
  timestamps: false,
  indexes: [
    {
      fields: ['creator_id'],
    },
  ],
})
export class Chats extends Model<Chats, ChatCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'creator_id',
  })
  creatorId: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    defaultValue: ChatTypes.DIALOG,
  })
  type: ChatTypes;

  @HasMany(() => ChatParticipants)
  participants: ChatParticipants[];

  @HasMany(() => Messages)
  messages: Messages[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  createdAt: Date;
}
