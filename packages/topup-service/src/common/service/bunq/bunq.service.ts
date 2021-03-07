import BunqJSClient from '@bunq-community/bunq-js-client';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BunqStorage } from '../../../topup/aggregates/topup/bunq-storage/bunq-storage';
import {
  BUNQ_API_KEY,
  BUNQ_ENC_KEY,
  BUNQ_ENV,
  ConfigService,
} from '../../../config/config.service';
import { BunqLogger } from './bunq-logger';
import { uniqueDeviceName } from '../../../common/unique-name.generator';

@Injectable()
export class BunqService implements OnModuleInit {
  bunqClient: BunqJSClient;

  constructor(
    private readonly config: ConfigService,
    private readonly bunqStore: BunqStorage,
  ) {}

  async onModuleInit() {
    const encKey = this.config.get(BUNQ_ENC_KEY);
    const apiKey = this.config.get(BUNQ_API_KEY);
    const environment = this.config.get(BUNQ_ENV);
    const deviceName = uniqueDeviceName();
    Logger.log(deviceName, this.constructor.name);
    // create a new bunqJSClient with the new storage instance
    this.bunqClient = new BunqJSClient(this.bunqStore, new BunqLogger());

    // run the bunq application with our API key
    await this.bunqClient.run(apiKey, [], environment, encKey);

    // disables the automatic requests to keep the current session alive
    // instead it'll create a new session when it is required
    await this.bunqClient.setKeepAlive(false);

    // install a new keypair
    await this.bunqClient.install();

    // register this device
    await this.bunqClient.registerDevice(deviceName);

    // register a new session
    await this.bunqClient.registerSession();
  }
}
