import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { RolesGuard } from '@/auth/auth.guards';
import { Request } from 'express';
import { ClientEditInfoDto } from './dtos/clients.dto';
import { Roles } from '@/auth/decorators/roles-auth.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiResponses } from '@/constants/swaggerResponses';
import { UserService } from '@/users/user.service';
import { UserRolesEnum } from '@/users/user.model';

@ApiTags('Работа с клиентами')
@Roles('client')
@UseGuards(RolesGuard)
@Controller('client')
export class ClientsController {
  constructor(
    private clientsService: ClientsService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Получение информации о клиенте' })
  @ApiResponse({
    description: 'OK',
    status: 200,
    example: {
      id: 6,
      email: 'john.doe@example.com',
      name: '',
      phoneNumber: '',
      isConfirmed: false,
    },
  })
  @ApiResponses.Unauthorized
  @ApiResponses.InvalidToken
  @Get()
  async getClientInfo(@Req() request: Request) {
    const userId = request.user.id;
    const user = this.userService.findUser(
      'id',
      userId,
      UserRolesEnum.CLIENT,
      false,
    );
    const client = await this.clientsService.findClient(userId);
    return { ...client, ...user };
  }

  @ApiOperation({ summary: 'Редактирование информации о клиенте' })
  @ApiResponse({
    example: {
      id: 6,
      email: 'string',
      name: 'string',
      phoneNumber: 'string',
      isConfirmed: false,
    },
    description: 'Редактирование информации о клиенте',
    status: 200,
  })
  @ApiResponses.Unauthorized
  @ApiResponses.InvalidToken
  @Put('')
  async editClientInfo(
    @Body() body: ClientEditInfoDto,
    @Req() request: Request,
  ) {
    const userId = request.user.id;
    const client = await this.clientsService.editClientInfo(userId, body);
    return client;
  }
}
