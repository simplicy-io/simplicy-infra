import { Connection } from 'mongoose';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';
import { Account, ACCOUNT } from './account/account.schema';
import { AccountService } from './account/account.service';

export const IdentityModuleEntities = [
  {
    provide: ACCOUNT,
    useFactory: (connection: Connection) => connection.model(ACCOUNT, Account),
    inject: [MONGOOSE_CONNECTION],
  },
  AccountService,
];
