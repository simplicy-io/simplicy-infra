import { Test, TestingModule } from '@nestjs/testing';
import { BunqStorage } from '../../../topup/aggregates/topup/bunq-storage/bunq-storage';
import { ConfigService } from '../../../config/config.service';
import { BunqService } from './bunq.service';

describe('BunqService', () => {
  let service: BunqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BunqService,
        { provide: ConfigService, useValue: {} },
        { provide: BunqStorage, useValue: {} },
      ],
    }).compile();

    service = module.get<BunqService>(BunqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
