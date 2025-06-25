import { ClientsService } from '@/clients/clients.service';
import { PASSWORD_SALT } from '@/common/constants/auth';
import { Messages } from '@/common/constants/error-messages';
import { JwtUser } from '@/common/types/jwt';
import { CouriersService } from '@/couriers/couriers.service';
import { FilesService } from '@/files/files.service';
import { TelegramNotifyService } from '@/telegram-notify/telegram-notify.service';
import { TokensService } from '@/tokens/tokens.service';
import { UserRolesEnum } from '@/users/user.model';
import { UserService } from '@/users/user.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  ClientAuthDto,
  CourierLoginDto,
  CourierRegisterDto,
  ExistCandidateDto,
} from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private clientService: ClientsService,
    private tokenService: TokensService,
    private courierService: CouriersService,
    private filesService: FilesService,
    private userService: UserService,
    private telegramNotifyService: TelegramNotifyService,
  ) {}

  async clientRegistration(
    authDto: ClientAuthDto,
  ): Promise<IAuthClientResponse> {
    const { email, password } = authDto;

    if (!email || !password) {
      throw new BadRequestException(Messages.FILL_ALL_FIELDS);
    }

    const candidate = await this.userService.findUser(
      'email',
      email,
      UserRolesEnum.CLIENT,
    );
    if (candidate) {
      throw new ConflictException(Messages.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT);

    const user = await this.userService.create({
      email,
      hashPass: hashedPassword,
      role: UserRolesEnum.CLIENT,
    });

    const client = await this.clientService.create(user.id);
    const tokens = await this.tokenService.generateTokens({
      id: user.id,
      role: UserRolesEnum.CLIENT,
    });

    return {
      client: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: client.name,
        role: user.role,
        isEmailConfirmed: client.isEmailConfirmed,
        isNumberConfirmed: client.isNumberConfirmed,
      },
      tokens: tokens,
    };
  }

  async clientLogin(authDto: ClientAuthDto): Promise<IAuthClientResponse> {
    const { email, password } = authDto;

    if (!email || !password) {
      throw new BadRequestException(Messages.FILL_ALL_FIELDS);
    }

    let user = await this.userService.findUser(
      'email',
      email,
      UserRolesEnum.CLIENT,
      true,
    );

    if (!user) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS);
    }

    let isPasswordValid = false;
    if ('hashPass' in user) {
      isPasswordValid = await bcrypt.compare(password, user.hashPass);
    }
    if (!isPasswordValid) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS);
    }

    const tokens = await this.tokenService.generateTokens({
      id: user.id,
      role: 'client',
    });

    const client = await this.clientService.findClient(user.id);

    return {
      client: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: client.name,
        role: user.role,
        isEmailConfirmed: client.isEmailConfirmed,
        isNumberConfirmed: client.isNumberConfirmed,
      },
      tokens: tokens,
    };
  }

  async courierRegistration(
    courierDto: CourierRegisterDto,
    documentImages: Express.Multer.File[],
  ): Promise<ITokens> {
    const { phoneNumber, password, email } = courierDto;

    const candidateByEmail = await this.userService.findUser(
      'email',
      email,
      UserRolesEnum.COURIER,
    );

    const candidateByPhone = await this.userService.findUser(
      'phoneNumber',
      phoneNumber,
      UserRolesEnum.COURIER,
    );

    if (candidateByEmail || candidateByPhone) {
      throw new ConflictException(Messages.USER_ALREADY_EXISTS);
    }

    const hashPass = await bcrypt.hash(password, PASSWORD_SALT);

    const user = await this.userService.create({
      phoneNumber,
      email,
      hashPass,
      role: UserRolesEnum.COURIER,
    });

    const documentLink = await this.filesService.saveDocuments(documentImages);
    const birthDate = new Date(courierDto.birthDate);
    const courier = await this.courierService.createCourier(
      {
        ...courierDto,
        birthDate,
        documentLink,
      },
      user.id,
    );

    const tokens = this.tokenService.generateTokens({
      id: user.id,
      role: UserRolesEnum.COURIER,
    });
    this.telegramNotifyService.newCourier(user, courier);
    return tokens;
  }

  async courierLogin(loginCourierDto: CourierLoginDto): Promise<ITokens> {
    const { phoneNumber, password } = loginCourierDto;

    const courier = await this.userService.findUser(
      'phoneNumber',
      phoneNumber,
      UserRolesEnum.COURIER,
      true,
    );

    if (!courier) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS);
    }

    let isPasswordValid;
    if ('hashPass' in courier) {
      isPasswordValid = await bcrypt.compare(password, courier.hashPass);
    } else {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS);
    }

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

  async existCourierCandidate(existCourierDto: ExistCandidateDto) {
    const phoneNumberCandidate = await this.userService.findUser(
      'phoneNumber',
      existCourierDto.phoneNumber,
      UserRolesEnum.COURIER,
    );

    const emailCandidate = await this.userService.findUser(
      'email',
      existCourierDto.email,
      UserRolesEnum.COURIER,
    );

    if (phoneNumberCandidate || emailCandidate) {
      throw new ConflictException(Messages.USER_ALREADY_EXISTS);
    }

    return false;
  }

  async isCourierApproved(user: JwtUser) {
    const courier = await this.courierService.findCourier(user.id);
    return courier.isApproved;
  }
}
