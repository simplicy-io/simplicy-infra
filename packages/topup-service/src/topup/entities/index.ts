import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';
import { BunqSession, BUNQ_SESSION } from './bunq-session/bunq-session.schema';
import { BunqSessionService } from './bunq-session/bunq-session.service';

export const TopupEntities: Provider[] = [
  {
    provide: BUNQ_SESSION,
    useFactory: (connection: Connection) =>
      connection.model(BUNQ_SESSION, BunqSession),
    inject: [MONGOOSE_CONNECTION],
  },
];

export const TopupEntityServices: Provider[] = [BunqSessionService];
