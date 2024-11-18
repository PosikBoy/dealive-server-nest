import { COURIERS_REPOSITORY } from '@/constants/sequelize';
import { Inject, Injectable } from '@nestjs/common';
import { Courier } from './couriers.model';
import { CourierCreateDto } from './dtos/create-courier.dto';
import { Op } from 'sequelize';

@Injectable()
export class CouriersService {
  constructor(
    @Inject(COURIERS_REPOSITORY) private courierRepository: typeof Courier,
  ) {}

  async findCourierByPhone(phoneNumber: string): Promise<Courier> {
    const courier = await this.courierRepository.findOne({
      where: { phoneNumber: phoneNumber },
    });
    return courier;
  }

  async findCourierByEmail(email: string): Promise<Courier> {
    const courier = await this.courierRepository.findOne({
      where: { email },
    });
    return courier;
  }

  async findCourierByEmailOrPhone(
    email: string,
    phoneNumber: string,
  ): Promise<Courier> {
    const courier = await this.courierRepository.findOne({
      where: {
        [Op.or]: [
          {
            phoneNumber,
          },
          { email },
        ],
      },
    });
    return courier;
  }

  async findCourierById(id: number): Promise<Courier> {
    const courier = await this.courierRepository.findOne({ where: { id } });
    return courier;
  }

  async createCourier(courierDto: CourierCreateDto): Promise<Courier> {
    try {
      const courier = await this.courierRepository.create(courierDto);

      return courier;
    } catch (error) {
      console.log(error);
    }
  }
}
