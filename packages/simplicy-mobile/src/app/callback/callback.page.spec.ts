import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TokenService } from '../auth/token/token.service';

import { CallbackPage } from './callback.page';

describe('CallbackPage', () => {
  let component: CallbackPage;
  let fixture: ComponentFixture<CallbackPage>;
  const tokenSpy = jasmine.createSpyObj('TokenService', ['processCode']);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CallbackPage],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [{ provide: TokenService, useValue: tokenSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(CallbackPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
