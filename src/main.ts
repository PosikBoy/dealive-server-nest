import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppValidationPipe } from './common/pipes/validation.pipe';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dealive API')
    .setDescription('API для серверной части приложения Dealive')
    .setVersion('1.0')
    .addTag('Prod. by Yungg')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);

  app.use(cookieParser());

  app.useGlobalPipes(new AppValidationPipe());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.3.11',
      'ru.dealive.mobile',
      'http://localhost:8081',
      'https://dealive.ru',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешённые HTTP методы
    credentials: true, // Если требуется передача cookies или авторизационных данных
  });

  await app.listen(PORT, () => {
    console.log('Server started on ' + PORT);
  });
}

start();
