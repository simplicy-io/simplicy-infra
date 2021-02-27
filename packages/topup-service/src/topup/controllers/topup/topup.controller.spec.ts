import { Test, TestingModule } from '@nestjs/testing';
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
      ],
    }).compile();

    controller = module.get<TopupController>(TopupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
