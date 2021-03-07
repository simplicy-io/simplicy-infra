import { Injectable } from '@nestjs/common';
import StorageInterface from '@bunq-community/bunq-js-client/dist/Interfaces/StorageInterface';
import { BunqSessionService } from '../../../entities/bunq-session/bunq-session.service';

@Injectable()
export class BunqStorage implements StorageInterface {
  constructor(private readonly store: BunqSessionService) {}

  async get(key: string): Promise<any> {
    const value = await this.store.findOne({ key });
    return value?.value;
  }

  async set(key: string, value: any): Promise<any> {
    return await this.store.save({ key, value });
  }

  async remove(key: string): Promise<any> {
    return await this.store.deleteOne({ key });
  }
}
