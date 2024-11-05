import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';

@Module({
  providers: [AddressesService],
})
export class AddressesModule {}
