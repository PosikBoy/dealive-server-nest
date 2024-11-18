import { Sequelize } from 'sequelize-typescript';
import { Courier } from './couriers/couriers.model';
import { Client } from './clients/clients.model';
import { Address } from './addresses/addresses.model';
import { Order } from './orders/orders.model';
import { OrderStatus } from './orders/order-statuses.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      sequelize.addModels([Courier, Client, Address, Order, OrderStatus]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
