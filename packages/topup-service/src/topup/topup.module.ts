import { HttpModule, Module } from '@nestjs/common';
import { TopupService } from './aggregates/topup/topup.service';
import { TopupController } from './controllers/topup/topup.controller';
import { TopupEntitiesModule } from './entities/topup-entities.module';

@Module({
  imports: [HttpModule, TopupEntitiesModule],
  providers: [TopupService],
  controllers: [TopupController],
  exports: [TopupEntitiesModule],
})
export class TopupModule {}
