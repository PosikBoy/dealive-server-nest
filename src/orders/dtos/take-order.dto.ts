import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TakeOrderDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор заказа' })
  @IsNotEmpty({ message: 'orderId не может быть пустым' })
  @IsNumber({}, { message: 'orderId должен быть числом' })
  @Type(() => Number)
  orderId: number;
}
