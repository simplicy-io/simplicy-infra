import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';
import { TOKEN_CACHE, TokenCache } from './token-cache/token-cache.schema';
import { TokenCacheService } from './token-cache/token-cache.service';

export const AuthEntities: Provider[] = [
  {
    provide: TOKEN_CACHE,
    useFactory: (connection: Connection) =>
      connection.model(TOKEN_CACHE, TokenCache),
    inject: [MONGOOSE_CONNECTION],
  },
];

export const AuthEntityServices: Provider[] = [TokenCacheService];
