import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../auth/token/token.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  styleUrls: ['./callback.page.scss'],
})
export class CallbackPage implements OnInit {
  constructor(
    private readonly token: TokenService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    const url = location.href;
    Promise.resolve(this.token.processCode(url))
      .then(() => this.router.navigate(['/home']))
      .then(success => {})
      .catch(error => {});
  }
}
