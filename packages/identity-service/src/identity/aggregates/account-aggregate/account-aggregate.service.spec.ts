import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../../config/config.service';
import { AccountService } from '../../entities/account/account.service';
import { AccountAggregateService } from './account-aggregate.service';

describe('AccountAggregateService', () => {
  let service: AccountAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AccountAggregateService,
        { provide: AccountService, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<AccountAggregateService>(AccountAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
