import { Sequelize } from 'sequelize-typescript';
import { Address } from './addresses/addresses.model';
import { Chats } from './chats/chat/chat.model';
import { ChatParticipants } from './chats/chatParticipants/chat-participants.model';
import { Messages } from './chats/messages/messages.model';
import { Client } from './clients/clients.model';
import { Courier } from './couriers/couriers.model';
import { Files } from './files/files.model';
import { OrderAction } from './order-actions/order-actions.model';
import { Order } from './orders/orders.model';
import { OrderStatus } from './orders/ordersStatuses/order-statuses.model';
import { User } from './users/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        username: process.env.DB_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.DB_DATABASE,
      });
      sequelize.addModels([
        Courier,
        Client,
        Address,
        Order,
        User,
        Chats,
        ChatParticipants,
        Messages,
        OrderStatus,
        OrderAction,
        Files,
      ]);
      try {
        await sequelize.sync();
      } catch (error) {
        console.log(error);
      }
      return sequelize;
    },
  },
];
