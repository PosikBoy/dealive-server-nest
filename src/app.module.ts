import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigModule } from '@nestjs/config';
import { CouriersModule } from './couriers/couriers.module';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    CouriersModule,
    OrdersModule,
    AddressesModule,
    UsersModule,
    AuthModule,
    FilesModule,
    TokensModule,
  ],
})
export class AppModule {}
