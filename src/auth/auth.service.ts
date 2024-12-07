import { ClientsService } from '@/clients/clients.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ClientAuthDto,
  CourierRegisterDto,
  CourierLoginDto,
  ExistCandidateDto,
} from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { TokensService } from '@/tokens/tokens.service';
import { CouriersService } from '@/couriers/couriers.service';
import { FilesService } from '@/files/files.service';
import { Messages } from '@/constants/messages';
import { PASSWORD_SALT } from '@/constants/auth';
import { ClientWithoutSensitiveInfo } from './dtos/client-without-sensitive-info';
import { JwtUser } from '@/types/jwt';

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
      throw new BadRequestException(Messages.FILL_ALL_FIELDS);
    }

    const candidate = await this.clientService.findClient('email', email, true);
    if (candidate) {
      throw new ConflictException(Messages.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT);

    const client = await this.clientService.create(email, hashedPassword);

    const tokens = await this.tokenService.generateTokens({
      id: client.id,
      role: 'client',
    });

    return { client, tokens: tokens };
  }

  async clientLogin(authDto: ClientAuthDto): Promise<IAuthClientResponse> {
    const { email, password } = authDto;

    if (!email || !password) {
      throw new BadRequestException(Messages.FILL_ALL_FIELDS);
    }

    let client = await this.clientService.findClient('email', email, true);

    if (!client) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS);
    }

    let isPasswordValid = false;
    if ('hashPass' in client) {
      isPasswordValid = await bcrypt.compare(password, client.hashPass);
    }
    if (!isPasswordValid) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS);
    }

    const tokens = await this.tokenService.generateTokens({
      id: client.id,
      role: 'client',
    });
    client = await this.clientService.findClient('email', email);

    return { client, tokens: tokens };
  }

  async courierRegistration(
    courierDto: CourierRegisterDto,
    documentImages: Express.Multer.File[],
  ): Promise<ITokens> {
    const { phoneNumber, password, email } = courierDto;

    const candidateByEmail = await this.courierService.findCourier(
      'email',
      email,
    );

    const candidateByPhone = await this.courierService.findCourier(
      'phoneNumber',
      phoneNumber,
    );

    if (candidateByEmail || candidateByPhone) {
      throw new ConflictException(Messages.USER_ALREADY_EXISTS);
    }

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

    const courier = await this.courierService.findCourier(
      'phoneNumber',
      phoneNumber,
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
    const phoneNumberCandidate = await this.courierService.findCourier(
      'phoneNumber',
      existCourierDto.phoneNumber,
    );

    const emailCandidate = await this.courierService.findCourier(
      'email',
      existCourierDto.email,
    );

    if (phoneNumberCandidate || emailCandidate) {
      throw new ConflictException(Messages.USER_ALREADY_EXISTS);
    }

    return false;
  }

  async isCourierApproved(user: JwtUser) {
    const courier = await this.courierService.findCourier('id', user.id, true);
    return courier.isApproved;
  }
}
