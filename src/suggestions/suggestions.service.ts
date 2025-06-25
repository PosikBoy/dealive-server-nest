import { Urls } from '@/common/constants/urls';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SuggestionService {
  constructor(private readonly httpService: HttpService) {}

  async getSuggestion(address: string) {
    try {
      const result = await firstValueFrom(
        this.httpService.post<any>(
          Urls.SUGGESTIONS_DADATA,
          {
            query: address,
            count: 5,
            locations_boost: [{ kladr_id: 77 }, { kladr_id: 50 }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Token ' + process.env.DADATA_KEY,
            },
          },
        ),
      );
      const suggestions = result.data.suggestions.map((suggestion: any) => {
        return {
          value: suggestion.value,
        };
      });

      return suggestions;
    } catch (error) {
      console.log(error.response.data);
    }
  }
}
