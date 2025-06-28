import { VALIDATION_ERRORS_MESSAGES } from "@/common/constants/error-messages";
import { IsString, Length } from "class-validator";

export class GetSuggestionsDto {
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STRING })
  @Length(1, 255, { message: VALIDATION_ERRORS_MESSAGES.lengthRange(1, 255) })
  query: string;
}
