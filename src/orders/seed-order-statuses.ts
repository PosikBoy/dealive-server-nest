import { Sequelize } from 'sequelize-typescript';
import { OrderStatus } from './order-statuses.model';
import { OrderStatusEnum } from './ordersStatuses/orders.statuses';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: Number(3306),
  username: 'root',
  password: 'password',
  database: 'dealive',
});

sequelize.addModels([OrderStatus]);

const seedOrderStatuses = async () => {
  await sequelize.sync(); // Убедитесь, что таблицы существуют

  const statuses = [
    { id: OrderStatusEnum.NEW_ORDER, name: 'Новый заказ' },
    { id: OrderStatusEnum.IN_PROCESS, name: 'В обработке' },
    { id: OrderStatusEnum.SEARCH_COURIER, name: 'В поиске курьера' },
    { id: OrderStatusEnum.COURIER_IN_TRANSIT, name: 'Курьер в пути' },
    { id: OrderStatusEnum.DELIVERED, name: 'Заказ выполнен' },
    { id: OrderStatusEnum.NEW_ORDER, name: 'Заказ отменен' },
  ];

  for (const status of statuses) {
    await OrderStatus.findOrCreate({
      where: { id: status.id },
      defaults: status,
    });
  }
};

seedOrderStatuses()
  .then(() => console.log('Order statuses seeded successfully'))
  .catch((err) => console.error('Failed to seed order statuses:', err));
