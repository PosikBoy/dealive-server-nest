import { Messages as ServerMessages } from '@/common/constants/error-messages';
import { MESSAGES_REPOSITORY } from '@/common/constants/sequelize';
import { JwtUser } from '@/common/types/jwt';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { ChatParticipantsService } from '../chatParticipants/chat-participants.service';
import { SendMessageDto } from './dtos/send-message-dto';
import { Messages } from './messages.model';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(MESSAGES_REPOSITORY) private messageRepository: typeof Messages,
    private chatParticipantsService: ChatParticipantsService,
  ) {}
  eventEmitter = new EventEmitter();
  LIMIT = 100;

  async poll(chatId: number, user: JwtUser): Promise<any> {
    const userID = user.id;

    const isParticipatedInChat = this.chatParticipantsService.isUserInThisChat(
      userID,
      chatId,
    );

    if (!isParticipatedInChat) {
      throw new ForbiddenException(ServerMessages.YOU_ARE_NOT_IN_THIS_CHAT);
    }

    const eventName = `message:${chatId}`;

    // Оборачиваем логику в промис
    return new Promise((resolve) => {
      // Обработчик для события
      const messageHandler = (message) => {
        // Сразу резолвим промис с ответом
        resolve(message);

        // Убираем обработчик после получения события
        this.eventEmitter.off(eventName, messageHandler);
      };

      // Подписываемся на событие
      this.eventEmitter.once(eventName, messageHandler);

      // Устанавливаем таймаут для завершения ожидания
      setTimeout(() => {
        // Если событие не произошло, возвращаем пустой ответ
        this.eventEmitter.off(eventName, messageHandler);
        resolve(null);
      }, 15000);
    });
  }

  async send(user: JwtUser, sendMessageDto: SendMessageDto) {
    const senderId = user.id;
    const isParticipatedInChat = this.chatParticipantsService.isUserInThisChat(
      senderId,
      sendMessageDto.chatId,
    );

    if (!isParticipatedInChat) {
      throw new ForbiddenException(ServerMessages.YOU_ARE_NOT_IN_THIS_CHAT);
    }

    const message = await this.messageRepository.create({
      senderId,
      ...sendMessageDto,
    });

    this.eventEmitter.emit(`message:${sendMessageDto.chatId}`, message);

    return message;
  }

  async getMessages(user: JwtUser, chatId: number, page: number) {
    const userId = user.id;
    const isParticipatedInChat =
      await this.chatParticipantsService.isUserInThisChat(userId, chatId);

    if (!isParticipatedInChat) {
      throw new ForbiddenException(ServerMessages.YOU_ARE_NOT_IN_THIS_CHAT);
    }
    // Пагинация
    const offset = (page - 1) * this.LIMIT;

    // Запрос сообщений с пагинацией
    const messages = await this.messageRepository.findAll({
      where: { chatId: chatId }, // Можно добавить другие фильтры, если нужно
      limit: this.LIMIT, // Максимальное количество сообщений на странице
      offset: offset, // Начало выборки
      order: [['createdAt', 'DESC']], // Сортировка по дате, от новых к старым
    });

    return messages;
  }
}
