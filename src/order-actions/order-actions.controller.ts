import { Roles } from "@/auth/decorators/roles-auth.decorator";
import { RolesGuard } from "@/common/guards/auth.guard";
import { Controller, Param, Put, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { OrderActionParamDto } from "./dtos/complete-actions.dto";
import { OrderActionService } from "./order-actions.service";

@ApiTags("Работа с действиями заказов")
@Roles("courier")
@UseGuards(RolesGuard)
@Controller("order")
export class OrderActionController {
  constructor(private orderActionService: OrderActionService) {}
  @Put("action/:id")
  async complete(
    @Param() { id }: OrderActionParamDto,
    @Req() request: Request
  ) {
    const user = request.user;
    return await this.orderActionService.complete(id, user);
  }
}
