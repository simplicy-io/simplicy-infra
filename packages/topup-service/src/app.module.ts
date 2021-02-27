import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TopupService } from './topup/aggregates/topup/topup.service';
import { TopupController } from './topup/controllers/topup/topup.controller';
import { TopupModule } from './topup/topup.module';

@Module({
  imports: [HttpModule, ConfigModule, CommonModule, AuthModule, TopupModule],
  controllers: [AppController, TopupController],
  providers: [AppService, TopupService],
})
export class AppModule {}
