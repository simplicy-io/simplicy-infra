import { Provider } from '@nestjs/common';
import { ConfigService, RPC_URI } from '../config/config.service';

import Web3 from 'web3';

export const WEB3 = 'WEB3';

export const Web3JSProvider: Provider = {
  provide: WEB3,
  useFactory: (config: ConfigService) => {
    return new Web3(new Web3.providers.HttpProvider(config.get(RPC_URI)));
  },
  inject: [ConfigService],
};
