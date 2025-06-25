import { Messages } from '@/common/constants/error-messages';
import { FILES_REPOSITORY } from '@/common/constants/sequelize';
import { JwtUser } from '@/common/types/jwt';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { Files } from './files.model';

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILES_REPOSITORY) private filesRepository: typeof Files,
  ) {}

  // Сохранение фотографий документов
  async saveDocuments(images: Express.Multer.File[]): Promise<string> {
    try {
      const directoryName = uuid.v4();
      const directoryPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'documents',
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
  async saveFiles(files: Express.Multer.File[], user: JwtUser) {
    try {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'text/plain',
        'audio/mpeg',
        'video/mp4',
      ];

      const maxFileSize = 4 * 1024 * 1024; // 10 MB

      const fileName = uuid.v4(); // Уникальное имя файла
      const directoryPath = path.resolve(__dirname, '..', 'attachments');

      // Создание папки, если она не существует
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      const savedFiles = []; // Массив для хранения информации о сохраненных файлах

      files.forEach((file) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new BadRequestException(`Недопустимый формат файла`);
        }
        if (file.size > maxFileSize) {
          throw new BadRequestException('Максимальный размер файла - 10 МБ');
        }
        // Извлечение расширения файла
        const fileExtension = path.extname(file.originalname) || '';

        // Генерация уникального имени файла
        const fullFileName = `${fileName}-${Date.now()}${fileExtension}`;

        // Запись файла в директорию
        fs.writeFileSync(path.join(directoryPath, fullFileName), file.buffer);

        // Сохранение информации о файле в базе данных
        this.filesRepository.create({ name: fullFileName, userId: user.id });
        // Добавление информации о файле в массив
        savedFiles.push({
          fileName: fullFileName,
        });
      });

      return savedFiles; // Возвращаем массив с информацией о сохраненных файлах
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Ошибка при сохранении файлов');
    }
  }
  async getFile(fileName: string, user: JwtUser) {
    const userId = user.id;
    const filePath = path.join(__dirname, '..', 'attachments', fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(Messages.FILE_NOT_FOUND);
    }

    const storedFile = await this.filesRepository.findOne({
      where: { name: fileName },
    });

    if (storedFile.userId !== userId) {
      if (user.role === 'support') return filePath;
      throw new ForbiddenException(Messages.ACCESS_DENIED);
    }

    return filePath;
  }
}
