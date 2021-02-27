import { Component, OnInit } from '@angular/core';
import { TokenService } from '../auth/token/token.service';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LOGGED_IN } from '../auth/token/storage-constants';
import { Web3Service } from '../auth/web3/web3.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  name: string;
  email: string;
  picture: string;
  loggedIn: boolean;
  address: string;
  privateKey: string;
  accessToken: string;
  signature: string;

  constructor(
    private readonly token: TokenService,
    private readonly web3: Web3Service,
    private readonly http: HttpClient,
  ) {}

  ngOnInit() {
    this.loggedIn = localStorage.getItem(LOGGED_IN) ? true : false;

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
        },
        error: error => {},
      });
  }

  createAccount() {
    const account = this.web3.createAccount();
    this.address = account.address;
    this.privateKey = account.privateKey;
  }

  signMessage() {
    const signedMsg = this.web3.signMessage(this.privateKey);
    this.signature = signedMsg.signature;
  }
}
