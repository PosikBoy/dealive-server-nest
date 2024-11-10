import { CouriersModule } from '@/couriers/couriers.module';
import { FilesModule } from '@/files/files.module';
import { TokensModule } from '@/tokens/tokens.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule, TokensModule, CouriersModule, FilesModule],
})
export class AuthModule {}
