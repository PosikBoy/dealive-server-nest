import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtGuard } from '@/auth/auth.guards';
import { Request } from 'express';
import { SendMessageDto } from './dtos/send-message-dto';
import { GetMessagesDto, PollMessagesDto } from './dtos/get-messages-dto';
import { Messages as ServerMessages } from '@/constants/messages';

@UseGuards(JwtGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('poll')
  async poll(@Query() pollMessagesDto: PollMessagesDto, @Req() req: Request) {
    const user = req.user;
    console.log(user);

    const message = await this.messagesService.poll(
      pollMessagesDto.chatId,
      user,
    );
    if (!message) throw new NotFoundException(ServerMessages.NO_NEW_MESSAGES);

    return message;
  }

  @Get('')
  async get(@Query() getMessagesDto: GetMessagesDto, @Req() req: Request) {
    const user = req.user;
    const { chatId, page } = getMessagesDto;
    const messages = await this.messagesService.getMessages(user, chatId, page);
    return messages;
  }

  @Post('')
  async send(@Body() SendMessageDto: SendMessageDto, @Req() req: Request) {
    const user = req.user;
    return await this.messagesService.send(user, SendMessageDto);
  }
}
