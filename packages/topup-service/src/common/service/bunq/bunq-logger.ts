import LoggerInterface from '@bunq-community/bunq-js-client/dist/Interfaces/LoggerInterface';
import { Logger } from '@nestjs/common';

export class BunqLogger implements LoggerInterface {
  log(value: any): void {
    Logger.log(value, this.constructor.name);
  }

  info(value: any): void {
    Logger.log(value, this.constructor.name);
  }

  error(value: any): void {
    Logger.error(value, value, this.constructor.name);
  }

  debug(value: any): void {
    Logger.debug(value, this.constructor.name);
  }

  trace(value: any): void {
    Logger.log(value, this.constructor.name);
  }

  warn(value: any): void {
    Logger.warn(value, this.constructor.name);
  }
}
