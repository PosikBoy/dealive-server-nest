import { UsersService } from '@/users/users.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UserAuthDto,
  CourierRegisterDto,
  CourierLoginDto,
} from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { TokensService } from '@/tokens/tokens.service';
import { CouriersService } from '@/couriers/couriers.service';
import { FilesService } from '@/files/files.service';
import { Messages } from '@/constants/messages';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokensService,
    private courierService: CouriersService,
    private filesService: FilesService,
  ) {}

  async userRegistration(authDto: UserAuthDto): Promise<IAuthUserResponse> {
    const { email, password } = authDto;

    if (!email || !password) {
      throw new HttpException(Messages.FILL_ALL_FIELDS, HttpStatus.BAD_REQUEST);
    }

    const candidate = await this.usersService.findByEmail(email);
    if (candidate) {
      throw new HttpException(
        Messages.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create(email, hashedPassword);

    const tokens = await this.tokenService.generateTokens({
      id: user.id,
      role: 'user',
    });

    const { createdAt, updatedAt, hashPass, ...userWithoutSensitiveInfo } =
      user.toJSON();
    console.log(userWithoutSensitiveInfo);
    return { user: userWithoutSensitiveInfo, tokens: tokens };
  }

  async userLogin(authDto: UserAuthDto): Promise<IAuthUserResponse> {
    const { email, password } = authDto;

    if (!email || !password) {
      throw new HttpException(Messages.FILL_ALL_FIELDS, HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException(
        Messages.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashPass);
    if (!isPasswordValid) {
      throw new HttpException(
        Messages.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }
    //Чистим лишние данные
    const { createdAt, updatedAt, hashPass, ...userWithoutSensitiveInfo } =
      user.toJSON();

    console.log(userWithoutSensitiveInfo);
    //id, name, email, phone_number

    const tokens = await this.tokenService.generateTokens({
      id: user.id,
      role: 'user',
    });

    return { user: userWithoutSensitiveInfo, tokens: tokens };
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

    const hashPass = await bcrypt.hash(password, 5);
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
