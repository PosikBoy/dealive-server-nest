import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsDate,
  Length,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateCourierDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsString()
  readonly secondName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsPhoneNumber('RU') // Можно указать страну, например, 'RU'
  readonly phoneNumber: string;

  @IsDate()
  readonly birthDate: Date;

  @IsNotEmpty()
  @IsString()
  @Length(8, 128) // Предположим, что длина пароля от 8 до 128 символов
  readonly hashPass: string;

  @IsNotEmpty()
  @IsNumber()
  readonly documentNumber: string;
}
