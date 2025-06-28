import { VALIDATION_ERRORS_MESSAGES } from "@/common/constants/error-messages";
import { SanitizePhone } from "@/common/decorators/sanitize-phone";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class ClientEditInfoDto {
  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 30, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 30) })
  @ApiProperty({
    example: "Иван",
    description: "Имя",
  })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_EMAIL })
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 255, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 255) })
  @ApiProperty({
    example: "smth@gmail.com",
    description: "Почта",
  })
  email: string;

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
}

export class ClientDto {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  isNumberConfirmed: boolean;
  isEmailConfirmed: boolean;
}
