import { Injectable } from '@nestjs/common';
import { SERVICE } from './constants/app-strings';

@Injectable()
export class AppService {
  getRoot() {
    return { service: SERVICE };
  }
}
