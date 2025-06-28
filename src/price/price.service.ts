import { GeodataService } from "@/geodata/geodata.service";
import { Inject, Injectable } from "@nestjs/common";
import { GetPriceDto } from "./dtos/get-price-dto";

@Injectable()
export class PriceService {
  constructor(@Inject() private readonly geodataService: GeodataService) {}
  async getPrice(getPriceDto: GetPriceDto) {
    return getPriceDto.weight;
  }
}
