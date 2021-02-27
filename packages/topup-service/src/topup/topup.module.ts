import { HttpModule, Module } from '@nestjs/common';
import { TopupService } from './aggregates/topup/topup.service';
import { TopupController } from './controllers/topup/topup.controller';

@Module({
  imports: [HttpModule],
  providers: [TopupService],
  controllers: [TopupController],
})
export class TopupModule {}
