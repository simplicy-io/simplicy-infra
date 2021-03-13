import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';
import { BunqSession, BUNQ_SESSION } from './bunq-session/bunq-session.schema';
import { BunqSessionService } from './bunq-session/bunq-session.service';
import { BunqState, BUNQ_STATE } from './bunq-state/bunq-state.schema';
import { BunqStateService } from './bunq-state/bunq-state.service';

export const TopupEntities: Provider[] = [
  {
    provide: BUNQ_SESSION,
    useFactory: (connection: Connection) =>
      connection.model(BUNQ_SESSION, BunqSession),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: BUNQ_STATE,
    useFactory: (connection: Connection) =>
      connection.model(BUNQ_STATE, BunqState),
    inject: [MONGOOSE_CONNECTION],
  },
];

export const TopupEntityServices: Provider[] = [
  BunqSessionService,
  BunqStateService,
];
