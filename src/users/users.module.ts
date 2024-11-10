import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, ...usersProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
