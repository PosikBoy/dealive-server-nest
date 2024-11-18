import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientJwtGuard } from '@/auth/auth.guards';
import { Request } from 'express';
import { ClientEditInfo } from './dtos/clients.dto';

@Controller('client')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @UseGuards(ClientJwtGuard)
  @Get()
  async getClientInfo(@Req() request: Request) {
    const userId = request.user.id;
    return await this.clientsService.findById(userId);
  }

  @UseGuards(ClientJwtGuard)
  @Put('/edit')
  async editClientInfo(@Body() body: ClientEditInfo, @Req() request: Request) {
    const userId = request.user.id;
    const client = await this.clientsService.editClientInfo(userId, body);
    return client;
  }
}
