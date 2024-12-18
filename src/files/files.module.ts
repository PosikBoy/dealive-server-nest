import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TokensModule } from '@/tokens/tokens.module';
import { filesProviders } from './files.providers';

@Module({
  imports: [TokensModule],
  providers: [FilesService, ...filesProviders],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
