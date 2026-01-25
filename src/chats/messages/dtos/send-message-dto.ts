import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Attachment {
  @IsString()
  url: string;

  @IsString()
  fileName: string;

  @IsString()
  fileType: string;
}

export class SendMessageDto {
  @IsString()
  @IsOptional()
  text: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  @IsOptional()
  attachments: Attachment[];

  @IsNumber()
  @Type(() => Number)
  chatId: number;
}
