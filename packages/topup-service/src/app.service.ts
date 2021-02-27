import { Injectable } from '@nestjs/common';
import { ConfigService, STRIPE_PUBLIC_KEY } from './config/config.service';
import { SERVICE } from './constants/app-strings';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getRoot() {
    return { service: SERVICE };
  }

  getInfo() {
    return {
      stripe_public_key: this.configService.get(STRIPE_PUBLIC_KEY),
    };
  }
}
