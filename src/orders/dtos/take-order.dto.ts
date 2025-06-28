import { ApiProperty } from '@nestjs/swagger';

export class TakeOrderDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор заказа' })
  orderId: number;
}
