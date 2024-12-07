import { ApiProperty } from '@nestjs/swagger';

class TakeOrderDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор заказа' })
  orderId: number;
}

export default TakeOrderDto;
