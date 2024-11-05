import { COURIERS_REPOSITORY } from '@/constants/constants';
import { Inject, Injectable } from '@nestjs/common';
import { Courier } from './couriers.model';
import { CreateCourierDto } from './dtos/create-courier.dto';

@Injectable()
export class CouriersService {
  constructor(
    @Inject(COURIERS_REPOSITORY) private courierRepository: typeof Courier,
  ) {}

  async getCourierById(id: number) {
    const courier = await this.courierRepository.findOne({ where: { id } });
    return courier;
  }

  async createCourier(courierDto: CreateCourierDto) {
    const courier = await this.courierRepository.create(courierDto);
    return courier;
  }
}
