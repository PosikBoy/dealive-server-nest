import { ApiProperty } from '@nestjs/swagger';

class Address {
  @ApiProperty({ example: 'ул. Пушкина', description: 'Адрес доставки' })
  address: string;

  @ApiProperty({ example: '1', description: 'Этаж' })
  floor?: string;

  @ApiProperty({ example: '1', description: 'Квартира' })
  apartment?: string;

  @ApiProperty({ example: '+7 (999) 999-99-99', description: 'Номер телефона' })
  phoneNumber: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Имя получателя/отправителя',
  })
  phoneName?: string;

  @ApiProperty({
    example: 'Привезите сегодня до 2х',
    description: 'Дополнительная информация',
  })
  info?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'Документы',
    description: 'Тип отправления',
  })
  parcelType: string;

  @ApiProperty({
    example: 'До 5 кг',
    description: 'Вес отправления',
  })
  weight: string;

  @ApiProperty({
    example: 1000,
    description: 'Цена доставки',
  })
  price: number;

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
