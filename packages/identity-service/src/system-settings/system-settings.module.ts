import { Module, Global, HttpModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { SystemSettingsEntitiesModule } from './entities/system-entities.module';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';
import { ConnectController } from './controllers/connect/connect.controller';
import { SettingsService } from './controllers/settings/settings.service';
import { SetupService } from './controllers/setup/setup.service';
import { ConnectService } from './controllers/connect/connect.service';
import { HealthCheckAggregateService } from './aggregates/health-check/health-check.service';
import { HealthController } from './controllers/health/health.controller';
import { DatabaseHealthIndicatorService } from './aggregates/database-health-indicator/database-health-indicator.service';
import { IdentityModule } from '../identity/identity.module';

@Global()
@Module({
  imports: [
    SystemSettingsEntitiesModule,
    HttpModule,
    CqrsModule,
    TerminusModule,
    IdentityModule,
  ],
  providers: [
    SettingsService,
    SetupService,
    ConnectService,
    HealthCheckAggregateService,
    DatabaseHealthIndicatorService,
  ],
  controllers: [
    SettingsController,
    SetupController,
    ConnectController,
    HealthController,
  ],
  exports: [
    SystemSettingsEntitiesModule,
    SettingsService,
    SetupService,
    ConnectService,
    HealthCheckAggregateService,
    DatabaseHealthIndicatorService,
  ],
})
export class SystemSettingsModule {}
