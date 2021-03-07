import Joi from '@hapi/joi';
import dotenv from 'dotenv';
import { Injectable, Logger } from '@nestjs/common';
import { exit } from 'process';

export interface EnvConfig {
  [prop: string]: string;
}

// NodeJS Environment
export const NODE_ENV = 'NODE_ENV';

// MongoDB Connection
export const MONGO_URI_PREFIX = 'MONGO_URI_PREFIX';
export const DB_USER = 'DB_USER';
export const DB_PASSWORD = 'DB_PASSWORD';
export const DB_HOST = 'DB_HOST';
export const DB_NAME = 'DB_NAME';

// Blockchain client
export const BLOCKCHAIN_CLIENT_URL = 'BLOCKCHAIN_CLIENT_URL';

// Bunq Variables
export const BUNQ_ENC_KEY = 'BUNQ_ENC_KEY';
export const BUNQ_API_KEY = 'BUNQ_API_KEY';
export const BUNQ_ENV = 'BUNQ_ENV';
export const BUNQ_USER_ID = 'BUNQ_USER_ID';
export const BUNQ_MONETARY_ACCOUNT_ID = 'BUNQ_MONETARY_ACCOUNT_ID';

// Optional Event Bus Variables
export const EVENTS_HOST = 'EVENTS_HOST';
export const EVENTS_PROTO = 'EVENTS_PROTO';
export const EVENTS_PORT = 'EVENTS_PORT';
export const EVENTS_USER = 'EVENTS_USER';
export const EVENTS_PASSWORD = 'EVENTS_PASSWORD';

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
      [MONGO_URI_PREFIX]: Joi.string().default('mongodb'),
      [BLOCKCHAIN_CLIENT_URL]: Joi.string().required(),
      [DB_USER]: Joi.string().required(),
      [DB_PASSWORD]: Joi.string().required(),
      [DB_HOST]: Joi.string().required(),
      [DB_NAME]: Joi.string().required(),
      [BUNQ_ENC_KEY]: Joi.string().required(),
      [BUNQ_API_KEY]: Joi.string().required(),
      [BUNQ_USER_ID]: Joi.string().required(),
      [BUNQ_MONETARY_ACCOUNT_ID]: Joi.string().required(),
      [BUNQ_ENV]: Joi.string().default('SANDBOX'),
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
