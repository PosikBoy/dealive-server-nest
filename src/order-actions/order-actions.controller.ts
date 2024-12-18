import { RolesGuard } from '@/auth/auth.guards';
import { Roles } from '@/auth/decorators/roles-auth.decorator';
import { Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderActionService } from './order-actions.service';
import { Request } from 'express';

@ApiTags('Работа с действиями заказов')
@Roles('courier')
@UseGuards(RolesGuard)
@Controller('order')
export class OrderActionController {
  constructor(private orderActionService: OrderActionService) {}
  @Put('action/:id')
  async complete(@Param('id') statusId: number, @Req() request: Request) {
    const user = request.user;
    return await this.orderActionService.complete(statusId, user);
  }
}
