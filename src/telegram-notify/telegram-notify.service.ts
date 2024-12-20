import { Client } from '@/clients/clients.model';
import { Courier } from '@/couriers/couriers.model';
import { Order } from '@/orders/orders.model';
import { UserWithoutSensitiveInfoDto } from '@/users/dtos/user-without-sensitive-info.dto';
import { User } from '@/users/user.model';
import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramNotifyService {
  private TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_API_KEY;
  private TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  bot = new TelegramBot(this.TELEGRAM_BOT_TOKEN || '', {
    polling: false,
  });

  newOrder(order: Order) {
    console.log(this.TELEGRAM_BOT_TOKEN);
    try {
      this.bot.sendMessage(
        this.TELEGRAM_CHAT_ID,
        `🚚 Новый заказ №${order.id} 🚚
${order.phoneNumber ? '📞 Телефон: ' + order.phoneNumber : ''}
${order.phoneName ? '📝 Имя: ' + order.phoneName : ''}
📦 Тип отправления: ${order.parcelType}
⚖️ Вес: ${order.weight}
💰 Цена: ${order.price} руб.
🏠 Адреса:
${order.addresses
  .map(
    (address) =>
      ` \n🏠 ${address.address}${
        address.floor ? `\n    🏢 Этаж: ${address.floor}` : ''
      }${
        address.apartment ? `\n    🚪 Квартира: ${address.apartment}` : ''
      }${address.phoneNumber ? `\n    📞 Телефон: ${address.phoneNumber}` : ''}${
        address.phoneName ? `\n    📝 Имя: ${address.phoneName}` : ''
      }${
        address.info
          ? `\n    ℹ️ Дополнительная информация: ${address.info}`
          : ''
      }`,
  )
  .join('')}`,
        { parse_mode: 'HTML' },
      );
    } catch (error) {
      return this.sendError(JSON.stringify(error));
    }
  }

  newCourier(user: User | UserWithoutSensitiveInfoDto, courier: Courier | any) {
    try {
      this.bot.sendMessage(
        this.TELEGRAM_CHAT_ID,
        `🚚 Новый курьер 🚚
👤 Имя: ${courier.name}
👤 Фамилия: ${courier.secondName}
👤 Отчество: ${courier.lastName}
📞 Телефон: ${user.phoneNumber}
📝 Имя: ${user.email}
📆 Дата рождения: ${courier.birthDate}
`,
        { parse_mode: 'HTML' },
      );
    } catch (error) {
      return this.sendError(JSON.stringify(error));
    }
  }

  newClient(client: any) {
    try {
      this.bot.sendMessage(
        this.TELEGRAM_CHAT_ID,
        `🚚 Новый клиент 🚚
👤 Имя: ${client.name}
📞 Телефон: ${client.phoneNumber}
📝 Почта: ${client.email}
`,
        { parse_mode: 'HTML' },
      );
    } catch (error) {
      return this.sendError(JSON.stringify(error));
    }
  }

  sendError(error: string) {
    try {
      this.bot.sendMessage(this.TELEGRAM_CHAT_ID, error, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      console.log(error);
    }
  }
}
