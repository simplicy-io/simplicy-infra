import { Test, TestingModule } from '@nestjs/testing';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ConfigService } from '../../../config/config.service';
import { AccountAggregateService } from '../../aggregates/account-aggregate/account-aggregate.service';
import { AccountController } from './account.controller';
import { HttpModule } from '@nestjs/common';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AccountController],
      providers: [
        { provide: AccountAggregateService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
