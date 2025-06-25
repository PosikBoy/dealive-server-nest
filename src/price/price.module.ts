import { GeodataModule } from '@/geodata/geodata.module';
import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({
  controllers: [PriceController],
  imports: [GeodataModule],
  providers: [PriceService],
})
export class PriceModule {}
