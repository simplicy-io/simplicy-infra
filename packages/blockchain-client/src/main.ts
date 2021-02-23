import { NestFactory } from '@nestjs/core';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { GLOBAL_API_PREFIX } from './constants/app-strings';
import { setupEvents } from './events-server';

async function bootstrap() {
  const server = new ExpressAdapter(express());
  const app = await NestFactory.create(AppModule, server);
  app.enableCors();
  app.setGlobalPrefix(GLOBAL_API_PREFIX);
  setupSwagger(app);
  setupEvents(app);
  await app.listen(8000);
}
bootstrap();
