import { Injectable } from '@nestjs/common';
import { AccountService } from '../../../identity/entities/account/account.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

@Injectable()
export class ConnectService {
  constructor(
    private readonly tokenCacheService: TokenCacheService,
    private readonly settings: ServerSettingsService,
    private readonly account: AccountService,
  ) {}

  async tokenDelete(accessToken: string) {
    await this.checkAndClearSettings(accessToken);
    await this.tokenCacheService.deleteMany({ accessToken });
  }

  async deleteProfile(uuid: string) {
    return await this.account.delete({ uuid });
  }

  async checkAndClearSettings(accessToken: string) {
    const settings = await this.settings.find();
    const token = await this.tokenCacheService.findOne({ accessToken });
    if (token && token.uuid === settings.clientTokenUuid) {
      settings.clientTokenUuid = undefined;
      await settings.save();
    }

    if (token) await token.remove();
  }
}
