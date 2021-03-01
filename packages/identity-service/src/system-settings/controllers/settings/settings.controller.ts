import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Body,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  RazorPaySettingsDto,
  ServerSettingsDto,
} from '../../../system-settings/entities/server-settings/server-setting.dto';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SettingsService } from './settings.service';
import { ADMINISTRATOR } from '../../../common/app-constants';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('v1/get')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async getSettings() {
    return await this.settingsService.find();
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateSettings(@Body() payload: ServerSettingsDto) {
    return from(this.settingsService.find()).pipe(
      switchMap(settings => {
        return this.settingsService.update({ uuid: settings.uuid }, payload);
      }),
    );
  }

  @Post('v1/update_razorpay_settings')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateRazorPaySettings(@Body() payload: RazorPaySettingsDto) {
    if (!Object.keys(payload).length) {
      throw new BadRequestException('Body cannot be empty');
    }
    return this.settingsService.updateRazorPaySettings(payload);
  }

  @Post('v1/clear_token_cache')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async clearTokenCache() {
    return await this.settingsService.clearTokenCache();
  }
}
