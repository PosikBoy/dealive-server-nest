import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { Messages } from '@/constants/messages';

@Injectable()
export class FilesService {
  async saveImages(images: Express.Multer.File[]): Promise<string> {
    try {
      const directoryName = uuid.v4();
      const directoryPath = path.resolve(
        __dirname,
        '..',
        'imgs',
        directoryName,
      );
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }
      images.forEach((image, index) => {
        fs.writeFileSync(
          path.join(directoryPath, `${index}.jpg`),
          image.buffer,
        );
      });
      return directoryName;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.FILE_SAVE_ERROR);
    }
  }
}
