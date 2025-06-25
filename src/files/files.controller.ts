import { Messages } from '@/common/constants/error-messages';
import { JwtGuard } from '@/common/guards/auth.guard';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { FilesService } from './files.service';

@UseGuards(JwtGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 10 }, // Максимум 10 файлов
      ],
      {
        // Максимальный размер файла — 4 МБ
        limits: { fileSize: 4 * 1024 * 1024 },
      },
    ),
  )
  @Post('upload')
  async uploadFiles(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Req() req: Request,
  ) {
    const user = req.user;
    try {
      // Валидация: если файлов нет, вернуть ошибку
      if (!files || !files.files || files.files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }
      console.log('fils!');
      // Передаем файлы в сервис для сохранения
      const savedFiles = await this.filesService.saveFiles(files.files, user);

      return {
        message: Messages.FILES_WAS_UPLOADED_SUCCESSFULLY,
        files: savedFiles, // Список информации о сохраненных файлах
      };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(Messages.FILE_SAVE_ERROR);
    }
  }

  @Get('download/:fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.user;
    const filePath = await this.filesService.getFile(fileName, user);
    // Отправка файла пользователю
    res.sendFile(filePath);
  }
}
