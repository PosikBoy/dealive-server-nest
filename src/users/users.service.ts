import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '@/constants/constants';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_REPOSITORY) private usersRepository: typeof User) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findByPk(id);
    return user;
  }

  async findByToken(accessToken: string) {}

  async create(email: string, hashPass: string): Promise<User | null> {
    const user = await this.usersRepository.create({ email, hashPass });
    return user || null;
  }
}
