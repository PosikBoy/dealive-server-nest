import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

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
      throw new HttpException(
        'Произошла ошибка при сохранении файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
