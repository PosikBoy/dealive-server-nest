import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigModule } from '@nestjs/config';
import { CouriersModule } from './couriers/couriers.module';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { TokensModule } from './tokens/tokens.module';
import { SuggestionModule } from './suggestions/suggestions.module';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    CouriersModule,
    OrdersModule,
    AddressesModule,
    ClientsModule,
    AuthModule,
    FilesModule,
    TokensModule,
    SuggestionModule,
  ],
})
export class AppModule {}
