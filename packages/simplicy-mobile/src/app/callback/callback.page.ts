import { Component, OnInit } from '@angular/core';
import { TokenService } from '../auth/token/token.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  styleUrls: ['./callback.page.scss'],
})
export class CallbackPage implements OnInit {
  constructor(private readonly token: TokenService) {}

  ngOnInit() {
    const url = location.href;
    this.token.processCode(url);
  }
}
