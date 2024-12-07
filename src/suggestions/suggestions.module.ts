import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SuggestionService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';

@Module({
  imports: [HttpModule], // Импортируем HttpModule
  controllers: [SuggestionsController],
  providers: [SuggestionService],
})
export class SuggestionModule {}
