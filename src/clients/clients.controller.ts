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
import { JwtGuard, RolesGuard } from '@/auth/auth.guards';
import { Request } from 'express';
import { ClientEditInfo } from './dtos/clients.dto';
import { Roles } from '@/auth/roles-auth.decorator';

@Controller('client')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Roles('client')
  @UseGuards(RolesGuard)
  @Get()
  async getClientInfo(@Req() request: Request) {
    console.log(request.user);
    const userId = request.user.id;
    return await this.clientsService.findById(userId);
  }

  @Put('/edit')
  async editClientInfo(@Body() body: ClientEditInfo, @Req() request: Request) {
    const userId = request.user.id;
    const client = await this.clientsService.editClientInfo(userId, body);
    return client;
  }
}
