import { ClientWithoutSensitiveInfo } from './../auth/dtos/client-without-sensitive-info';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CLIENTS_REPOSITORY } from '@/constants/sequelize';
import { Client } from './clients.model';
import { ClientEditInfoDto } from './dtos/clients.dto';
import { Messages } from '@/constants/messages';
import { UserService } from '@/users/user.service';
import { UserRolesEnum } from '@/users/user.model';
import { UserWithoutSensitiveInfoDto } from '@/users/dtos/user-without-sensitive-info.dto';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(CLIENTS_REPOSITORY) private clientsRepository: typeof Client,
    private userService: UserService,
  ) {}

  async findClient(userId): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: {
        userId,
      },
    });

    return client.dataValues;
  }

  async create(userId): Promise<ClientWithoutSensitiveInfo | null> {
    const client = await this.clientsRepository.create({ userId });

    return client.dataValues;
  }

  async editClientInfo(
    id: number,
    newInfo: ClientEditInfoDto,
  ): Promise<ClientWithoutSensitiveInfo> {
    const candidateByPhone = await this.userService.findUser(
      'phoneNumber',
      newInfo.phoneNumber,
      UserRolesEnum.CLIENT,
      false,
    );
    const candidateByEmail = await this.userService.findUser(
      'email',
      newInfo.email,
      UserRolesEnum.CLIENT,
      false,
    );
    console.log(id, candidateByPhone, candidateByEmail);
    if (
      (candidateByPhone && candidateByPhone?.id !== id) ||
      (candidateByEmail && candidateByEmail?.id !== id)
    ) {
      throw new ConflictException(Messages.USER_ALREADY_EXISTS);
    }

    const client = await this.clientsRepository.findByPk(id);
    console.log(newInfo);
    client.name = newInfo.name;
    await client.save();

    const editUserDto = {
      phoneNumber: newInfo.phoneNumber,
      email: newInfo.email,
      id,
    };

    const user = await this.userService.editUser(
      editUserDto,
      UserRolesEnum.CLIENT,
    );

    const userWithoutSensitiveInfo = new UserWithoutSensitiveInfoDto(user);
    console.log(client.dataValues, userWithoutSensitiveInfo);
    return { ...client.dataValues, ...userWithoutSensitiveInfo };
  }
}
