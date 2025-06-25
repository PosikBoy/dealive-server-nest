import { GeodataService } from '@/geodata/geodata.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PriceService {
  constructor(@Inject() private readonly geodataService: GeodataService) {}
  async getPrice(getPriceDto) {}
}
