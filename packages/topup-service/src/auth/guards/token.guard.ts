import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
  HttpService,
  ForbiddenException,
} from '@nestjs/common';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of, from, throwError } from 'rxjs';
import Express from 'express';
import {
  AUTHORIZATION,
  BEARER_HEADER_VALUE_PREFIX,
  TOKEN,
} from '../../constants/app-strings';
import { FETCH_ACCOUNT_BY_PHONE_ENDPOINT } from '../../constants/url-endpoints';
import { TokenCacheService } from '../entities/token-cache/token-cache.service';
import {
  Account,
  TokenCache,
} from '../entities/token-cache/token-cache.interface';
import { ServerSettingsService } from '../../system-settings/entities/server-settings/server-settings.service';
import { ConfigService, ID_SERVICE } from '../../config/config.service';
import { PLEASE_RUN_SETUP } from '../../constants/messages';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly settingsService: ServerSettingsService,
    private readonly tokenCacheService: TokenCacheService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const accessToken = this.getAccessToken(req);
    if (!accessToken) {
      throw new ForbiddenException();
    }

    return from(this.tokenCacheService.findOne({ accessToken })).pipe(
      switchMap(cachedToken => {
        if (!cachedToken) {
          return this.introspectToken(accessToken, req);
        } else if (Math.floor(new Date().getTime() / 1000) < cachedToken.exp) {
          req[TOKEN] = cachedToken;
          return of(true);
        } else if (!cachedToken.refreshToken) {
          this.deleteToken(cachedToken);
          return this.introspectToken(accessToken, req);
        }
      }),
    );
  }

  introspectToken(accessToken: string, req: Express.Request) {
    return from(this.settingsService.find()).pipe(
      switchMap(settings => {
        if (!settings) {
          return throwError(new NotImplementedException(PLEASE_RUN_SETUP));
        }
        return this.http
          .post(
            settings.introspectionURL,
            { token: accessToken },
            {
              auth: {
                username: settings.clientId,
                password: settings.clientSecret,
              },
            },
          )
          .pipe(
            switchMap(response => {
              const headers = {
                [AUTHORIZATION]: `${BEARER_HEADER_VALUE_PREFIX} ${accessToken}`,
              };
              return this.http
                .get(
                  this.config.get(ID_SERVICE) + FETCH_ACCOUNT_BY_PHONE_ENDPOINT,
                  { headers },
                )
                .pipe(
                  map(res => {
                    delete res.data._id;
                    response.data.account = res.data;
                    return response;
                  }),
                );
            }),
            switchMap(response => {
              if (response.data.active) {
                return from(this.cacheToken(response.data, accessToken)).pipe(
                  switchMap(cachedToken => {
                    req[TOKEN] = cachedToken;
                    return of(cachedToken.active);
                  }),
                );
              }
              return of(false);
            }),
          );
      }),
      catchError(error => of(false)),
    );
  }

  getAccessToken(request) {
    if (!request.headers.authorization) {
      if (!request.query.access_token) return null;
    }
    return (
      request.query.access_token ||
      request.headers.authorization.split(' ')[1] ||
      null
    );
  }

  cacheToken(
    introspectedToken: TokenCache & {
      client_id: string;
      trusted_client: number;
      email_verified: boolean;
      phone_number: string;
      phone_number_verified: boolean;
      account: Account;
    },
    accessToken: string,
  ): Promise<TokenCache> {
    introspectedToken.accessToken = accessToken;
    introspectedToken.clientId = introspectedToken.client_id;
    introspectedToken.trustedClient = introspectedToken.trusted_client;
    introspectedToken.emailVerified = introspectedToken.email_verified;
    introspectedToken.phoneNumber = introspectedToken.phone_number;
    introspectedToken.phoneNumberVerified =
      introspectedToken.phone_number_verified;
    return this.tokenCacheService.save(introspectedToken);
  }

  deleteToken(cachedToken: TokenCache) {
    from(this.settingsService.find())
      .pipe(
        switchMap(settings => {
          return from(
            this.tokenCacheService.deleteMany({
              uuid: { $ne: settings.clientTokenUuid },
              accessToken: cachedToken.accessToken,
            }),
          );
        }),
      )
      .subscribe({
        next: () => {},
        error: () => {},
      });
  }
}
