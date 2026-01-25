import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetMessagesDto {
  @IsNumber()
  @Type(() => Number)
  chatId: number;

  @IsNumber()
  @Type(() => Number)
  page: number;
}

export class PollMessagesDto {
  @IsNumber()
  @Type(() => Number)
  chatId: number;
}
