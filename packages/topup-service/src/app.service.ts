import { Injectable } from '@nestjs/common';
import { SERVICE } from './constants/app-strings';
import { PLEASE_RUN_SETUP } from './constants/messages';
import { ServerSettingsService } from './system-settings/entities/server-settings/server-settings.service';

@Injectable()
export class AppService {
  constructor(private readonly settings: ServerSettingsService) {}

  getRoot() {
    return { service: SERVICE };
  }

  async getInfo() {
    const settings = await this.settings.find();
    const info = settings?.toJSON();

    if (info) {
      // Delete secrets
      info.clientSecret = undefined;
      info._id = undefined;
      info.id = undefined;
      return info;
    }

    return { message: PLEASE_RUN_SETUP };
  }
}
