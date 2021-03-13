import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BunqState } from './bunq-state.interface';
import { BUNQ_STATE } from './bunq-state.schema';

@Injectable()
export class BunqStateService {
  constructor(
    @Inject(BUNQ_STATE)
    private readonly model: Model<BunqState>,
  ) {}

  async save(params) {
    return await this.model.create(params);
  }

  async find(params?): Promise<BunqState[]> {
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
