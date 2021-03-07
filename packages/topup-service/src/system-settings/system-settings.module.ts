import { Module, Global, HttpModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { SystemSettingsEntitiesModule } from './entities/system-entities.module';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';
import { SettingsService } from './controllers/settings/settings.service';
import { SetupService } from './controllers/setup/setup.service';
import { HealthCheckAggregateService } from './aggregates/health-check/health-check.service';
import { HealthController } from './controllers/health/health.controller';
import { DatabaseHealthIndicatorService } from './aggregates/database-health-indicator/database-health-indicator.service';

@Global()
@Module({
  imports: [
    SystemSettingsEntitiesModule,
    HttpModule,
    CqrsModule,
    TerminusModule,
  ],
  providers: [
    SettingsService,
    SetupService,
    HealthCheckAggregateService,
    DatabaseHealthIndicatorService,
  ],
  controllers: [SettingsController, SetupController, HealthController],
  exports: [
    SystemSettingsEntitiesModule,
    SettingsService,
    SetupService,
    HealthCheckAggregateService,
    DatabaseHealthIndicatorService,
  ],
})
export class SystemSettingsModule {}
