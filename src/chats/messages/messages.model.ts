import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '@/users/user.model';
import { Chats } from '../chat/chat.model';
import { Attachment } from './dtos/send-message-dto';

//
interface MessageCreationAttrs {
  senderId: number;
  text: string;
  chatId: number;
  attachments?: Attachment[];
}
@Table({
  tableName: 'messages',
  indexes: [
    {
      fields: ['sender_id', 'chat_id'],
    },
    {
      fields: ['sender_id'],
    },
    { fields: ['chat_id'] },
    { fields: ['created_at'] },
  ],
})
export class Messages extends Model<Messages, MessageCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'sender_id',
    comment: 'ID отправителя сообщения',
  })
  senderId: number;

  @Column({ type: DataType.STRING(512), allowNull: true, defaultValue: '' })
  text: string;

  @Column({
    type: DataType.JSON,
    allowNull: true, // Вложение необязательно
  })
  attachments: Array<{
    url: string; // Ссылка на файл
    fileName: string; // Имя файла
    fileType: string; // Тип файла (например, image/png, application/pdf)
  }>;

  @ForeignKey(() => Chats)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'chat_id',
    comment: 'ID чата, к которому относится сообщение',
  })
  chatId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at',
  })
  updatedAt: Date;
}
