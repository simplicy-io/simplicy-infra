import { Module, Global, HttpModule } from '@nestjs/common';
import { AuthServerVerificationGuard } from './guards/authserver-verification.guard';
import { RoleGuard } from './guards/role.guard';
import { AuthSchedulers } from './schedulers';
import { AuthControllers } from './controllers';
import { AuthAggregates } from './aggregates';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    AuthServerVerificationGuard,
    RoleGuard,

    ...AuthSchedulers,
    ...AuthAggregates,
  ],
  exports: [AuthServerVerificationGuard, RoleGuard, ...AuthAggregates],
  controllers: [...AuthControllers],
})
export class AuthModule {}
