import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthDto, CourierRegisterDto } from './dtos/auth.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { REFRESH_TOKEN, REFRESH_TOKEN_MAX_AGE } from '@/constants/tokens';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  async test() {
    return 'pong';
  }
  @Post('/user/login')
  async userLogin(@Body() authDto: UserAuthDto, @Res() res: Response) {
    const { user, tokens } = await this.authService.userLogin(authDto);
    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    return res.send({ user, accessToken: tokens.accessToken });
  }
  @Post('/user/registration')
  async userRegistration(@Body() authDto: UserAuthDto, @Res() res: Response) {
    const { user, tokens } = await this.authService.userRegistration(authDto);

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res.send({ user, accessToken: tokens.accessToken });
  }

  @Post('/courier/login')
  async courierLogin() {}

  @Post('/courier/registration')
  @UseInterceptors(FilesInterceptor('documentFiles'))
  async courierRegistration(
    @Body() courierRegisterDto: CourierRegisterDto,
    @UploadedFiles() documentFiles: Express.Multer.File[],
  ) {
    return this.authService.courierRegistration(
      courierRegisterDto,
      documentFiles,
    );
  }
  @Get('/user/logout')
  async logOut() {
    return { message: 'logout was successful' };
  }
}
