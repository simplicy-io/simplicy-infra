import {
  ClientsProviderAsyncOptions,
  MqttOptions,
  Transport,
} from '@nestjs/microservices';
import {
  ConfigService,
  EVENTS_HOST,
  EVENTS_PORT,
  EVENTS_PASSWORD,
  EVENTS_PROTO,
  EVENTS_USER,
} from '../config/config.service';

export const BROADCAST_EVENT = 'BROADCAST_EVENT';

export const eventsConnectionFactory = (config: ConfigService): MqttOptions => {
  const url = `${config.get(EVENTS_PROTO)}://${config.get(
    EVENTS_USER,
  )}:${config.get(EVENTS_PASSWORD)}@${config.get(EVENTS_HOST)}:${config.get(
    EVENTS_PORT,
  )}`;

  return {
    transport: Transport.MQTT,
    options: { url },
  };
};

export const eventsClient: ClientsProviderAsyncOptions = {
  useFactory: eventsConnectionFactory,
  name: BROADCAST_EVENT,
  inject: [ConfigService],
};
