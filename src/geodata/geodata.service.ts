import { Address } from '@/addresses/addresses.model';
import { Urls } from '@/constants/urls';
import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeodataService {
  constructor(private readonly httpService: HttpService) {}

  async getAddresses(addresses: Address[]) {
    try {
      const result = await firstValueFrom(
        this.httpService.post<any>(Urls.GEODATA, addresses),
      );
      const geodata = result.data;
      return geodata;
    } catch (error) {
      throw new NotFoundException(error.response.data.message);
    }
  }
}
