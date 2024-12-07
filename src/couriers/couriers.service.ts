import { CourierWithoutSensitiveInfo } from './../auth/dtos/courier-without-sensitive-info';
import { COURIERS_REPOSITORY } from '@/constants/sequelize';
import { Inject, Injectable } from '@nestjs/common';
import { Courier } from './couriers.model';
import { CourierCreateDto } from './dtos/create-courier.dto';

@Injectable()
export class CouriersService {
  constructor(
    @Inject(COURIERS_REPOSITORY) private courierRepository: typeof Courier,
  ) {}

  async findCourier(
    field: 'email' | 'phoneNumber' | 'id',
    data: string | number,
    includeSensitiveInfo: boolean = false,
  ): Promise<Courier | CourierWithoutSensitiveInfo | null> {
    let whereCondition: any;

    if (field === 'id') {
      whereCondition = { id: data };
    } else if (field === 'email') {
      whereCondition = { email: data };
    } else if (field === 'phoneNumber') {
      whereCondition = { phoneNumber: data };
    }

    const courier = await this.courierRepository.findOne({
      where: whereCondition,
    });

    if (!courier) {
      return null;
    }

    if (includeSensitiveInfo) {
      return courier;
    }

    return new CourierWithoutSensitiveInfo(courier);
  }

  async createCourier(
    courierDto: CourierCreateDto,
  ): Promise<CourierWithoutSensitiveInfo> {
    try {
      const courier = await this.courierRepository.create(courierDto);
      const courierWithoutSensitiveInfo = new CourierWithoutSensitiveInfo(
        courier,
      );
      return courierWithoutSensitiveInfo;
    } catch (error) {
      console.log(error);
    }
  }
}
