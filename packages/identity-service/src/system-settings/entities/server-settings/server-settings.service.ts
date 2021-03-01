import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { SERVER_SETTINGS } from './server-settings.schema';
import { Model } from 'mongoose';
import { ServerSettings } from './server-settings.interface';

@Injectable()
export class ServerSettingsService {
  constructor(
    @Inject(SERVER_SETTINGS)
    private readonly settings: Model<ServerSettings>,
  ) {}

  async save(params) {
    let serverSettings = {} as ServerSettings;

    if (params.uuid) {
      const exists: number = await this.count();
      serverSettings = await this.findOne({ uuid: params.uuid });
      serverSettings.appURL = params.appURL;
      if (exists > 0 && !serverSettings) {
        throw new UnauthorizedException({
          SYSTEM_SETTINGS_ALREADY_EXISTS: true,
        });
      }
      serverSettings.save();
    } else {
      Object.assign(serverSettings, params);
    }
    return await this.settings.create(serverSettings);
  }

  async find(): Promise<ServerSettings> {
    const settings = await this.settings.find();
    return settings.length ? settings[0] : null;
  }

  async findOne(params) {
    return await this.settings.findOne(params);
  }

  async updateOne(query: unknown, params: unknown) {
    return await this.settings.updateOne(query, params);
  }

  async updateMany(query: unknown, params: unknown) {
    return await this.settings.updateMany(query, params);
  }

  async count(query?: unknown) {
    return await this.settings.estimatedDocumentCount(query);
  }
}
