import { Module } from '@nestjs/common';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { ServerSettingsEntities } from '.';

@Module({
  providers: [...ServerSettingsEntities, ServerSettingsService],
  exports: [ServerSettingsService],
})
export class SystemSettingsEntitiesModule {}
