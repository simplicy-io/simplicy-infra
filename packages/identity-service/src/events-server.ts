import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { eventsConnectionFactory } from './common/events-microservice.client';
import {
  ConfigService,
  EVENTS_HOST,
  EVENTS_PORT,
} from './config/config.service';

const LISTENING_TO_EVENTS = 'Listening to events using MQTT';

export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 10;

export function setupEvents(app: INestApplication) {
  const config = app.get<ConfigService>(ConfigService);
  if (config.get(EVENTS_HOST) && config.get(EVENTS_PORT)) {
    const events = app.connectMicroservice<MicroserviceOptions>(
      eventsConnectionFactory(config),
    );
    events.listen(() =>
      Logger.log(LISTENING_TO_EVENTS, events.constructor.name),
    );
  }
}
