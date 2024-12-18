import { IsString, IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CourierCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsString()
  readonly secondName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsDate()
  readonly birthDate: Date;

  @IsNotEmpty()
  @IsNumber()
  readonly documentNumber: string;

  @IsNotEmpty()
  @IsNumber()
  readonly documentLink: string;
}
