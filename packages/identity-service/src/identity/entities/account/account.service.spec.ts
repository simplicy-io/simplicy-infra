import { Test, TestingModule } from '@nestjs/testing';
import { ACCOUNT } from './account.schema';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: ACCOUNT,
          useValue: {}, // use mock values
        },
      ],
    }).compile();
    service = module.get<AccountService>(AccountService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
