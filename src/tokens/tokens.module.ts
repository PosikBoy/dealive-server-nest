import { ACCESS_TOKEN_EXPIRES_IN } from '@/common/constants/auth';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt_secret_dev',
      signOptions: {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    }),
  ],
  exports: [TokensService],
})
export class TokensModule {}
