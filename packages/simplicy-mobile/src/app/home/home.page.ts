import { Component, OnInit } from '@angular/core';
import { TokenService } from '../auth/token/token.service';
import { retry, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import {
  AUTHORIZATION,
  LOGGED_IN,
  PRIVATE_KEY,
  WALLET_ADDRESS,
  MNEMONIC,
} from '../auth/token/storage-constants';
import { Web3Service } from '../auth/web3/web3.service';
import { SET_ITEM, StorageService } from '../auth/storage/storage.service';
import { environment } from '../../environments/environment';
import {
  CREATE_ACCOUNT_ADDRESS_ENDPOINT,
  FETCH_ACCOUNT_BY_PHONE_ENDPOINT,
  BALANCE_OF_ENDPOINT,
} from '../common/url-endpoints';
import { FetchAccountResponse } from './fetch-account-response.interface';
import { SecureStorageService } from '../auth/secure-storage/secure-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  name: string;
  email: string;
  phone: string;
  picture: string;
  loggedIn: boolean;
  address: string;
  accessToken: string;
  balance: number;
  privateKey: string;
  mnemonic: string;
  isSecretVisible = false;

  constructor(
    private readonly token: TokenService,
    private readonly web3: Web3Service,
    private readonly http: HttpClient,
    private readonly store: StorageService,
    private readonly secureStore: SecureStorageService,
    private readonly platform: Platform,
  ) {}

  ngOnInit() {
    this.loggedIn = this.store.getItem(LOGGED_IN) === 'true';
    this.store.changes.subscribe({
      next: res => {
        if (res.event === SET_ITEM && res.value?.key === LOGGED_IN) {
          this.loggedIn = res.value?.value === 'true';
          if (this.loggedIn) {
            this.loadProfile();
            this.fetchAccount();
          }
        }
      },
      error: error => {},
    });

    if (this.loggedIn) {
      this.loadProfile();
      this.fetchAccount();
    }
  }

  revealSecrets() {
    this.isSecretVisible = !this.isSecretVisible;
    this.loadSecrets();
  }

  createAccount() {
    this.token
      .getToken()
      .pipe(
        switchMap(token => {
          const account = this.web3.createAccount();
          this.privateKey = account.privateKey;
          this.mnemonic = account.mnemonic.phrase;
          const signedMsg = this.web3.signMessage(account.privateKey);
          const signature = signedMsg.signature;
          return this.http.post<FetchAccountResponse>(
            environment.identityService + CREATE_ACCOUNT_ADDRESS_ENDPOINT,
            {
              address: account.address,
              signature,
            },
            { headers: { [AUTHORIZATION]: `Bearer ${token}` } },
          );
        }),
      )
      .subscribe({
        next: res => {
          this.address = res?.address;
          this.store.setItem(WALLET_ADDRESS, this.address);
          this.storeSecrets();
        },
        error: error => {},
      });
  }

  loadProfile() {
    this.token.config
      .pipe(
        switchMap(config => {
          return this.token.getToken().pipe(
            switchMap(token => {
              this.accessToken = token;
              return this.http.get<any>(
                config.authServerUrl + '/oauth2/profile',
                { headers: { authorization: 'Bearer ' + token } },
              );
            }),
          );
        }),
      )
      .subscribe({
        next: profile => {
          this.name = profile.name;
          this.email = profile.email;
          this.picture = profile.picture;
          this.phone = profile.phone_number;
          this.loadSecrets();
        },
        error: error => {},
      });
  }

  fetchAccount() {
    this.token
      .getToken()
      .pipe(
        switchMap(token => {
          return this.http.get<FetchAccountResponse>(
            environment.identityService + FETCH_ACCOUNT_BY_PHONE_ENDPOINT,
            { headers: { [AUTHORIZATION]: `Bearer ${token}` } },
          );
        }),
        retry(3),
      )
      .subscribe({
        next: res => {
          this.address = res?.address;
          this.fetchBalance();
        },
        error: error => {},
      });
  }

  fetchBalance() {
    this.http
      .get<{ balance: number }>(
        environment.identityService + BALANCE_OF_ENDPOINT,
        { params: { address: this.address } },
      )
      .subscribe({
        next: res => {
          this.balance = res.balance;
        },
        error: error => {},
      });
  }

  loadSecrets() {
    if (this.platform.is('pwa') || this.platform.is('desktop')) {
      // for development only
      this.privateKey = this.store.getItem(PRIVATE_KEY);
      this.mnemonic = this.store.getItem(MNEMONIC);
    }

    if (this.platform.is('android') || this.platform.is('ios')) {
      this.secureStore
        .getItem(MNEMONIC)
        .then(mnemonic => (this.mnemonic = mnemonic as string))
        .catch(fail => {});
      this.secureStore
        .getItem(PRIVATE_KEY)
        .then(privateKey => (this.privateKey = privateKey as string))
        .catch(fail => {});
    }
  }

  storeSecrets() {
    if (this.platform.is('pwa') || this.platform.is('desktop')) {
      // for development only
      this.store.setItem(PRIVATE_KEY, this.privateKey);
      this.store.setItem(MNEMONIC, this.mnemonic);
    }

    // save private key safely
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.secureStore
        .setItem(PRIVATE_KEY, this.privateKey)
        .then(success => {})
        .catch(error => {});
      this.secureStore
        .setItem(MNEMONIC, this.mnemonic)
        .then(success => {})
        .catch(error => {});
    }
  }
}
