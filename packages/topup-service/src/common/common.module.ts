import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { eventsClient } from './events-microservice.client';
import { CommonCommandHandlers } from './commands';
import { CommonSagas } from './sagas';
import { StripeServiceService } from './service/stripe-service/stripe-service.service';

@Global()
@Module({
  imports: [ClientsModule.registerAsync([eventsClient])],
  providers: [...CommonCommandHandlers, ...CommonSagas, StripeServiceService],
  exports: [ClientsModule.registerAsync([eventsClient]), StripeServiceService],
})
export class CommonModule {}
