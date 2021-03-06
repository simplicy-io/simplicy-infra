import { Test, TestingModule } from '@nestjs/testing';
import { ConnectService } from './connect.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { AccountService } from '../../../identity/entities/account/account.service';

describe('ConnectService', () => {
  let service: ConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectService,
        { provide: TokenCacheService, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
        { provide: AccountService, useValue: {} },
      ],
    }).compile();

    service = module.get<ConnectService>(ConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
