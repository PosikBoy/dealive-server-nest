import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GeodataService } from './geodata.service';

@Module({
  imports: [HttpModule],
  providers: [GeodataService],
  exports: [GeodataService],
})
export class GeodataModule {}
