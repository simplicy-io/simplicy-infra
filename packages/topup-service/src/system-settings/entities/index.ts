import { Connection } from 'mongoose';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';
import {
  ServerSettings,
  SERVER_SETTINGS,
} from './server-settings/server-settings.schema';

export const ServerSettingsEntities = [
  {
    provide: SERVER_SETTINGS,
    useFactory: (connection: Connection) =>
      connection.model(SERVER_SETTINGS, ServerSettings),
    inject: [MONGOOSE_CONNECTION],
  },
];
