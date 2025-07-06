import { Urls } from "@/common/constants/urls";
import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { GeodataResponse } from "./types/geodata-response";

@Injectable()
export class GeodataService {
  constructor(private readonly httpService: HttpService) {}

  async getAddresses(
    addresses: { address: string }[]
  ): Promise<GeodataResponse> {
    try {
      const result = await firstValueFrom(
        this.httpService.post<GeodataResponse>(Urls.GEODATA(), { addresses })
      );

      const geodata = result.data;
      return geodata;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error.response.data.message);
    }
  }
}
