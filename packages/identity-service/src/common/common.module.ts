import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { eventsClient } from './events-microservice.client';
import { CommonCommandHandlers } from './commands';
import { CommonSagas } from './sagas';
import { DatabaseProviders } from './database.provider';

@Global()
@Module({
  imports: [ClientsModule.registerAsync([eventsClient])],
  providers: [...CommonCommandHandlers, ...CommonSagas, ...DatabaseProviders],
  exports: [ClientsModule.registerAsync([eventsClient]), ...DatabaseProviders],
})
export class CommonModule {}
