import { Injectable } from '@nestjs/common';
import { PLEASE_RUN_SETUP } from './constants/messages';
import { SERVICE } from './constants/app-strings';
import { SetupService } from './system-settings/controllers/setup/setup.service';

@Injectable()
export class AppService {
  constructor(private readonly info: SetupService) {}

  getRoot() {
    return { service: SERVICE };
  }

  async getInfo() {
    try {
      return await this.info.getInfo();
    } catch (error) {
      return {
        message: PLEASE_RUN_SETUP,
      };
    }
  }
}
