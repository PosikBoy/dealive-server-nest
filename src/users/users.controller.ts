import {
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  get(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme != 'Bearer' || !token) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    return this.usersService.findByToken(token);
  }
}
