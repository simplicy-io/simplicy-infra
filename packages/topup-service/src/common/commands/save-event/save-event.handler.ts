import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { ClientMqtt } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SaveEventCommand } from './save-event.command';
import { BROADCAST_EVENT } from '../../events-microservice.client';
import { SERVICE } from '../../../constants/app-strings';
import {
  ConfigService,
  EVENTS_HOST,
  EVENTS_PASSWORD,
  EVENTS_PORT,
  EVENTS_PROTO,
  EVENTS_USER,
} from '../../../config/config.service';

@CommandHandler(SaveEventCommand)
export class SaveEventHandler implements ICommandHandler<SaveEventCommand> {
  constructor(
    @Inject(BROADCAST_EVENT)
    private readonly publisher: ClientMqtt,
    private readonly config: ConfigService,
  ) {}

  async execute(command: SaveEventCommand) {
    const { event } = command;
    const eventsHost = this.config.get(EVENTS_HOST);
    const eventsPort = this.config.get(EVENTS_PORT);
    const eventsProto = this.config.get(EVENTS_PROTO);
    const eventsUser = this.config.get(EVENTS_USER);
    const eventsPassword = this.config.get(EVENTS_PASSWORD);

    if (
      eventsHost &&
      eventsPort &&
      eventsProto &&
      eventsUser &&
      eventsPassword
    ) {
      const payload = {
        eventId: uuidv4(),
        eventName: event.constructor.name,
        eventFromService: SERVICE,
        eventDateTime: new Date(),
        eventData: event,
      };
      this.publisher.emit(event.constructor.name, payload);
    }
  }
}
