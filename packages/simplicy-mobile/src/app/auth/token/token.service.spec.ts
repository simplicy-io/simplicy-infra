import { TestBed } from '@angular/core/testing';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BrowserTab } from '@ionic-native/browser-tab/ngx';

import { TokenService } from './token.service';
import { HttpClientModule } from '@angular/common/http';

describe('TokenService', () => {
  const iabSpy = jasmine.createSpyObj('InAppBrowser', ['create']);
  const browserTabSpy = jasmine.createSpyObj('BrowserTab', [
    'isAvailable',
    'openUrl',
  ]);

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: InAppBrowser, useValue: iabSpy },
        { provide: BrowserTab, useValue: browserTabSpy },
      ],
    }),
  );

  it('should be created', () => {
    const service: TokenService = TestBed.inject(TokenService);
    expect(service).toBeTruthy();
  });
});
