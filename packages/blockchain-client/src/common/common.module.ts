import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { eventsClient } from './events-microservice.client';
import { CommonCommandHandlers } from './commands';
import { CommonSagas } from './sagas';
import { Web3JSProvider } from './web3js.provider';

@Global()
@Module({
  imports: [ClientsModule.registerAsync([eventsClient])],
  providers: [...CommonCommandHandlers, ...CommonSagas, Web3JSProvider],
  exports: [ClientsModule.registerAsync([eventsClient]), Web3JSProvider],
})
export class CommonModule {}
