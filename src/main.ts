import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173', // Укажите разрешенный домен
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, //access-control-allow-credentials:true
  });
  await app.listen(PORT, () => {
    console.log('Server started on' + PORT);
  });
}

start();
