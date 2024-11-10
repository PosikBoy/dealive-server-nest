import { Messages } from '@/constants/messages';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  id: number;
  role: 'courier' | 'user';
}

@Injectable()
export class TokensService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(payload: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '1m',
      }),
    };
  }

  validateToken(token: string): any {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      return payload; // Вернет полезную нагрузку (payload)
    } catch (error) {
      throw new UnauthorizedException(Messages.INVALID_TOKEN); // Или можно вернуть null, если это подходит вашему коду
    }
  }
}
