import { VALIDATION_ERRORS_MESSAGES } from "@/common/constants/error-messages";
import { SanitizePhone } from "@/common/decorators/sanitize-phone";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { ClientWithoutSensitiveInfo } from "./client-without-sensitive-info";

export class ClientLoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_EMAIL })
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(3, 255, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(3, 255) })
  @ApiProperty({
    example: "john.doe@example.com",
    description: "Электронная почта",
  })
  email: string;

  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 40, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 40) })
  @ApiProperty({
    example: "Passw0rd!",
    description: "Пароль",
  })
  password: string;
}

export class ClientRegisterDto {
  @IsNotEmpty()
  @IsEmail({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_EMAIL })
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(3, 255, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(3, 255) })
  @ApiProperty({
    example: "john.doe@example.com",
    description: "Электронная почта",
  })
  email: string;

  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(6, 40, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(6, 40) })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,40}$/, {
    message:
      "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру, длиной от 6 до 40 символов",
  })
  @ApiProperty({
    example: "Passw0rd!",
    description: "Пароль",
  })
  password: string;
}

export class ClientResponseDto {
  @ApiProperty({
    example: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1234567890",
      isConfirmed: true,
    },
    description: "Уникальный идентификатор клиента",
  })
  client: ClientWithoutSensitiveInfo;

  @ApiProperty({
    example: "aksjdflkasd",
    description: "JWT токен",
  })
  accessToken: string;
}

export class CourierRegisterDto {
  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @SanitizePhone()
  @Matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, {
    message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE,
  })
  @ApiProperty({
    example: "+7 (234) 567-89-00",
    description: "Номер телефона",
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(6, 40, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(6, 40) })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,40}$/, {
    message:
      "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру, длиной от 6 до 40 символов",
  })
  @ApiProperty({
    example: "Passw0rd!",
    description: "Пароль",
  })
  password: string;

  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 30, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 30) })
  @ApiProperty({
    example: "Иван",
    description: "Имя",
  })
  name: string;

  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 30, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 30) })
  @ApiProperty({
    example: "Иванов",
    description: "Фамилия",
  })
  secondName: string;

  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 30, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 30) })
  @ApiProperty({
    example: "Иванович",
    description: "Отчество",
  })
  lastName: string;

  @IsNotEmpty()
  @IsDateString({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_DATE })
  @ApiProperty({
    example: "1990-01-01",
    description: "Дата рождения",
  })
  birthDate: string;

  @IsNotEmpty()
  @IsEmail({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_EMAIL })
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 255, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 255) })
  @ApiProperty({
    example: "john.doe@example.com",
    description: "Электронная почта",
  })
  email: string;

  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 11, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 11) })
  @Matches(/^[0-9]{4}\s[0-9]{6}$/, {
    message: "Номер должен быть в формате XXXX XXXXXX",
  })
  @ApiProperty({
    example: "1234 567821",
    description: "Номер документа",
  })
  documentNumber: string;
}

export class CourierLoginDto {
  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, {
    message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE,
  })
  @SanitizePhone()
  @ApiProperty({
    example: "+7 (234) 567-89-00",
    description: "Номер телефона",
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 40, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 40) })
  @ApiProperty({
    example: "Passw0rd!",
    description: "Пароль",
  })
  password: string;
}

export class RefreshDto {
  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @ApiProperty({
    example: "aksjdflkasd",
    description: "JWT refresh-токен",
  })
  refreshToken: string;
}

export class ExistCandidateDto {
  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @SanitizePhone()
  @Matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, {
    message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE,
  })
  @ApiProperty({
    example: "+7 (234) 567-89-00",
    description: "Номер телефона",
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_EMAIL })
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 255, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 255) })
  @ApiProperty({
    example: "smth@gmail.com",
    description: "Почта",
  })
  email: string;
}
