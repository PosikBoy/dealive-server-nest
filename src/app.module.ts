import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigModule } from '@nestjs/config';
import { CouriersModule } from './couriers/couriers.module';
import { UsersController } from './users/users.controller';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  controllers: [],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    CouriersModule,
    OrdersModule,
    AddressesModule,
  ],
})
export class AppModule {}
