import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SuggestionService } from './suggestions.service';

@Module({
  imports: [HttpModule], // Импортируем HttpModule
  providers: [SuggestionService],
})
export class MyModule {}
