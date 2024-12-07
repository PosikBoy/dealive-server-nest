import { Body, Controller, Get, Post } from '@nestjs/common';
import { SuggestionService } from './suggestions.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('suggestions')
@Controller('suggestions')
export class SuggestionsController {
  constructor(private suggestionService: SuggestionService) {}

  @ApiResponse({ status: 200 })
  @Post()
  async getSuggestion(@Body() body) {
    return await this.suggestionService.getSuggestion(body.query);
  }
}
