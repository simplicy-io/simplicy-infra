import { Injectable, Inject } from '@nestjs/common';
import { TOKEN_CACHE } from './token-cache.schema';
import { Model } from 'mongoose';
import { TokenCache } from './token-cache.interface';

@Injectable()
export class TokenCacheService {
  constructor(
    @Inject(TOKEN_CACHE)
    private readonly model: Model<TokenCache>,
  ) {}

  async save(params) {
    return await this.model.create(params);
  }

  async find(params?): Promise<TokenCache[]> {
    return await this.model.find(params);
  }

  async findOne(conditions?, projection?, options?) {
    return await this.model.findOne(conditions, projection, options);
  }

  async update(query, params) {
    return await this.model.update(query, params);
  }

  async count(query?: unknown) {
    return await this.model.estimatedDocumentCount(query);
  }

  async deleteMany(params) {
    return await this.model.deleteMany(params);
  }
}
