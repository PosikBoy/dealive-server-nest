import { Body, Controller, Post } from '@nestjs/common';
import { GeodataService } from './geodata.service';

@Controller('geodata')
export class GeodataController {
  constructor(private readonly geodataService: GeodataService) {}

  @Post()
  async getGeodata(@Body() body) {
    return await this.geodataService.getAddresses(body);
  }
}
