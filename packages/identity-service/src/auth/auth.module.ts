import { Module, Global, HttpModule } from '@nestjs/common';
import { RoleGuard } from './guards/role.guard';
import { AuthSchedulers } from './schedulers';
import { AuthControllers } from './controllers';
import { AuthAggregates } from './aggregates';
import { AuthEntitiesModule } from './entities/auth-entities.module';

@Global()
@Module({
  imports: [HttpModule, AuthEntitiesModule],
  providers: [RoleGuard, ...AuthSchedulers, ...AuthAggregates],
  exports: [RoleGuard, ...AuthAggregates, AuthEntitiesModule],
  controllers: [...AuthControllers],
})
export class AuthModule {}
