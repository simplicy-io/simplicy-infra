import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HomePage } from './home.page';
import { TokenService } from '../auth/token/token.service';
import { of } from 'rxjs';
import { OAuth2Config } from '../auth/token/credentials-config';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        {
          provide: TokenService,
          useValue: {
            getToken: () => of('420'),
            config: of({} as OAuth2Config),
          },
        },
      ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
