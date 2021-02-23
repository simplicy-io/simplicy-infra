import { Test, TestingModule } from '@nestjs/testing';
import { WEB3 } from '../../../common/web3js.provider';
import { ConfigService } from '../../../config/config.service';
import { EuroService } from './euro.service';

describe('EuroService', () => {
  let service: EuroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EuroService,
        { provide: ConfigService, useValue: {} },
        { provide: WEB3, useValue: {} },
      ],
    }).compile();

    service = module.get<EuroService>(EuroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
