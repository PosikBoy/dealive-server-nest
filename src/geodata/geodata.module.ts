import { Module } from '@nestjs/common';
import { GeodataService } from './geodata.service';
import { GeodataController } from './geodata.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GeodataService],
  controllers: [GeodataController],
  exports: [GeodataService],
})
export class GeodataModule {}
