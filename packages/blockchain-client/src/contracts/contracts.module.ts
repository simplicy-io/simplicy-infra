import { Module } from '@nestjs/common';
import { EuroService } from './aggregates/euro/euro.service';
import { EuroController } from './controllers/euro/euro.controller';

@Module({
  providers: [EuroService],
  controllers: [EuroController],
})
export class ContractsModule {}
