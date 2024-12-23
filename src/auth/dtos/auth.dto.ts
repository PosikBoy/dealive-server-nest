import { ApiProperty } from '@nestjs/swagger';
import { ClientWithoutSensitiveInfo } from './client-without-sensitive-info';

export class ClientAuthDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Электронная почта',
  })
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Пароль',
  })
  password: string;
}

export class ClientResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      isConfirmed: true,
    },
    description: 'Уникальный идентификатор клиента',
  })
  client: ClientWithoutSensitiveInfo;

  @ApiProperty({
    example: 'aksjdflkasd',
    description: 'JWT токен',
  })
  accessToken: string;
}

export class CourierRegisterDto {
  @ApiProperty({
    example: '+7 (234) 567-89-00',
    description: 'Номер телефона',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'password',
    description: 'Пароль',
  })
  password: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя',
  })
  name: string;

  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия',
  })
  secondName: string;

  @ApiProperty({
    example: 'Иванович',
    description: 'Отчество',
  })
  lastName: string;

  @ApiProperty({
    example: '04.08.2005',
    description: 'Дата рождения',
  })
  birthDate: Date;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Электронная почта',
  })
  email: string;

  @ApiProperty({
    example: '1234567821',
    description: 'Номер документа',
  })
  documentNumber: string;

  @ApiProperty({
    example: 'Photo',
    description: 'Фотографии документов',
  })
  documentFiles: any;
}

export class CourierLoginDto {
  @ApiProperty({
    example: '+7 (234) 567-89-00',
    description: 'Номер телефона',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'password',
    description: 'Пароль',
  })
  password: string;
}

export class RefreshDto {
  @ApiProperty({
    example: 'aksjdflkasd',
    description: 'JWT refresh-токен',
  })
  refreshToken: string;
}

export class ExistCandidateDto {
  @ApiProperty({
    example: '+7 (234) 567-89-00',
    description: 'Номер телефона',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'smth@gmail.com',
    description: 'Почта',
  })
  email: string;
}
