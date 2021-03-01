import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { OAuth2Config } from './credentials-config';
import {
  STATE,
  CODE_VERIFIER,
  REFRESH_TOKEN,
  EXPIRES_IN,
  ACCESS_TOKEN,
  ID_TOKEN,
  LOGGED_IN,
  ONE_HOUR_IN_SECONDS_NUMBER,
  SPLASHSCREEN_KEY,
  TEN_MINUTES_IN_SECONDS_NUMBER,
  AUTH_SERVER_URL_KEY,
  AUTHORIZATION_URL_KEY,
  CLIENT_ID_KEY,
  PROFILE_URL_KEY,
  REVOCATION_URL_KEY,
  TOKEN_URL_KEY,
  APP_URL_KEY,
} from './storage-constants';
import * as sjcl from 'sjcl';
import { stringify } from 'querystring';
import { Platform } from '@ionic/angular';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { AppInfo } from './app-info.interface';
import { StorageService } from '../storage/storage.service';
import { SETTINGS_STORAGE } from '../secure-storage/secure-storage.service';

export const APP_SCOPE = 'profile%20openid%20email%20roles%20phone';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  config: Observable<OAuth2Config>;
  private headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  constructor(
    private iab: InAppBrowser,
    private http: HttpClient,
    private platform: Platform,
    private browserTab: BrowserTab,
    private store: StorageService,
  ) {}

  configure(infoUrl: string) {
    this.config = this.http.get<AppInfo>(infoUrl).pipe(
      map(appInfo => {
        return {
          authServerUrl: appInfo.authServerURL,
          authorizationUrl: appInfo.authorizationURL,
          callbackUrl: appInfo.appURL + '/connected_device/callback',
          clientId: appInfo.clientId,
          logoutUrl: appInfo.appURL + '/connected_device/revoke_token',
          profileUrl: appInfo.profileURL,
          revocationUrl: appInfo.revocationURL,
          scope: APP_SCOPE,
          tokenUrl: appInfo.tokenURL,
          jwksUrl: appInfo.authServerURL + '/.well-known/jwks',
        } as OAuth2Config;
      }),
      catchError(error => {
        return of({
          authServerUrl: this.store.getItem(AUTH_SERVER_URL_KEY),
          authorizationUrl: this.store.getItem(AUTHORIZATION_URL_KEY),
          callbackUrl:
            this.store.getItem(APP_URL_KEY) + '/connected_device/callback',
          clientId: this.store.getItem(CLIENT_ID_KEY),
          logoutUrl:
            this.store.getItem(APP_URL_KEY) + '/connected_device/revoke_token',
          profileUrl: this.store.getItem(PROFILE_URL_KEY),
          revocationUrl: this.store.getItem(REVOCATION_URL_KEY),
          scope: APP_SCOPE,
          tokenUrl: this.store.getItem(TOKEN_URL_KEY),
          jwksUrl:
            this.store.getItem(AUTH_SERVER_URL_KEY) + '/.well-known/jwks',
        } as OAuth2Config);
      }),
      map(appInfo => {
        for (const key of Object.keys(appInfo)) {
          this.store.setItem(key, appInfo[key]);
        }
        return appInfo;
      }),
    );
  }

  logIn() {
    this.generateAuthUrl().subscribe({
      next: url => {
        if (this.platform.is('cordova')) {
          this.browserTab.isAvailable().then(isAvailable => {
            if (isAvailable) {
              this.browserTab.openUrl(url);
            } else {
              // open URL with InAppBrowser instead
              this.iab.create(url, '_system', { location: 'yes' });
            }
          });
        } else {
          // open URL with InAppBrowser instead
          this.iab.create(url, '_system', { location: 'yes' });
        }
      },
    });
  }

  logOut() {
    this.revokeToken(this.store.getItem(ACCESS_TOKEN), true);
  }

  processCode(url: string) {
    const savedState = this.store.getItem(STATE);
    this.store.removeItem(STATE);

    const urlParts = new URL(url);
    const query = new URLSearchParams(urlParts.searchParams);
    const code = query.get('code') as string;
    const state = query.get('state') as string;
    const error = query.get('error');

    if (savedState !== state) {
      return;
    }

    if (error) {
      return;
    }

    if (code) {
      const codeVerifier = this.store.getItem(CODE_VERIFIER);
      this.store.removeItem(CODE_VERIFIER);

      this.config
        .pipe(
          switchMap(config => {
            const req: any = {
              grant_type: 'authorization_code',
              code,
              redirect_uri: config.callbackUrl,
              client_id: config.clientId,
              scope: config.scope,
              code_verifier: codeVerifier,
            };

            return this.http.post<any>(config.tokenUrl, stringify(req), {
              headers: this.headers,
            });
          }),
        )
        .subscribe({
          next: response => {
            const expiresIn = response.expires_in || ONE_HOUR_IN_SECONDS_NUMBER;
            const expirationTime = new Date();
            expirationTime.setSeconds(
              expirationTime.getSeconds() + Number(expiresIn),
            );

            this.store.setItem(ACCESS_TOKEN, response.access_token);

            this.saveRefreshToken(response.refresh_token);

            this.store.setItem(EXPIRES_IN, expirationTime.toISOString());
            this.store.setItem(ID_TOKEN, response.id_token);
            this.store.setItem(LOGGED_IN, 'true');

            this.refreshCordova();
          },
          error: err => {},
        });
    }
  }

  revokeToken(accessToken: string, refresh: boolean = false) {
    const token = this.store.getItem(ACCESS_TOKEN);
    this.config
      .pipe(
        switchMap(config => {
          return this.http.post(config.logoutUrl, stringify({ token }), {
            headers: {
              ...this.headers,
              ...{
                authorization: 'Bearer ' + accessToken,
              },
            },
          });
        }),
      )
      .subscribe({
        next: success => {
          if (refresh) {
            this.refreshCordova();
            this.store.setItem(LOGGED_IN, 'false');
          }
        },
        error: error => {},
      });
  }

  getToken() {
    const expiration = this.store.getItem(EXPIRES_IN);
    if (expiration) {
      const now = new Date();
      const expirationTime = new Date(expiration);

      // expire 10 min early
      expirationTime.setSeconds(
        expirationTime.getSeconds() - TEN_MINUTES_IN_SECONDS_NUMBER,
      );
      if (now < expirationTime) {
        const accessToken = this.store.getItem(ACCESS_TOKEN);
        return of(accessToken);
      }
      return this.refreshToken();
    }
    return of();
  }

  getTokenIdToken() {
    const expiration = this.store.getItem(EXPIRES_IN);
    if (expiration) {
      const now = new Date();
      const expirationTime = new Date(expiration);

      // expire 10 min early
      expirationTime.setSeconds(
        expirationTime.getSeconds() - TEN_MINUTES_IN_SECONDS_NUMBER,
      );
      if (now < expirationTime) {
        const idToken = this.store.getItem(ID_TOKEN);
        return of(idToken);
      }
      return this.refreshToken().pipe(
        map(refreshToken => {
          return this.store.getItem(ID_TOKEN);
        }),
      );
    }
    return of();
  }

  refreshToken() {
    return this.config.pipe(
      switchMap(config => {
        return from(this.getRefreshToken()).pipe(
          switchMap(refreshToken => {
            const requestBody = {
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              redirect_uri: config.callbackUrl,
              client_id: config.clientId,
              scope: config.scope,
            };
            return this.http
              .post<any>(config.tokenUrl, stringify(requestBody), {
                headers: this.headers,
              })
              .pipe(
                switchMap(bearerToken => {
                  this.revokeToken(bearerToken.access_token);
                  const expirationTime = new Date();
                  const expiresIn =
                    bearerToken.expires_in || ONE_HOUR_IN_SECONDS_NUMBER;
                  expirationTime.setSeconds(
                    expirationTime.getSeconds() + Number(expiresIn),
                  );
                  this.store.setItem(EXPIRES_IN, expirationTime.toISOString());
                  this.store.setItem(ID_TOKEN, bearerToken.id_token);
                  this.store.setItem(ACCESS_TOKEN, bearerToken.access_token);

                  this.saveRefreshToken(bearerToken.refresh_token);
                  return of(bearerToken.access_token);
                }),
              );
          }),
        );
      }),
    );
  }

  generateAuthUrl() {
    return this.config.pipe(
      switchMap(config => {
        const state = this.generateRandomString();
        this.store.setItem(STATE, state);

        const codeVerifier = this.generateRandomString();
        this.store.setItem(CODE_VERIFIER, codeVerifier);

        const challenge = sjcl.codec.base64
          .fromBits(sjcl.hash.sha256.hash(codeVerifier))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');

        let url = config.authorizationUrl;
        url += '?scope=' + config.scope;
        url += '&response_type=code';
        url += '&client_id=' + config.clientId;
        url += '&redirect_uri=' + encodeURIComponent(config.callbackUrl);
        url += '&state=' + state;
        url += '&code_challenge_method=S256&prompt=select_account';
        url += '&code_challenge=' + challenge;

        return of(url);
      }),
    );
  }

  generateRandomString(stateLength: number = 32) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < stateLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  refreshCordova() {
    if (this.platform.is('cordova')) {
      const initialUrl = window.location.href;
      navigator[SPLASHSCREEN_KEY].show();
      window.location.href = initialUrl;
    }
  }

  saveRefreshToken(refreshToken: string) {
    if (this.platform.is('pwa') || this.platform.is('desktop')) {
      this.store.setItem(REFRESH_TOKEN, refreshToken);
    }

    if (this.platform.is('android') || this.platform.is('ios')) {
      const sharedPreferences = (window as any).plugins.SharedPreferences.getInstance(
        SETTINGS_STORAGE,
      );
      sharedPreferences.put(
        REFRESH_TOKEN,
        refreshToken,
        success => {},
        error => {},
      );
    }
  }

  getRefreshToken(): Promise<string> {
    if (this.platform.is('pwa') || this.platform.is('desktop')) {
      return Promise.resolve(this.store.getItem(REFRESH_TOKEN));
    }

    if (this.platform.is('android') || this.platform.is('ios')) {
      const sharedPreferences = (window as any).plugins.SharedPreferences.getInstance(
        SETTINGS_STORAGE,
      );
      return new Promise((resolve, reject) => {
        sharedPreferences.get(
          REFRESH_TOKEN,
          null,
          refreshToken => resolve(refreshToken),
          error => reject(error),
        );
      });
    }
  }
}
