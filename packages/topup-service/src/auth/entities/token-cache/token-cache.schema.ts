import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const schema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    accessToken: String,
    refreshToken: String,
    active: Boolean,
    exp: Number,
    sub: String,
    email: String,
    emailVerified: Boolean,
    phoneNumber: String,
    phoneNumberVerified: Boolean,
    name: String,
    scope: [String],
    roles: [String],
    clientId: String,
    trustedClient: Boolean,
    account: mongoose.Schema.Types.Mixed,
  },
  { collection: 'token_cache', versionKey: false },
);

export const TokenCache = schema;

export const TOKEN_CACHE = 'TokenCache';
