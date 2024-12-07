import { ApiResponses } from '@/constants/swaggerResponses';

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
  ClientResponseDto,
  RefreshDto,
  ExistCandidateDto,
} from './dtos/auth.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { REFRESH_TOKEN, REFRESH_TOKEN_MAX_AGE } from '@/constants/auth';
import { Messages } from '@/constants/messages';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from './auth.guards';
import { Roles } from './decorators/roles-auth.decorator';

@ApiTags('Авторизация клиентов')
@Controller('client')
export class ClientAuthController {
  constructor(private authService: AuthService) {}

  @ApiHeader({
    name: 'Set-Cookie',
    description:
      'После успешной регистрации refresh токен устанавливается в cookie как HTTP-only',
  })
  @ApiOperation({ summary: 'Авторизация клиента' })
  @ApiResponse({ status: 200, type: ClientResponseDto, description: 'OK' })
  @ApiResponses.Unauthorized
  @Post('login')
  async clientLogin(@Body() authDto: ClientAuthDto, @Res() res: Response) {
    const { client, tokens } = await this.authService.clientLogin(authDto);
    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    return res.send({ client, accessToken: tokens.accessToken });
  }

  @ApiHeader({
    name: 'Set-Cookie',
    description:
      'После успешной регистрации refresh токен устанавливается в cookie как HTTP-only',
  })
  @ApiOperation({ summary: 'Регистрация клиента' })
  @ApiResponse({ status: 200, type: ClientResponseDto, description: 'OK' })
  @ApiResponse({
    status: 409,
    description: Messages.USER_ALREADY_EXISTS,
    example: {
      message: Messages.USER_ALREADY_EXISTS,
      statusCode: 409,
      error: 'Conflict',
    },
  })
  @ApiResponse({
    status: 400,
    description: Messages.FILL_ALL_FIELDS,
    example: {
      message: Messages.FILL_ALL_FIELDS,
      statusCode: 400,
      error: 'Bad Request',
    },
  })
  @Post('registration')
  async clientRegistration(
    @Body() authDto: ClientAuthDto,
    @Res() res: Response,
  ) {
    const { client, tokens } =
      await this.authService.clientRegistration(authDto);

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res.send({ client, accessToken: tokens.accessToken });
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({
    status: 200,
    example: { accessToken: 'token' },
    description: 'OK',
  })
  @ApiResponses.InvalidToken
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

  @ApiOperation({ summary: 'Выход с аккаунта' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: { message: Messages.LOGOUT_SUCCESSFUL },
  })
  @Get('logout')
  async logOut() {
    return { message: Messages.LOGOUT_SUCCESSFUL };
  }
}

@ApiTags('Авторизация курьеров')
@Controller('courier')
export class CourierAuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация курьера' })
  @ApiResponse({
    description: 'OK',
    status: 200,
    example: { accessToken: 'token', refreshToken: 'token' },
  })
  @ApiResponse({
    status: 401,
    description: Messages.INVALID_CREDENTIALS,
    example: {
      message: Messages.INVALID_CREDENTIALS,
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Post('login')
  async courierLogin(@Body() courierLogin: CourierLoginDto) {
    return await this.authService.courierLogin(courierLogin);
  }

  @ApiOperation({ summary: 'Регистрация курьера' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: { accessToken: 'token', refreshToken: 'token' },
  })
  @ApiResponse({
    status: 409,
    description: Messages.USER_ALREADY_EXISTS,
    example: {
      message: Messages.USER_ALREADY_EXISTS,
      error: 'Conflict',
      statusCode: 409,
    },
  })
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

  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: { accessToken: 'token', refreshToken: 'token' },
  })
  @ApiResponses.InvalidToken
  @Post('refresh')
  async refresh(@Body() courierRefreshDto: RefreshDto, @Res() res: Response) {
    const { refreshToken } = courierRefreshDto;
    const tokens = await this.authService.refreshTokens(refreshToken);
    return res.send(tokens);
  }

  @ApiResponse({
    status: 200,
    description: 'OK',
    example: { message: Messages.USER_NOT_FOUND, exist: false },
  })
  @ApiResponse({
    status: 409,
    description: Messages.USER_ALREADY_EXISTS,
    example: {
      message: Messages.USER_ALREADY_EXISTS,
      error: 'Conflict',
      statusCode: 409,
    },
  })
  @Post('exist')
  async existCourier(
    @Body() existCandidateDto: ExistCandidateDto,
    @Res() res: Response,
  ) {
    const exist: boolean =
      await this.authService.existCourierCandidate(existCandidateDto);

    return res.send({ message: Messages.USER_NOT_FOUND, exist });
  }

  @Roles('courier')
  @UseGuards(RolesGuard)
  @Get('isApproved')
  async isApproved(@Req() request, @Res() res: Response) {
    const user = request.user;
    const isApproved = await this.authService.isCourierApproved(user);
    return res.send({ isApproved });
  }
}
