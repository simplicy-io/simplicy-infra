import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BunqService } from '../../../common/service/bunq/bunq.service';
import { ConfigService } from '../../../config/config.service';
import { TopupService } from './topup.service';

describe('TopupService', () => {
  let service: TopupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        TopupService,
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: BunqService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TopupService>(TopupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
