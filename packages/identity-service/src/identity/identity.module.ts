import { HttpModule, Module } from '@nestjs/common';
import { AccountController } from './controllers/account/account.controller';
import { AccountAggregateService } from './aggregates/account-aggregate/account-aggregate.service';
import { IdentityModuleEntities } from './entities';

@Module({
  imports: [HttpModule],
  controllers: [AccountController],
  providers: [AccountAggregateService, ...IdentityModuleEntities],
  exports: [...IdentityModuleEntities],
})
export class IdentityModule {}
