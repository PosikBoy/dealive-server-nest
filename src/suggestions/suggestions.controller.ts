import { Body, Controller, Get, Post } from '@nestjs/common';
import { SuggestionService } from './suggestions.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private suggestionService: SuggestionService) {}

  @Post()
  async getSuggestion(@Body() body) {
    return await this.suggestionService.getSuggestion(body.query);
  }
}
