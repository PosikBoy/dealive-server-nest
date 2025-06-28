import { Urls } from "@/common/constants/urls";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { AxiosError, AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import {
  DaDataRequest,
  DaDataResponse,
  DaDataSuggestion,
  SuggestionResult,
} from "./suggestions.types";

@Injectable()
export class SuggestionService {
  private readonly logger = new Logger(SuggestionService.name);

  constructor(private readonly httpService: HttpService) {}

  async getSuggestion(address: string): Promise<SuggestionResult[]> {
    try {
      const requestPayload: DaDataRequest = {
        query: address,
        count: 5,
        locations_boost: [{ kladr_id: 77 }, { kladr_id: 50 }],
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${process.env.DADATA_KEY}`,
      };

      const response: AxiosResponse<DaDataResponse> = await firstValueFrom(
        this.httpService.post<DaDataResponse>(
          Urls.SUGGESTIONS_DADATA,
          requestPayload,
          { headers }
        )
      );

      const suggestions: SuggestionResult[] = response.data.suggestions.map(
        (suggestion: DaDataSuggestion) => ({
          value: suggestion.value,
        })
      );

      return suggestions;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        "DaData API error",
        axiosError.response?.data || axiosError.message
      );
      throw new Error("Failed to get address suggestions");
    }
  }
}
