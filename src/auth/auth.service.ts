import { ClientsService } from '@/clients/clients.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ClientAuthDto,
  CourierRegisterDto,
  CourierLoginDto,
} from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { TokensService } from '@/tokens/tokens.service';
import { CouriersService } from '@/couriers/couriers.service';
import { FilesService } from '@/files/files.service';
import { Messages } from '@/constants/messages';
import { PASSWORD_SALT } from '@/constants/auth';

@Injectable()
export class AuthService {
  constructor(
    private clientService: ClientsService,
    private tokenService: TokensService,
    private courierService: CouriersService,
    private filesService: FilesService,
  ) {}

  async clientRegistration(
    authDto: ClientAuthDto,
  ): Promise<IAuthClientResponse> {
    const { email, password } = authDto;

    if (!email || !password) {
      throw new HttpException(Messages.FILL_ALL_FIELDS, HttpStatus.BAD_REQUEST);
    }

    const candidate = await this.clientService.findByEmail(email);
    if (candidate) {
      throw new HttpException(
        Messages.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT);

    const client = await this.clientService.create(email, hashedPassword);

    const tokens = await this.tokenService.generateTokens({
      id: client.id,
      role: 'client',
    });

    const { createdAt, updatedAt, hashPass, ...clientWithoutSensitiveInfo } =
      client.toJSON();
    return { client: clientWithoutSensitiveInfo, tokens: tokens };
  }

  async clientLogin(authDto: ClientAuthDto): Promise<IAuthClientResponse> {
    const { email, password } = authDto;

    if (!email || !password) {
      throw new HttpException(Messages.FILL_ALL_FIELDS, HttpStatus.BAD_REQUEST);
    }

    const client = await this.clientService.findByEmail(email);

    if (!client) {
      throw new HttpException(
        Messages.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, client.hashPass);
    if (!isPasswordValid) {
      throw new HttpException(
        Messages.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }
    //Чистим лишние данные
    const { createdAt, updatedAt, hashPass, ...clientWithoutSensitiveInfo } =
      client.toJSON();

    const tokens = await this.tokenService.generateTokens({
      id: client.id,
      role: 'client',
    });

    return { client: clientWithoutSensitiveInfo, tokens: tokens };
  }

  async courierRegistration(
    courierDto: CourierRegisterDto,
    documentImages: Express.Multer.File[],
  ): Promise<ITokens> {
    const { phoneNumber, password, email } = courierDto;

    const candidate = await this.courierService.findCourierByEmailOrPhone(
      email,
      phoneNumber,
    );

    if (candidate) {
      throw new HttpException(
        Messages.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(password, PASSWORD_SALT);
    const hashPass = await bcrypt.hash(password, PASSWORD_SALT);
    const documentLink = await this.filesService.saveImages(documentImages);

    const courier = await this.courierService.createCourier({
      ...courierDto,
      documentLink,
      hashPass,
    });

    const tokens = this.tokenService.generateTokens({
      id: courier.id,
      role: 'courier',
    });
    return tokens;
  }

  async courierLogin(loginCourierDto: CourierLoginDto): Promise<ITokens> {
    const { phoneNumber, password } = loginCourierDto;

    const courier = await this.courierService.findCourierByPhone(phoneNumber);

    if (!courier) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await bcrypt.compare(password, courier.hashPass);

    if (!isPasswordValid) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS);
    }

    const tokens = this.tokenService.generateTokens({
      id: courier.id,
      role: 'courier',
    });

    return tokens;
  }

  refreshTokens(refreshToken: string) {
    const { id, role } = this.tokenService.validateToken(refreshToken);
    const tokens = this.tokenService.generateTokens({ id, role });
    return tokens;
  }
}
