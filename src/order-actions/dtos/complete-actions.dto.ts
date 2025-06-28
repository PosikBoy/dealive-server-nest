import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class OrderActionParamDto {
  @Type(() => Number)
  @IsInt({ message: "ID должен быть числом" })
  @Min(1, { message: "ID должен быть больше нуля" })
  id: number;
}
