import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { ACCOUNT } from './account.schema';
import { Account } from './account.interface';

@Injectable()
export class AccountService {
  constructor(
    @Inject(ACCOUNT)
    private readonly model: Model<Account>,
  ) {}

  async save(params) {
    const model = new this.model(params);
    return await model.save();
  }

  async findOne(params) {
    return await this.model.findOne(params);
  }

  async delete(params) {
    return await this.model.deleteOne(params);
  }

  async find(params) {
    return await this.model.find(params);
  }

  async clear() {
    return await this.model.deleteMany({});
  }
}
