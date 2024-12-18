import { CourierWithoutSensitiveInfo } from './../auth/dtos/courier-without-sensitive-info';
import { COURIERS_REPOSITORY } from '@/constants/sequelize';
import { Inject, Injectable } from '@nestjs/common';
import { Courier } from './couriers.model';
import { CourierCreateDto } from './dtos/create-courier.dto';
import { UserService } from '@/users/user.service';
import { User, UserRolesEnum } from '@/users/user.model';

@Injectable()
export class CouriersService {
  constructor(
    @Inject(COURIERS_REPOSITORY) private courierRepository: typeof Courier,
  ) {}

  async findCourier(
    userId: number,
    includeSensitiveInfo: boolean = false,
  ): Promise<Courier | CourierWithoutSensitiveInfo | null> {
    const courier = await this.courierRepository.findOne({
      where: {
        userId,
      },
    });

    if (!courier) {
      return null;
    }

    if (includeSensitiveInfo) {
      return { ...courier.dataValues };
    }

    return new CourierWithoutSensitiveInfo(courier);
  }

  async createCourier(
    courierDto: CourierCreateDto,
    userId,
  ): Promise<CourierWithoutSensitiveInfo> {
    try {
      const courier = await this.courierRepository.create({
        userId,
        ...courierDto,
      });
      const courierWithoutSensitiveInfo = new CourierWithoutSensitiveInfo(
        courier,
      );

      return courierWithoutSensitiveInfo;
    } catch (error) {
      console.log(error);
    }
  }
}
