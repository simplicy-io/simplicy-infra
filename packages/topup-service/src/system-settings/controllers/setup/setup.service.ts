import { Injectable, HttpService, UnauthorizedException } from '@nestjs/common';
import { ServerSettingsService } from '../../entities/server-settings/server-settings.service';
import { ServerSettings } from '../../entities/server-settings/server-settings.interface';

@Injectable()
export class SetupService {
  protected settings: ServerSettings;

  constructor(
    protected readonly serverSettingsService: ServerSettingsService,
    protected readonly http: HttpService,
  ) {}

  async setup(params) {
    if (await this.serverSettingsService.count()) {
      throw new UnauthorizedException({ SYSTEM_SETTINGS_ALREADY_EXISTS: true });
    }
    this.http
      .get(params.authServerURL + '/.well-known/openid-configuration')
      .subscribe({
        next: async response => {
          params.authorizationURL = response.data.authorization_endpoint;
          params.tokenURL = response.data.token_endpoint;
          params.profileURL = response.data.userinfo_endpoint;
          params.revocationURL = response.data.revocation_endpoint;
          params.introspectionURL = response.data.introspection_endpoint;
          params.callbackURLs = [
            params.appURL + '/index.html',
            params.appURL + '/silent-refresh.html',
          ];
          this.settings = await this.serverSettingsService.save(params);
          return this.settings;
        },
        error: () => {
          // TODO : Log error
        },
      });
  }

  async getInfo() {
    const info = await this.serverSettingsService.find();
    if (info) {
      info.clientSecret = undefined;
      info._id = undefined;
      info.clientTokenUuid = undefined;
    }
    return info;
  }
}
