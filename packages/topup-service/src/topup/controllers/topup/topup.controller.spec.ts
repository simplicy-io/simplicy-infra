import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ConfigService } from '../../../config/config.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TopupService } from '../../aggregates/topup/topup.service';
import { TopupController } from './topup.controller';

describe('TopupController', () => {
  let controller: TopupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopupController],
      providers: [
        {
          provide: TopupService,
          useValue: {},
        },
        { provide: ServerSettingsService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    controller = module.get<TopupController>(TopupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
