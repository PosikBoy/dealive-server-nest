import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '@/common/constants/auth';
import { Messages } from '@/common/constants/error-messages';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  id: number;
  role: 'courier' | 'client';
}

@Injectable()
export class TokensService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(payload: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }),
    };
  }

  validateToken(token: string): JwtPayload {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException(Messages.INVALID_TOKEN);
    }
  }
}
