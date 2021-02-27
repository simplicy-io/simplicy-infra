import { Component, NgZone, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TokenService } from './auth/token/token.service';
import { LOGGED_IN, APP_KEY } from './auth/token/storage-constants';
import { Router } from '@angular/router';
import { APP_INFO_URL } from './auth/token/credentials-config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  loggedIn: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private token: TokenService,
    private ngZone: NgZone,
    private router: Router,
    public nav: NavController,
  ) {
    this.initializeApp();
    this.backButtonEventListener();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.catchUrlScheme();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.loggedIn = localStorage.getItem(LOGGED_IN) ? true : false;
    this.token.configure(APP_INFO_URL);
  }

  logIn() {
    this.token.logIn();
  }

  logOut() {
    this.token.logOut();
  }

  catchUrlScheme() {
    // https://github.com/EddyVerbruggen/Custom-URL-scheme/issues/227
    (window as any).handleOpenURL = (url: string) => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.handleOpenUrl(url);
        });
      }, 0);
    };
  }

  handleOpenUrl(url: string) {
    this.token.processCode(url);
  }

  backButtonEventListener() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navigateToPreviousPage();
    });
  }

  navigateToPreviousPage() {
    // https://link.medium.com/Zy0YtQDTSY
    const url = this.router.url;
    if (url === '/home' && this.platform.is('cordova')) {
      navigator[APP_KEY].exitApp();
    } else {
      this.nav.navigateBack(
        url.replace(new RegExp('(/([a-zA-Z0-9-.])*)$'), ''),
      );
    }
  }
}
