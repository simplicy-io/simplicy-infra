import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BunqSession } from './bunq-session.interface';
import { BUNQ_SESSION } from './bunq-session.schema';

@Injectable()
export class BunqSessionService {
  constructor(
    @Inject(BUNQ_SESSION)
    private readonly model: Model<BunqSession>,
  ) {}

  async save(params) {
    return await this.model.create(params);
  }

  async find(params?): Promise<BunqSession[]> {
    return await this.model.find(params);
  }

  async findOne(conditions?, projection?, options?) {
    return await this.model.findOne(conditions, projection, options);
  }

  async updateOne(query, params) {
    return await this.model.updateOne(query, params);
  }

  async count(query?: unknown) {
    return await this.model.estimatedDocumentCount(query);
  }

  async deleteMany(params) {
    return await this.model.deleteMany(params);
  }

  async deleteOne(params) {
    return await this.model.deleteOne(params);
  }
}
