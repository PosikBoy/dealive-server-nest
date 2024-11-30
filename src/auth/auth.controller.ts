import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ClientAuthDto,
  CourierRegisterDto,
  CourierLoginDto,
} from './dtos/auth.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { REFRESH_TOKEN, REFRESH_TOKEN_MAX_AGE } from '@/constants/auth';
import { Messages } from '@/constants/messages';
import { JwtGuard } from './auth.guards';

@Controller('client')
export class ClientAuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async clientLogin(@Body() authDto: ClientAuthDto, @Res() res: Response) {
    const { client, tokens } = await this.authService.clientLogin(authDto);
    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    return res.send({ client, accessToken: tokens.accessToken });
  }
  @Post('registration')
  async userRegistration(@Body() authDto: ClientAuthDto, @Res() res: Response) {
    const { client, tokens } =
      await this.authService.clientRegistration(authDto);

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res.send({ client, accessToken: tokens.accessToken });
  }

  @Get('refresh')
  async refresh(@Req() request: Request, @Res() res: Response) {
    const refreshToken = request.cookies[REFRESH_TOKEN];
    const tokens = await this.authService.refreshTokens(refreshToken);

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res.send({ accessToken: tokens.accessToken });
  }

  @Get('logout')
  async logOut() {
    return { message: Messages.LOGOUT_SUCCESSFUL };
  }
}

@Controller('courier')
export class CourierAuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async courierLogin(@Body() courierLogin: CourierLoginDto) {
    return await this.authService.courierLogin(courierLogin);
  }

  @Post('registration')
  @UseInterceptors(FilesInterceptor('documentFiles'))
  async courierRegistration(
    @Body() courierRegisterDto: CourierRegisterDto,
    @UploadedFiles() documentFiles: Express.Multer.File[],
  ) {
    return await this.authService.courierRegistration(
      courierRegisterDto,
      documentFiles,
    );
  }
  @Get('refresh')
  async refresh(@Req() request: Request, @Res() res: Response) {
    const refreshToken = request.cookies[REFRESH_TOKEN];
    const tokens = await this.authService.refreshTokens(refreshToken);
    return res.send(tokens);
  }
}
