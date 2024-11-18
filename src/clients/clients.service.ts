import { Inject, Injectable } from '@nestjs/common';
import { CLIENTS_REPOSITORY } from '@/constants/sequelize';
import { Client } from './clients.model';
import { ClientEditInfo } from './dtos/clients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(CLIENTS_REPOSITORY) private clientsRepository: typeof Client,
  ) {}

  async findByEmail(email: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: {
        email: email,
      },
    });
    return client;
  }

  async findById(id: number): Promise<Client> {
    const client = await this.clientsRepository.findByPk(id);
    return client;
  }

  async create(email: string, hashPass: string): Promise<Client | null> {
    const client = await this.clientsRepository.create({ email, hashPass });
    return client || null;
  }

  async editClientInfo(id: number, newInfo: ClientEditInfo) {
    const client = await this.clientsRepository.findByPk(id);
    client.name = newInfo.name;
    client.email = newInfo.email;
    client.phoneNumber = newInfo.phoneNumber;
    client.save();
    return client;
  }
}
