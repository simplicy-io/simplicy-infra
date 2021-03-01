import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { SERVICE } from '../src/constants/app-strings';
import { ConfigService } from '../src/config/config.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', done => {
    return request(app.getHttpServer())
      .get('/')
      .expect({ service: SERVICE })
      .end(done);
  });

  afterAll(async () => {
    await app.close();
  });
});
