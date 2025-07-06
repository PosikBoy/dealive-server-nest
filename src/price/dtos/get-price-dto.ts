import { VALIDATION_ERRORS_MESSAGES } from "@/common/constants/error-messages";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

export class Address {
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 128, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 128) })
  @ApiProperty({ example: "ул. Пушкина", description: "Адрес доставки" })
  address: string;
}

export class GetPriceDto {
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 44, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 44) })
  @ApiProperty({
    example: "Документы",
    description: "Тип отправления",
  })
  readonly parcelType: string;

  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 10, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 10) })
  @ApiProperty({
    example: "До 5 кг",
    description: "Вес отправления",
  })
  readonly weight: string;

  @IsArray({ message: VALIDATION_ERRORS_MESSAGES.INVALID_ARRAY })
  @ArrayMinSize(2, {
    message: "Должно быть указано минимум два адреса (забор и доставка)",
  })
  @ValidateNested({ each: true })
  @Type(() => Address)
  readonly addresses: Address[];
}
