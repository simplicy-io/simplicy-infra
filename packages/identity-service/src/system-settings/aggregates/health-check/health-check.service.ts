import { HealthIndicatorFunction } from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { DatabaseHealthIndicatorService } from '../database-health-indicator/database-health-indicator.service';

@Injectable()
export class HealthCheckAggregateService {
  constructor(private readonly database: DatabaseHealthIndicatorService) {}

  createTerminusOptions(): HealthIndicatorFunction[] {
    const healthEndpoint: HealthIndicatorFunction[] = [
      async () => this.database.isHealthy(),
    ];

    return healthEndpoint;
  }
}
