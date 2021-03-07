import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { eventsClient } from './events-microservice.client';
import { CommonCommandHandlers } from './commands';
import { CommonSagas } from './sagas';
import { BunqService } from './service/bunq/bunq.service';
import { DatabaseProviders } from './database.provider';
import { TopupEntitiesModule } from '../topup/entities/topup-entities.module';
import { BunqStorage } from '../topup/aggregates/topup/bunq-storage/bunq-storage';

@Global()
@Module({
  imports: [ClientsModule.registerAsync([eventsClient]), TopupEntitiesModule],
  providers: [
    BunqService,
    BunqStorage,
    ...CommonCommandHandlers,
    ...CommonSagas,
    ...DatabaseProviders,
  ],
  exports: [
    ClientsModule.registerAsync([eventsClient]),
    BunqService,
    BunqStorage,
    ...DatabaseProviders,
  ],
})
export class CommonModule {}
