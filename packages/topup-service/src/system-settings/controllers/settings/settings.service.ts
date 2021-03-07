import { Injectable, HttpService } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ServerSettings } from '../../entities/server-settings/server-settings.interface';
import { RazorPaySettingsDto } from '../../entities/server-settings/server-setting.dto';
import { BASIC_HEADER } from '../../../common/app-constants';

@Injectable()
export class SettingsService {
  constructor(
    private readonly serverSettingsService: ServerSettingsService,
    private readonly tokenService: TokenCacheService,
    private readonly http: HttpService,
  ) {}

  find(): Observable<ServerSettings> {
    const settings = this.serverSettingsService.find();
    return from(settings);
  }

  getInfo() {
    return this.find().pipe(
      map(settings => {
        const settingsJson = settings ? settings.toJSON() : {};
        settingsJson.clientSecret = undefined;
        settingsJson._id = undefined;
        settingsJson.clientTokenUuid = undefined;
        settingsJson.uuid = undefined;
        return settingsJson;
      }),
    );
  }

  update(query, params) {
    return this.find().pipe(
      switchMap(settings => {
        let baseEncodedCred: string;
        if (settings.clientSecret !== params.clientSecret) {
          baseEncodedCred = Buffer.from(
            settings.clientId + ':' + params.clientSecret,
          ).toString('base64');
          return this.http
            .post(
              settings.authServerURL + '/client/v1/verify_changed_secret',
              null,
              { headers: { Authorization: 'Basic ' + baseEncodedCred } },
            )
            .pipe(
              catchError(err => {
                return of(err);
              }),
              switchMap(data => {
                if (data.response && data.response.status > 299) {
                  // TODO: notify error
                  return of({});
                } else {
                  return from(
                    this.serverSettingsService.updateOne(query, params),
                  );
                }
              }),
            );
        } else {
          return from(this.serverSettingsService.updateOne(query, params));
        }
      }),
    );
  }

  updateRazorPaySettings(payload: RazorPaySettingsDto) {
    if (!payload) return;
    return from(
      this.serverSettingsService.updateOne({}, { $set: payload }),
    ).pipe(switchMap(done => of()));
  }

  async clearTokenCache() {
    this.find()
      .pipe(
        switchMap(settings => {
          // Revoke Bearer Tokens with Refresh Tokens
          this.revokeAndDeleteTokens(settings)
            .then(() => {})
            .catch(() => {});
          settings.clientTokenUuid = undefined;
          return from(settings.save());
        }),
      )
      .subscribe({
        next: () => {},
        error: () => {},
      });
    return await this.tokenService.deleteMany({
      refreshToken: { $exists: false, $not: { $size: 0 } },
    });
  }

  async revokeAndDeleteTokens(settings: ServerSettings) {
    const tokens = await this.tokenService.find({
      refreshToken: { $exists: true },
    });

    for (const token of tokens) {
      token
        .save()
        .then(() => {})
        .catch(() => {});
      const credentials = Buffer.from(
        settings.clientId + ':' + settings.clientSecret,
      ).toString('base64');
      this.http
        .post(
          settings.revocationURL,
          { token: token.accessToken },
          { headers: { authorization: `${BASIC_HEADER} ${credentials}` } },
        )
        .subscribe({
          next: () => {},
          error: () => {},
        });
    }
  }
}
