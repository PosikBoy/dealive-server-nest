import { VALIDATION_ERRORS_MESSAGES } from '@/common/constants/error-messages';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

class Address {
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 128, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 128) })
  @ApiProperty({ example: 'ул. Пушкина', description: 'Адрес доставки' })
  address: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 10, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 10) })
  @ApiProperty({ example: '1', description: 'Этаж' })
  floor?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 10, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 10) })
  @ApiProperty({ example: '1', description: 'Квартира' })
  apartment?: string;

  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 20, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 20) })
  @ApiProperty({ example: '+7 (999) 999-99-99', description: 'Номер телефона' })
  @Matches(/^(\+7|8)\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, {
    message:
      'Номер должен быть в формате +7 (999) 999-99-99 или 8 (888) 888-88-88',
  })
  phoneNumber: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 45, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 45) })
  @ApiProperty({
    example: 'John Doe',
    description: 'Имя получателя/отправителя',
  })
  phoneName?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 512, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 512) })
  @ApiProperty({
    example: 'Привезите сегодня до 2х',
    description: 'Дополнительная информация',
  })
  info?: string;
}

export class CreateOrderDto {
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 44, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 44) })
  @ApiProperty({
    example: 'Документы',
    description: 'Тип отправления',
  })
  parcelType: string;

  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 10, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 10) })
  @ApiProperty({
    example: 'До 5 кг',
    description: 'Вес отправления',
  })
  weight: string;

  @IsNumber({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_NUMBER })
  @Type(() => Number)
  @ApiProperty({
    example: 1000,
    description: 'Цена доставки',
  })
  price: number;

  @IsArray({ message: VALIDATION_ERRORS_MESSAGES.INVALID_ARRAY })
  @ArrayMinSize(2, {
    message: 'Должно быть указано минимум два адреса (забор и доставка)',
  })
  @ValidateNested({ each: true })
  @Type(() => Address)
  @ApiProperty({
    description: 'Адреса доставки',
    type: [Address],
    example: [
      {
        address: 'ул. Пушкина',
        floor: '3',
        apartment: '15',
        phoneNumber: '+7 (999) 999-99-99',
        phoneName: 'John Doe',
        info: 'Привезите до 14:00',
      },
      {
        address: 'ул. Лермонтова',
        floor: '5',
        apartment: '10',
        phoneNumber: '+7 (888) 888-88-88',
        phoneName: 'Jane Doe',
        info: 'Привезите вечером',
      },
    ],
  })
  addresses: Address[];
}
