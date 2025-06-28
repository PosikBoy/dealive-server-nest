import { Messages as ServerMessages } from "@/common/constants/error-messages";
import { JwtGuard } from "@/common/guards/auth.guard";
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { GetMessagesDto, PollMessagesDto } from "./dtos/get-messages-dto";
import { SendMessageDto } from "./dtos/send-message-dto";
import { MessagesService } from "./messages.service";

@UseGuards(JwtGuard)
@Controller("messages")
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get("poll")
  async poll(@Query() pollMessagesDto: PollMessagesDto, @Req() req: Request) {
    const user = req.user;

    const message = await this.messagesService.poll(
      pollMessagesDto.chatId,
      user
    );
    if (!message) throw new NotFoundException(ServerMessages.NO_NEW_MESSAGES);

    return message;
  }

  @Get("")
  async get(@Query() getMessagesDto: GetMessagesDto, @Req() req: Request) {
    const user = req.user;
    const { chatId, page } = getMessagesDto;
    const messages = await this.messagesService.getMessages(user, chatId, page);
    return messages;
  }

  @Post("")
  async send(@Body() SendMessageDto: SendMessageDto, @Req() req: Request) {
    const user = req.user;
    return await this.messagesService.send(user, SendMessageDto);
  }
}
