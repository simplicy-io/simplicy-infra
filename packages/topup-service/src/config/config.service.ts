import Joi from '@hapi/joi';
import dotenv from 'dotenv';
import { Injectable, Logger } from '@nestjs/common';
import { exit } from 'process';

export interface EnvConfig {
  [prop: string]: string;
}

export const NODE_ENV = 'NODE_ENV';
export const JWKS_ENDPOINT = 'JWKS_ENDPOINT';
export const RPC_URI = 'RPC_URI';
export const CLIENT_ID = 'CLIENT_ID';
export const CLIENT_SECRET = 'CLIENT_SECRET';
export const EVENTS_HOST = 'EVENTS_HOST';
export const EVENTS_PROTO = 'EVENTS_PROTO';
export const EVENTS_PORT = 'EVENTS_PORT';
export const EVENTS_USER = 'EVENTS_USER';
export const EVENTS_PASSWORD = 'EVENTS_PASSWORD';
export const WALLET_ADDRESS = 'WALLET_ADDRESS';
export const BLOCKCHAIN_CLIENT_URL = 'BLOCKCHAIN_CLIENT_URL';
export const STRIPE_PUBLIC_KEY = 'STRIPE_PUBLIC_KEY';
export const STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const config = dotenv.config().parsed;
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      [NODE_ENV]: Joi.string()
        .valid('development', 'production', 'test', 'provision', 'staging')
        .default('development'),
      [RPC_URI]: Joi.string().uri(),
      [WALLET_ADDRESS]: Joi.string().required(),
      [STRIPE_PUBLIC_KEY]: Joi.string().required(),
      [STRIPE_SECRET_KEY]: Joi.string().required(),
      [BLOCKCHAIN_CLIENT_URL]: Joi.string().required(),
      [CLIENT_ID]: Joi.string().optional(),
      [CLIENT_SECRET]: Joi.string().optional(),
      [JWKS_ENDPOINT]: Joi.string().optional(),
      [EVENTS_PROTO]: Joi.string().optional(),
      [EVENTS_USER]: Joi.string().optional(),
      [EVENTS_PASSWORD]: Joi.string().optional(),
      [EVENTS_HOST]: Joi.string().optional(),
      [EVENTS_PORT]: Joi.string().optional(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      Logger.error(
        'Config validation error:',
        error.message,
        this.constructor.name,
      );
      exit(1);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
