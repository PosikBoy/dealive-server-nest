import { Body, Controller, Post } from "@nestjs/common";
import { GetPriceDto } from "./dtos/get-price-dto";
import { PriceService } from "./price.service";

@Controller("price")
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Post()
  async getPrice(@Body() getPriceDto: GetPriceDto) {
    return await this.priceService.getPrice(getPriceDto);
  }
}
