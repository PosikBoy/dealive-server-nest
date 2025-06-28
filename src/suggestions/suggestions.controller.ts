import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetSuggestionsDto } from "./dtos/get-suggestions.dto";
import { SuggestionService } from "./suggestions.service";

@ApiTags("suggestions")
@Controller("suggestions")
export class SuggestionsController {
  constructor(private suggestionService: SuggestionService) {}

  @ApiResponse({ status: 200 })
  @Post()
  async getSuggestion(@Body() body: GetSuggestionsDto) {
    return await this.suggestionService.getSuggestion(body.query);
  }
}
