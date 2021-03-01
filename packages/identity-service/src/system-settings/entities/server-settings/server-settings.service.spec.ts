import { Test, TestingModule } from '@nestjs/testing';
import { SERVER_SETTINGS } from './server-settings.schema';
import { ServerSettingsService } from './server-settings.service';

describe('ServerSettingsService', () => {
  let service: ServerSettingsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerSettingsService,
        {
          provide: SERVER_SETTINGS,
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<ServerSettingsService>(ServerSettingsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
