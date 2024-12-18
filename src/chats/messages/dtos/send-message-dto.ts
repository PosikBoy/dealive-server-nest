export class Attachment {
  url: string;
  fileName: string;
  fileType: string;
}

export class SendMessageDto {
  text: string;
  attachments: Attachment[];
  chatId: number;
}
