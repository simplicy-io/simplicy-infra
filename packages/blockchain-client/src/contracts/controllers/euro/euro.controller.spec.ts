import { Test, TestingModule } from '@nestjs/testing';
import { EuroService } from '../../../contracts/aggregates/euro/euro.service';
import { EuroController } from './euro.controller';

describe('EuroController', () => {
  let controller: EuroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EuroController],
      providers: [{ provide: EuroService, useValue: {} }],
    }).compile();

    controller = module.get<EuroController>(EuroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
