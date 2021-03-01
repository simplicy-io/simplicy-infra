import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { IdentityModule } from './identity/identity.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    CommonModule,
    AuthModule,
    IdentityModule,
    SystemSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
