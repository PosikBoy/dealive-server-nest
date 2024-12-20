import { JwtGuard } from '@/auth/auth.guards';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';

@UseGuards(JwtGuard)
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Post('create')
  async createChat(@Req() request: Request) {
    const user = request.user;

    const chat = await this.chatService.createChat(user);
    return chat;
  }
}
