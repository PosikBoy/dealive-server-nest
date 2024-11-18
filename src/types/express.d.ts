import * as express from 'express';
import { JwtUser } from './jwt';

// Расширяем интерфейс Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtUser; // Тип user можно более строго указать в зависимости от ваших нужд
    }
  }
}
