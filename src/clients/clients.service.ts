import { ClientWithoutSensitiveInfo } from './../auth/dtos/client-without-sensitive-info';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CLIENTS_REPOSITORY } from '@/constants/sequelize';
import { Client } from './clients.model';
import { ClientEditInfoDto } from './dtos/clients.dto';
import { Messages } from '@/constants/messages';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(CLIENTS_REPOSITORY) private clientsRepository: typeof Client,
  ) {}

  async findClient(
    field: 'email' | 'phoneNumber' | 'id',
    data: string | number,
    includeSensitiveInfo: boolean = false,
  ): Promise<Client | ClientWithoutSensitiveInfo | null> {
    let whereCondition: any;

    if (field === 'id') {
      whereCondition = { id: data };
    } else if (field === 'email') {
      whereCondition = { email: data };
    } else if (field === 'phoneNumber') {
      whereCondition = { phoneNumber: data };
    }

    const client = await this.clientsRepository.findOne({
      where: whereCondition,
    });

    if (!client) {
      return null;
    }

    if (includeSensitiveInfo) {
      return client;
    }

    return new ClientWithoutSensitiveInfo(client);
  }

  async create(
    email: string,
    hashPass: string,
  ): Promise<ClientWithoutSensitiveInfo | null> {
    const client = await this.clientsRepository.create({ email, hashPass });
    return new ClientWithoutSensitiveInfo(client) || null;
  }

  async editClientInfo(
    id: number,
    newInfo: ClientEditInfoDto,
  ): Promise<ClientWithoutSensitiveInfo> {
    const candidateByPhone = await this.clientsRepository.findOne({
      where: { phoneNumber: newInfo.phoneNumber },
    });
    const candidateByEmail = await this.clientsRepository.findOne({
      where: { email: newInfo.email },
    });
    console.log(
      'candidateByPhone, candidateByEmail',
      !candidateByPhone,
      !candidateByEmail,
    );
    if (
      (candidateByPhone && candidateByPhone?.id !== id) ||
      (candidateByEmail && candidateByEmail?.id !== id)
    ) {
      throw new ConflictException(Messages.USER_ALREADY_EXISTS);
    }
    const client = await this.clientsRepository.findByPk(id);
    client.name = newInfo.name;
    client.email = newInfo.email;
    client.phoneNumber = newInfo.phoneNumber;
    client.save();

    //Чистим лишние данные
    const clientWithoutSensitiveInfo = new ClientWithoutSensitiveInfo(client);
    return clientWithoutSensitiveInfo;
  }
}
